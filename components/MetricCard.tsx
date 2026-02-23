import React from "react";

type MetricCardProps = {
  label: string;
  value: string | number;
  sublabel?: string;
  accent?: "default" | "positive" | "negative";
};

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  sublabel,
  accent = "default"
}) => {
  const accentClass =
    accent === "positive"
      ? "border-emerald-500/50 bg-emerald-500/10"
      : accent === "negative"
      ? "border-red-500/40 bg-red-500/5"
      : "border-slate-700/60 bg-slate-900/60";

  return (
    <div
      className={`card transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-400/60 hover:shadow-emerald-500/30 ${accentClass}`}
    >
      <div className="metric-label mb-1">{label}</div>
      <div className="card-value">
        {typeof value === "number" ? value.toLocaleString() : value}
      </div>
      {sublabel && <div className="metric-sub mt-1">{sublabel}</div>}
    </div>
  );
};

