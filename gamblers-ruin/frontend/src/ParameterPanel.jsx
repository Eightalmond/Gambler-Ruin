import { useState } from "react";

const FIELDS = [
  {
    key: "p",
    label: "Win Probability",
    min: 0.01,
    max: 0.99,
    step: 0.01,
    defaultValue: 0.55,
  },
  {
    key: "bet_fraction",
    label: "Bet Size (fraction)",
    min: 0.01,
    max: 0.99,
    step: 0.01,
    defaultValue: 0.1,
  },
  {
    key: "starting_capital",
    label: "Starting Capital",
    min: 10,
    max: 1000,
    step: 10,
    defaultValue: 100,
  },
  {
    key: "target",
    label: "Target Capital",
    min: 20,
    max: 5000,
    step: 10,
    defaultValue: 200,
  },
  {
    key: "n_paths",
    label: "Number of Paths",
    min: 10,
    max: 500,
    step: 10,
    defaultValue: 200,
  },
];

function buildInitialParams() {
  return Object.fromEntries(
    FIELDS.map((field) => [field.key, field.defaultValue]),
  );
}

function formatValue(fieldKey, value) {
  if (fieldKey === "p" || fieldKey === "bet_fraction") {
    return Number(value).toFixed(2);
  }

  return String(value);
}

export default function ParameterPanel({ onResult }) {
  const [params, setParams] = useState(buildInitialParams);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  function updateParam(field, rawValue) {
    const nextValue =
      field.key === "n_paths" ||
      field.key === "starting_capital" ||
      field.key === "target"
        ? Number.parseInt(rawValue, 10)
        : Number.parseFloat(rawValue);

    setParams((current) => ({
      ...current,
      [field.key]: Number.isNaN(nextValue) ? field.min : nextValue,
    }));
  }

  async function runSimulation() {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:8000/simulate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error("Simulation request failed");
      }

      const result = await response.json();
      onResult(result);
    } catch (caughtError) {
      setError(caughtError.message || "Unable to run simulation");
      onResult(null);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <aside className="parameter-panel">
      <div className="parameter-panel__header">
        <p className="parameter-panel__eyebrow">Controls</p>
        <h1>Gambler&apos;s Ruin</h1>
      </div>

      <div className="parameter-panel__fields">
        {FIELDS.map((field) => (
          <div className="parameter-field" key={field.key}>
            <div className="parameter-field__topline">
              <label htmlFor={field.key}>{field.label}</label>
              <span>{formatValue(field.key, params[field.key])}</span>
            </div>

            <input
              id={field.key}
              type="range"
              min={field.min}
              max={field.max}
              step={field.step}
              value={params[field.key]}
              onChange={(event) => updateParam(field, event.target.value)}
            />

            <input
              className="parameter-field__number"
              type="number"
              min={field.min}
              max={field.max}
              step={field.step}
              value={params[field.key]}
              onChange={(event) => updateParam(field, event.target.value)}
            />
          </div>
        ))}
      </div>

      <button
        className="run-button"
        type="button"
        onClick={runSimulation}
        disabled={isLoading}
      >
        {isLoading ? "Running..." : "Run Simulation"}
      </button>

      {error ? <p className="parameter-panel__error">{error}</p> : null}
    </aside>
  );
}
