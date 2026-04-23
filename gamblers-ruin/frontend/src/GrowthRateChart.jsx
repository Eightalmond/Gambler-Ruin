import { useMemo } from "react";
import {
  CartesianGrid,
  Label,
  Line,
  LineChart,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const MIN_FRACTION = 0.01;
const MAX_FRACTION = 0.99;
const POINT_COUNT = 100;

function geometricGrowthRate(p, f) {
  return p * Math.log(1 + f) + (1 - p) * Math.log(1 - f);
}

function buildData(p) {
  return Array.from({ length: POINT_COUNT }, (_, index) => {
    const f =
      MIN_FRACTION + ((MAX_FRACTION - MIN_FRACTION) * index) / (POINT_COUNT - 1);
    const g = geometricGrowthRate(p, f);

    return {
      f,
      g,
      positiveG: g > 0 ? g : null,
      negativeG: g < 0 ? g : null,
    };
  });
}

function findZeroCrossing(data) {
  for (let index = 1; index < data.length; index += 1) {
    const previous = data[index - 1];
    const current = data[index];

    if (previous.g >= 0 && current.g <= 0) {
      const slope = current.g - previous.g;

      if (slope === 0) {
        return current.f;
      }

      const t = -previous.g / slope;
      return previous.f + t * (current.f - previous.f);
    }
  }

  return null;
}

function formatFraction(value) {
  return value.toFixed(2);
}

function getInterpretation(kellyFraction, betFraction) {
  if (kellyFraction <= 0) {
    return "No profitable bet size exists for this edge. The entire curve sits below zero.";
  }
  if (betFraction > 2 * kellyFraction) {
    return "Above 2× Kelly — geometric growth rate is negative. You will lose money long run despite positive edge.";
  }
  if (betFraction > kellyFraction) {
    return "You have edge but overbetting is causing volatility drag. Consider reducing bet size to f*.";
  }
  return "Your bet size is within the Kelly optimal range. Expected bankroll grows geometrically over time.";
}

export default function GrowthRateChart({ p, bet_fraction, kelly_fraction }) {
  const data = useMemo(() => buildData(p), [p]);
  const zeroCrossing = useMemo(() => findZeroCrossing(data), [data]);
  const doubleKelly = kelly_fraction * 2;

  return (
    <section className="growth-panel">
      <div className="chart-card">
        <div className="chart-card__header">
          <div>
            <p className="chart-card__eyebrow">Growth Curve</p>
            <h2>Why Overbetting Breaks Compounding</h2>
          </div>
        </div>

        <div className="growth-chart-wrapper">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 20, right: 24, left: 8, bottom: 24 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
              {kelly_fraction > 0 ? (
                <ReferenceArea
                  x1={0}
                  x2={Math.min(kelly_fraction, MAX_FRACTION)}
                  fill="rgba(0, 255, 159, 0.08)"
                  ifOverflow="extendDomain"
                />
              ) : null}
              {kelly_fraction > 0 && zeroCrossing && zeroCrossing > kelly_fraction ? (
                <ReferenceArea
                  x1={Math.min(kelly_fraction, MAX_FRACTION)}
                  x2={Math.min(zeroCrossing, MAX_FRACTION)}
                  fill="rgba(255, 68, 68, 0.08)"
                  ifOverflow="extendDomain"
                />
              ) : null}
              <XAxis
                dataKey="f"
                type="number"
                domain={[MIN_FRACTION, MAX_FRACTION]}
                tickFormatter={formatFraction}
                stroke="#bfbfbf"
                tick={{ fill: "#bfbfbf", fontSize: 12 }}
              >
                <Label
                  value="Bet Fraction (f)"
                  position="bottom"
                  fill="#ffffff"
                  offset={8}
                />
              </XAxis>
              <YAxis stroke="#bfbfbf" tick={{ fill: "#bfbfbf", fontSize: 12 }}>
                <Label
                  value="Growth Rate (g)"
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
                  typeof value === "number" ? value.toFixed(4) : value
                }
                labelFormatter={(value) => `f = ${Number(value).toFixed(2)}`}
              />
              <ReferenceLine y={0} stroke="#888888" strokeDasharray="6 6" />
              {kelly_fraction > 0 ? (
                <ReferenceLine
                  x={Math.min(kelly_fraction, MAX_FRACTION)}
                  stroke="#00ff9f"
                  label={{ value: "Kelly f*", fill: "#00ff9f", position: "insideTopLeft" }}
                />
              ) : null}
              {doubleKelly > 0 ? (
                <ReferenceLine
                  x={Math.min(doubleKelly, MAX_FRACTION)}
                  stroke="#ffd700"
                  label={{ value: "2× Kelly", fill: "#ffd700", position: "insideTopLeft" }}
                />
              ) : null}
              <ReferenceLine
                x={bet_fraction}
                stroke="#ff4444"
                label={{ value: "Your f", fill: "#ff4444", position: "insideTopRight" }}
              />
              <Line
                type="monotone"
                dataKey="positiveG"
                stroke="#00ff9f"
                dot={false}
                strokeWidth={2.4}
                isAnimationActive={false}
                connectNulls
              />
              <Line
                type="monotone"
                dataKey="negativeG"
                stroke="#ff4444"
                dot={false}
                strokeWidth={2.4}
                isAnimationActive={false}
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <p className="growth-panel__insight">
          {getInterpretation(kelly_fraction, bet_fraction)}
        </p>
      </div>
    </section>
  );
}
