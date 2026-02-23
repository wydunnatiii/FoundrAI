"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";
import { HealthGauge } from "@/components/HealthGauge";

type ResultRow = {
  id: number;
  quarter: number;
  healthScore: number;
  successProbability: number;
  cash: number;
};

export default function ResultsPage() {
  const [data, setData] = useState<ResultRow[]>([]);

  useEffect(() => {
    const seedData: ResultRow[] = Array.from({ length: 6 }).map((_, idx) => ({
      id: idx + 1,
      quarter: idx + 1,
      healthScore: 55 + idx * 4,
      successProbability: 50 + idx * 5,
      cash: 500000 - idx * 30000
    }));
    setData(seedData);
  }, []);

  const latest = data[data.length - 1];

  return (
    <div className="flex flex-1 flex-col gap-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
            Simulation results
          </div>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-50">
            Company trajectory over quarters
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            This view is designed for VCs, operators, or instructors to discuss compounding
            effects of founder decisions across multiple quarters.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2">
          <div className="card h-64">
            <div className="metric-label mb-2">Health score over time</div>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis
                  dataKey="quarter"
                  tickLine={false}
                  tickMargin={8}
                  stroke="#6b7280"
                />
                <YAxis tickLine={false} tickMargin={8} stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#020617",
                    borderRadius: 8,
                    border: "1px solid #1f2937",
                    fontSize: 12
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="healthScore"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <HealthGauge score={latest?.healthScore ?? 60} />
      </div>

      <div className="card">
        <div className="metric-label mb-3">Quarterly summary</div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs">
            <thead className="border-b border-slate-800 text-[11px] uppercase tracking-wide text-slate-500">
              <tr>
                <th className="py-2 pr-4 text-left">Q</th>
                <th className="py-2 pr-4 text-left">Health</th>
                <th className="py-2 pr-4 text-left">Success probability</th>
                <th className="py-2 pr-4 text-left">Cash</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.id} className="border-b border-slate-900 last:border-0">
                  <td className="py-2 pr-4 text-slate-300">Q{row.quarter}</td>
                  <td className="py-2 pr-4 text-slate-200">{row.healthScore}</td>
                  <td className="py-2 pr-4 text-slate-200">
                    {row.successProbability}%
                  </td>
                  <td className="py-2 pr-4 text-slate-200">
                    ${row.cash.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

