import React from "react";

type HealthGaugeProps = {
  score: number;
};

export const HealthGauge: React.FC<HealthGaugeProps> = ({ score }) => {
  const clamped = Math.max(0, Math.min(100, score));
  const angle = (clamped / 100) * 180 - 90;

  let color = "text-emerald-400";
  if (clamped < 35) color = "text-red-400";
  else if (clamped < 70) color = "text-yellow-400";

  return (
    <div className="card flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="metric-label mb-1">Company Health Score</div>
          <div className="text-3xl font-semibold">{clamped}</div>
        </div>
        <div
          className={`rounded-full border border-slate-700/80 bg-slate-900/80 px-3 py-1 text-xs ${color}`}
        >
          {clamped >= 70 ? "Healthy" : clamped >= 35 ? "Watchlist" : "Critical"}
        </div>
      </div>
      <div className="relative h-28 w-full overflow-hidden">
        <div className="absolute inset-x-6 bottom-0 h-24 rounded-t-full border border-slate-700/70 bg-slate-900/80" />
        <div
          className="absolute bottom-0 left-1/2 h-20 w-1 origin-bottom rounded-full bg-gradient-to-t from-emerald-400 via-emerald-300 to-emerald-200 shadow-[0_0_18px_rgba(16,185,129,0.7)]"
          style={{ transform: `translateX(-50%) rotate(${angle}deg)` }}
        />
        <div className="absolute inset-x-8 bottom-2 flex justify-between text-[10px] text-slate-500">
          <span>0</span>
          <span>50</span>
          <span>100</span>
        </div>
      </div>
    </div>
  );
};

