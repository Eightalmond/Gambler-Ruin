function formatPercent(value) {
  return `${(value * 100).toFixed(1)}%`;
}

function getBetSizeColor(betFraction, kellyFraction) {
  if (betFraction <= kellyFraction) {
    return "#00ff9f";
  }
  if (betFraction <= 2 * kellyFraction) {
    return "#ffd700";
  }
  return "#ff4444";
}

function getGrowthColor(growthRate) {
  return growthRate > 0 ? "#00ff9f" : "#ff4444";
}

function getRuinColor(ruinRate) {
  if (ruinRate < 0.2) {
    return "#00ff9f";
  }
  if (ruinRate < 0.5) {
    return "#ffd700";
  }
  return "#ff4444";
}

function getInsightText(kellyFraction, betFraction) {
  if (kellyFraction <= 0) {
    return "⚠️ Negative edge detected — no bet size is profitable long term";
  }
  if (betFraction > 2 * kellyFraction) {
    return "🔴 You are overbetting — above 2× Kelly, growth rate turns negative even with edge";
  }
  if (betFraction > kellyFraction) {
    return "🟡 Slightly above Kelly — you have edge but leaving returns on the table due to volatility drag";
  }
  return "🟢 Well sized — at or below Kelly optimal, maximising long run growth";
}

export default function KellyPanel({
  kelly_fraction,
  bet_fraction,
  geometric_growth_rate,
  simulated_ruin_rate,
}) {
  return (
    <section className="kelly-panel">
      <div className="kelly-grid">
        <article className="kelly-card">
          <span className="kelly-card__label">Kelly Optimal</span>
          <strong className="kelly-card__value">{formatPercent(kelly_fraction)}</strong>
          <span className="kelly-card__subtext">Optimal bet size</span>
        </article>

        <article className="kelly-card">
          <span className="kelly-card__label">Your Bet Size</span>
          <strong
            className="kelly-card__value"
            style={{ color: getBetSizeColor(bet_fraction, kelly_fraction) }}
          >
            {formatPercent(bet_fraction)}
          </strong>
        </article>

        <article className="kelly-card">
          <span className="kelly-card__label">Growth Rate</span>
          <strong
            className="kelly-card__value"
            style={{ color: getGrowthColor(geometric_growth_rate) }}
          >
            {geometric_growth_rate.toFixed(4)}
          </strong>
          <span className="kelly-card__subtext">per step (log)</span>
        </article>

        <article className="kelly-card">
          <span className="kelly-card__label">Ruin Rate</span>
          <strong
            className="kelly-card__value"
            style={{ color: getRuinColor(simulated_ruin_rate) }}
          >
            {formatPercent(simulated_ruin_rate)}
          </strong>
        </article>
      </div>

      <p className="kelly-insight">
        {getInsightText(kelly_fraction, bet_fraction)}
      </p>
    </section>
  );
}
