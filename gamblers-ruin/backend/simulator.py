import math

import numpy as np


def simulate_paths(p, bet_fraction, starting_capital, target, n_paths, max_steps):
    paths = []
    outcomes = []
    ruin_threshold = float(starting_capital) * 0.01

    for _ in range(n_paths):
        bankroll = float(starting_capital)
        path = [bankroll]
        outcome = "max_steps"

        for _ in range(max_steps):
            step_return = bet_fraction * bankroll

            if np.random.random() < p:
                bankroll += step_return
            else:
                bankroll -= step_return

            bankroll = max(bankroll, 0.0)

            if bankroll <= ruin_threshold:
                bankroll = 0.0
                path.append(bankroll)
                outcome = "ruin"
                break

            path.append(bankroll)

            if bankroll >= target:
                outcome = "target"
                break

        paths.append(path)
        outcomes.append(outcome)

    return paths, outcomes


def theoretical_ruin_probability(p, starting_capital, target):
    if target <= 0:
        raise ValueError("target must be positive")
    if starting_capital < 0:
        raise ValueError("starting_capital must be non-negative")
    if starting_capital > target:
        return 0.0
    if starting_capital == 0:
        return 1.0

    q = 1.0 - p
    b_capital = float(starting_capital)
    t_capital = float(target)

    if math.isclose(p, 0.5):
        return 1.0 - (b_capital / t_capital)

    ratio = q / p
    ruin_probability = ((ratio**b_capital) - (ratio**t_capital)) / (
        1.0 - (ratio**t_capital)
    )
    return max(0.0, min(1.0, ruin_probability))


def kelly_fraction(p, b=1.0):
    q = 1.0 - p
    return p - (q / b)


def geometric_growth_rate(p, f, b=1.0):
    if 1.0 + f * b <= 0:
        raise ValueError("1 + f * b must be positive")
    if 1.0 - f <= 0:
        raise ValueError("1 - f must be positive")

    return p * math.log(1.0 + f * b) + (1.0 - p) * math.log(1.0 - f)


if __name__ == "__main__":
    p = 0.45
    f = 0.20
    b_capital = 50
    target = 200
    n_paths = 200
    max_steps = 500

    _, outcomes = simulate_paths(
        p=p,
        bet_fraction=f,
        starting_capital=b_capital,
        target=target,
        n_paths=n_paths,
        max_steps=max_steps,
    )

    ruin_count = sum(outcome == "ruin" for outcome in outcomes)
    target_count = sum(outcome == "target" for outcome in outcomes)
    max_steps_count = sum(outcome == "max_steps" for outcome in outcomes)
    simulated_ruin_rate = sum(outcome == "ruin" for outcome in outcomes) / n_paths
    kelly_f = kelly_fraction(p=p)
    growth_rate = geometric_growth_rate(p=p, f=f)

    # This formula assumes fixed-dollar additive betting, while the simulation
    # uses multiplicative percentage betting, so the values will not match exactly.
    theoretical_probability = theoretical_ruin_probability(
        p=p,
        starting_capital=b_capital,
        target=target,
    )

    print(f"Kelly fraction: {kelly_f:.4f}")
    print(f"Geometric growth rate: {growth_rate:.4f}")
    print(f"Simulated ruin rate: {simulated_ruin_rate:.4f}")
    print(f"Theoretical ruin probability: {theoretical_probability:.4f}")
    print(f"Ruin paths: {ruin_count}")
    print(f"Target paths: {target_count}")
    print(f"Max-step paths: {max_steps_count}")
