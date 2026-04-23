import { useState } from "react";

import ParameterPanel from "./ParameterPanel";
import PathsChart from "./PathsChart";

export default function App() {
  const [result, setResult] = useState(null);

  return (
    <div className="app-shell">
      <ParameterPanel onResult={setResult} />
      <main className="main-content">
        <div id="results" data-has-result={result ? "true" : "false"}>
          {result ? (
            <PathsChart result={result} />
          ) : (
            <div className="results-empty">
              <p className="results-empty__eyebrow">Ready</p>
              <h2>Run a simulation to see the bankroll paths.</h2>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
