"use client";

import React, { useState } from "react";

import type { FounderDecisionInput } from "@/lib/simulationLogic";

type DecisionFormProps = {
  onSimulate: (decision: FounderDecisionInput) => Promise<void>;
  loading?: boolean;
};

const DECISIONS: {
  type: FounderDecisionInput["type"];
  label: string;
  placeholder: string;
}[] = [
  {
    type: "raise_funding",
    label: "Raise funding",
    placeholder: "Raise a Series A of $5M at improved terms"
  },
  {
    type: "layoff",
    label: "Layoff employees",
    placeholder: "Lay off 15% of team, mainly ops"
  },
  {
    type: "increase_marketing",
    label: "Increase marketing spend",
    placeholder: "Increase performance marketing budget by 20%"
  },
  {
    type: "pivot_product",
    label: "Pivot product",
    placeholder: "Pivot from SMB to mid-market focus"
  },
  {
    type: "reduce_burn",
    label: "Reduce burn",
    placeholder: "Cut non-core tools and contractors by 25%"
  },
  {
    type: "expand_internationally",
    label: "Expand internationally",
    placeholder: "Launch in EU market with local sales pod"
  }
];

export const DecisionForm: React.FC<DecisionFormProps> = ({ onSimulate, loading }) => {
  const [selected, setSelected] = useState<FounderDecisionInput["type"]>("increase_marketing");
  const [description, setDescription] = useState("Increase marketing by 20%");
  const [magnitude, setMagnitude] = useState(0.2);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const decision: FounderDecisionInput = {
      type: selected,
      description,
      magnitude
    };
    await onSimulate(decision);
  };

  return (
    <form onSubmit={handleSubmit} className="card flex flex-col gap-4">
      <div>
        <div className="metric-label mb-1">Founder Decision</div>
        <p className="text-xs text-slate-400">
          Choose a strategic move for the next quarter. The simulator will project risks,
          opportunities, and updated metrics.
        </p>
      </div>

      <div className="grid gap-2 sm:grid-cols-3">
        {DECISIONS.map((option) => (
          <button
            key={option.type}
            type="button"
            onClick={() => {
              setSelected(option.type);
              setDescription(option.placeholder);
            }}
            className={`rounded-lg border px-3 py-2 text-left text-xs transition ${
              selected === option.type
                ? "border-emerald-500 bg-emerald-500/15 text-emerald-100 shadow-inner shadow-emerald-500/40"
                : "border-slate-700/70 bg-slate-900/60 text-slate-300 hover:border-emerald-400/60 hover:bg-slate-900"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        <label className="metric-label">Decision details</label>
        <textarea
          className="h-20 w-full rounded-lg border border-slate-700/70 bg-slate-900/70 px-3 py-2 text-sm outline-none ring-emerald-500/40 focus:border-emerald-400 focus:ring-2"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="metric-label flex items-center justify-between">
          <span>Decision intensity</span>
          <span className="text-[11px] text-slate-400">
            ~{Math.round(magnitude * 100)}% change
          </span>
        </label>
        <input
          type="range"
          min={0.05}
          max={0.5}
          step={0.05}
          value={magnitude}
          onChange={(e) => setMagnitude(parseFloat(e.target.value))}
          className="w-full accent-emerald-500"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-2 inline-flex items-center justify-center rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-slate-950 shadow-lg shadow-emerald-500/40 transition hover:bg-emerald-400 disabled:cursor-wait disabled:opacity-70"
      >
        {loading ? "Simulating next quarter..." : "Simulate next quarter"}
      </button>
    </form>
  );
};

