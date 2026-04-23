const PRESETS = [
  {
    label: "Certain Ruin",
    emoji: "🔴",
    description: "Bad edge + overbetting",
    params: { p: 0.4, bet_fraction: 0.4, starting_capital: 100, target: 300, n_paths: 200 },
  },
  {
    label: "Likely Ruin",
    emoji: "🟠",
    description: "Slight negative edge",
    params: { p: 0.47, bet_fraction: 0.25, starting_capital: 100, target: 300, n_paths: 200 },
  },
  {
    label: "Coin Flip",
    emoji: "⚪",
    description: "No edge, pure luck",
    params: { p: 0.5, bet_fraction: 0.15, starting_capital: 100, target: 300, n_paths: 200 },
  },
  {
    label: "Fighting Chance",
    emoji: "🟡",
    description: "Positive edge, overbetting",
    params: { p: 0.55, bet_fraction: 0.25, starting_capital: 100, target: 300, n_paths: 200 },
  },
  {
    label: "Kelly Optimal",
    emoji: "🟢",
    description: "Positive edge + Kelly sizing",
    params: { p: 0.55, bet_fraction: 0.1, starting_capital: 100, target: 300, n_paths: 200 },
  },
];

export default function Presets({ onSelectPreset, activePreset }) {
  return (
    <aside className="presets-panel app-sidebar">
      <div className="presets-panel__header">
        <p className="parameter-panel__eyebrow">Scenarios</p>
      </div>

      <div className="presets-panel__list">
        {PRESETS.map((preset) => (
          <button
            key={preset.label}
            type="button"
            className={`preset-card${
              activePreset === preset.label ? " preset-card--active" : ""
            }`}
            onClick={() => onSelectPreset(preset)}
          >
            <span className="preset-card__title">
              {preset.emoji} <strong>{preset.label}</strong>
            </span>
            <span className="preset-card__description">{preset.description}</span>
          </button>
        ))}
      </div>
    </aside>
  );
}
