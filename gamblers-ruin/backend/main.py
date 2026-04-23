from typing import List

import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from simulator import (
    geometric_growth_rate,
    kelly_fraction,
    simulate_paths,
    theoretical_ruin_probability,
)


class SimulationRequest(BaseModel):
    p: float
    bet_fraction: float
    starting_capital: float
    target: float
    n_paths: int = 200
    max_steps: int = 1000


class SimulationResponse(BaseModel):
    paths: List[List[float]]
    path_outcomes: List[str]
    simulated_ruin_rate: float
    theoretical_ruin_probability: float
    kelly_fraction: float
    geometric_growth_rate: float
    n_ruin: int
    n_target: int
    n_maxstep: int


def _trim_path(path: list[float], max_points: int = 300) -> list[float]:
    if len(path) <= max_points:
        return path

    indices = np.linspace(0, len(path) - 1, num=max_points, dtype=int)
    return [path[index] for index in indices]


def _validate_simulation_request(request: SimulationRequest) -> None:
    if not 0.01 <= request.p <= 0.99:
        raise HTTPException(status_code=422, detail="p must be between 0.01 and 0.99")
    if not 0.01 <= request.bet_fraction <= 0.99:
        raise HTTPException(
            status_code=422,
            detail="bet_fraction must be between 0.01 and 0.99",
        )
    if request.target <= request.starting_capital:
        raise HTTPException(
            status_code=422,
            detail="target must be greater than starting_capital",
        )
    if request.starting_capital <= 0:
        raise HTTPException(
            status_code=422,
            detail="starting_capital must be positive",
        )
    if request.n_paths <= 0:
        raise HTTPException(status_code=422, detail="n_paths must be positive")
    if request.max_steps <= 0:
        raise HTTPException(status_code=422, detail="max_steps must be positive")


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/simulate", response_model=SimulationResponse)
def simulate(request: SimulationRequest) -> SimulationResponse:
    _validate_simulation_request(request)

    paths, outcomes = simulate_paths(
        p=request.p,
        bet_fraction=request.bet_fraction,
        starting_capital=request.starting_capital,
        target=request.target,
        n_paths=request.n_paths,
        max_steps=request.max_steps,
    )

    normalized_outcomes = [
        "maxstep" if outcome == "max_steps" else outcome for outcome in outcomes
    ]
    trimmed_paths = [_trim_path(path) for path in paths]

    n_ruin = sum(outcome == "ruin" for outcome in normalized_outcomes)
    n_target = sum(outcome == "target" for outcome in normalized_outcomes)
    n_maxstep = sum(outcome == "maxstep" for outcome in normalized_outcomes)

    return SimulationResponse(
        paths=trimmed_paths,
        path_outcomes=normalized_outcomes,
        simulated_ruin_rate=n_ruin / request.n_paths,
        theoretical_ruin_probability=theoretical_ruin_probability(
            p=request.p,
            starting_capital=request.starting_capital,
            target=request.target,
        ),
        kelly_fraction=kelly_fraction(p=request.p),
        geometric_growth_rate=geometric_growth_rate(
            p=request.p,
            f=request.bet_fraction,
        ),
        n_ruin=n_ruin,
        n_target=n_target,
        n_maxstep=n_maxstep,
    )
