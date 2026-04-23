import { useMemo, useState } from "react";
import {
  CartesianGrid,
  Label,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const MAX_RENDERED_PATHS = 200;
const OUTCOME_COLORS = {
  ruin: "#ff4444",
  target: "#00ff9f",
  maxstep: "#888888",
};

function toPercent(value) {
  return `${(value * 100).toFixed(2)}%`;
}

function buildChartData(paths) {
  const maxLength = Math.max(...paths.map((path) => path.length), 0);

  return Array.from({ length: maxLength }, (_, stepIndex) => {
    const point = { step: stepIndex };

    paths.forEach((path, pathIndex) => {
      point[`path_${pathIndex}`] = path[stepIndex] ?? null;
    });

    return point;
  });
}

export default function PathsChart({ result }) {
  const [activePathKey, setActivePathKey] = useState(null);

  const limitedPaths = useMemo(
    () => result.paths.slice(0, MAX_RENDERED_PATHS),
    [result.paths],
  );
  const limitedOutcomes = useMemo(
    () => result.path_outcomes.slice(0, MAX_RENDERED_PATHS),
    [result.path_outcomes],
  );
  const chartData = useMemo(() => buildChartData(limitedPaths), [limitedPaths]);

  return (
    <section className="results-panel">
      <div className="chart-card dashboard-card">
        <div className="chart-card__header">
          <div>
            <p className="section-eyebrow">Simulation Paths</p>
            <h2>Bankroll Over Time</h2>
          </div>
          <p className="chart-card__meta">
            Showing {limitedPaths.length} of {result.paths.length} simulated
            paths
          </p>
        </div>

        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 20, right: 24, left: 8, bottom: 24 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
              <XAxis
                dataKey="step"
                stroke="#bfbfbf"
                tick={{ fill: "#bfbfbf", fontSize: 12 }}
              >
                <Label value="Steps" position="bottom" fill="#ffffff" offset={8} />
              </XAxis>
              <YAxis stroke="#bfbfbf" tick={{ fill: "#bfbfbf", fontSize: 12 }}>
                <Label
                  value="Bankroll"
                  angle={-90}
                  position="insideLeft"
                  fill="#ffffff"
                  style={{ textAnchor: "middle" }}
                />
              </YAxis>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#121212",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "12px",
                  color: "#ffffff",
                }}
                labelStyle={{ color: "#00ff9f" }}
                formatter={(value) =>
                  typeof value === "number" ? value.toFixed(2) : value
                }
              />
              <ReferenceLine
                y={result.starting_capital}
                stroke="#ffffff"
                strokeDasharray="6 6"
                label={{ value: "Start", fill: "#ffffff", position: "insideTopLeft" }}
              />
              <ReferenceLine
                y={result.target}
                stroke="#00ff9f"
                strokeDasharray="6 6"
                label={{ value: "Target", fill: "#00ff9f", position: "insideTopLeft" }}
              />

              {limitedPaths.map((_, pathIndex) => {
                const pathKey = `path_${pathIndex}`;
                const isActive = activePathKey === null || activePathKey === pathKey;

                return (
                  <Line
                    key={pathKey}
                    type="monotone"
                    dataKey={pathKey}
                    stroke={OUTCOME_COLORS[limitedOutcomes[pathIndex]] ?? "#888888"}
                    dot={false}
                    strokeWidth={isActive ? 2 : 1.2}
                    strokeOpacity={isActive ? 1 : 0.3}
                    connectNulls={false}
                    isAnimationActive={false}
                    onMouseEnter={() => setActivePathKey(pathKey)}
                    onMouseLeave={() => setActivePathKey(null)}
                  />
                );
              })}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}

export function StatsBar({ result }) {
  return (
    <div className="stats-bar">
      <div className="stats-pill stats-pill--ruin">
        <span>🔴 Ruin</span>
        <strong>
          {result.n_ruin} paths ({toPercent(result.simulated_ruin_rate)})
        </strong>
      </div>
      <div className="stats-pill stats-pill--target">
        <span>🟢 Target</span>
        <strong>{result.n_target} paths</strong>
      </div>
      <div className="stats-pill stats-pill--maxstep">
        <span>⚪ Incomplete</span>
        <strong>{result.n_maxstep} paths</strong>
      </div>
    </div>
  );
}
