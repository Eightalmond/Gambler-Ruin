import { useState } from "react";

import ParameterPanel from "./ParameterPanel";

export default function App() {
  const [result, setResult] = useState(null);

  return (
    <div className="app-shell">
      <ParameterPanel onResult={setResult} />
      <main className="main-content">
        <div id="results" data-has-result={result ? "true" : "false"} />
      </main>
    </div>
  );
}
