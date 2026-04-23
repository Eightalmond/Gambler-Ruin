import { useState } from "react";

import KellyPanel from "./KellyPanel";
import ParameterPanel, { buildInitialParams } from "./ParameterPanel";
import PathsChart, { StatsBar } from "./PathsChart";
import Presets from "./Presets";

export default function App() {
  const [params, setParams] = useState(buildInitialParams);
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [activePreset, setActivePreset] = useState(null);

  async function runSimulation(nextParams = params) {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:8000/simulate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nextParams),
      });

      if (!response.ok) {
        throw new Error("Simulation request failed");
      }

      const simulationResult = await response.json();
      setResult({
        ...simulationResult,
        starting_capital: nextParams.starting_capital,
        target: nextParams.target,
      });
    } catch (caughtError) {
      setError(caughtError.message || "Unable to run simulation");
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  }

  function handleSelectPreset(preset) {
    const nextParams = {
      ...params,
      ...preset.params,
    };

    setParams(nextParams);
    setActivePreset(preset.label);
    runSimulation(nextParams);
  }

  return (
    <div className="app-shell">
      <ParameterPanel
        params={params}
        onParamsChange={setParams}
        onRunSimulation={runSimulation}
        isLoading={isLoading}
        error={error}
      />
      <main className="main-content">
        <div id="results" data-has-result={result ? "true" : "false"}>
          {result ? (
            <div className="results-stack">
              <StatsBar result={result} />
              <KellyPanel
                kelly_fraction={result.kelly_fraction}
                bet_fraction={params.bet_fraction}
                geometric_growth_rate={result.geometric_growth_rate}
                simulated_ruin_rate={result.simulated_ruin_rate}
              />
              <PathsChart result={result} />
            </div>
          ) : (
            <div className="results-empty">
              <p className="results-empty__eyebrow">Ready</p>
              <h2>Run a simulation to see the bankroll paths.</h2>
            </div>
          )}
        </div>
      </main>
      <Presets onSelectPreset={handleSelectPreset} activePreset={activePreset} />
    </div>
  );
}
