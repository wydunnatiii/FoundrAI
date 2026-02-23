"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MetricCard } from "@/components/MetricCard";
import { DecisionForm } from "@/components/DecisionForm";
import { HealthGauge } from "@/components/HealthGauge";
import type {
  CompanyMetrics,
  MarketConditions,
  FounderDecisionInput
} from "@/lib/simulationLogic";

type Company = CompanyMetrics & {
  id: number;
  name: string;
  valuation: number;
};

type Market = MarketConditions & { id: number };

type SimulationResponse = {
  updatedMetrics: CompanyMetrics;
  risks: string[];
  opportunities: string[];
  shortTermImpact: string;
  longTermImpact: string;
  successProbability: number;
  riskLevel: "Low" | "Medium" | "High";
  healthScore: number;
};

export default function DashboardPage() {
  const router = useRouter();

  const [company, setCompany] = useState<Company | null>(null);
  const [market, setMarket] = useState<Market | null>(null);
  const [simulation, setSimulation] = useState<SimulationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [companyRes, marketRes] = await Promise.all([
          fetch("/api/company"),
          fetch("/api/market")
        ]);
        const companyData = await companyRes.json();
        const marketData = await marketRes.json();
        setCompany(companyData);
        setMarket(marketData);
      } catch (err) {
        console.error(err);
        setError("Unable to load base data. Please check the API routes.");
      }
    };
    fetchData();
  }, []);

  const handleSimulate = async (decision: FounderDecisionInput) => {
    if (!company || !market) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/simulate-decision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company,
          market,
          decision
        })
      });
      if (!res.ok) {
        throw new Error("Simulation failed");
      }
      const data = (await res.json()) as SimulationResponse;
      setSimulation(data);
      setCompany((prev) =>
        prev
          ? {
              ...prev,
              ...data.updatedMetrics
            }
          : prev
      );
    } catch (err) {
      console.error(err);
      setError("Simulation failed. Check the API route or OpenAI configuration.");
    } finally {
      setLoading(false);
    }
  };

  const riskColor =
    simulation?.riskLevel === "High"
      ? "bg-red-500/15 text-red-300 border-red-500/40"
      : simulation?.riskLevel === "Medium"
      ? "bg-yellow-500/15 text-yellow-200 border-yellow-500/40"
      : "bg-emerald-500/15 text-emerald-200 border-emerald-500/40";

  return (
    <div className="flex flex-1 flex-col gap-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
            Founder cockpit
          </div>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-50">
            {company ? company.name : "Loading company..."}
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Enter decisions, observe investor and market reactions, and track health across
            simulated quarters.
          </p>
        </div>
        <button
          onClick={() => router.push("/results")}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-700/70 bg-slate-900/70 px-3 py-2 text-xs text-slate-200 shadow-sm hover:border-emerald-400/60 hover:text-emerald-200"
        >
          View recent simulations
          <span className="text-slate-500">⟶</span>
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-100">
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-3">
          <div className="metric-label">Company metrics</div>
          <div className="grid gap-3">
            <MetricCard
              label="Cash"
              value={company ? `$${company.cash.toLocaleString()}` : "--"}
              sublabel={
                company
                  ? `Burn: $${company.burnRate.toLocaleString()}/month • Employees: ${company.employees}`
                  : ""
              }
            />
            <MetricCard
              label="Growth & Market"
              value={
                company
                  ? `${company.growthRate}% growth • ${company.marketShare}% share`
                  : "--"
              }
              sublabel={
                market
                  ? `Industry growth: ${market.industryGrowth}/10 • Competition: ${market.competitionLevel}/10`
                  : ""
              }
            />
            <MetricCard
              label="Stakeholder pulse"
              value={
                company
                  ? `Investor pressure: ${company.investorPressure}/10`
                  : "--"
              }
              sublabel={
                company
                  ? `Customer satisfaction: ${company.customerSatisfaction}/100`
                  : ""
              }
            />
          </div>
        </div>

        <div className="space-y-3">
          <div className="metric-label">Market conditions</div>
          <div className="card space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
              <span className="text-slate-300">
                {market ? market.economicClimate : "Loading..."}
              </span>
              <span className="rounded-full bg-slate-900/80 px-2 py-0.5 text-[11px] text-slate-400">
                Funding: {market ? market.fundingEnvironment : "--"}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Use this scenario as a training ground. Try aggressive versus conservative
              plays across different macro climates.
            </p>
            {simulation && (
              <div className={`mt-3 rounded-lg border px-3 py-2 text-xs ${riskColor}`}>
                <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide">
                  Risk profile
                </div>
                <div>
                  {simulation.riskLevel} risk •{" "}
                  {simulation.successProbability}% success probability
                </div>
              </div>
            )}
          </div>
          <HealthGauge score={simulation?.healthScore ?? 65} />
        </div>

        <div>
          <DecisionForm onSimulate={handleSimulate} loading={loading} />
        </div>
      </div>

      {simulation && (
        <div className="grid gap-4 md:grid-cols-3">
          <div className="card md:col-span-2">
            <div className="metric-label mb-2">AI narrative</div>
            <p className="text-xs text-slate-300">{simulation.shortTermImpact}</p>
            <p className="mt-2 text-xs text-slate-300">{simulation.longTermImpact}</p>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div>
                <div className="metric-label mb-1">Opportunities</div>
                <ul className="space-y-1 text-xs text-emerald-200">
                  {simulation.opportunities.map((o, idx) => (
                    <li key={idx}>• {o}</li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="metric-label mb-1">Risks</div>
                <ul className="space-y-1 text-xs text-red-200">
                  {simulation.risks.map((r, idx) => (
                    <li key={idx}>• {r}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="card space-y-2 text-xs text-slate-300">
            <div className="metric-label mb-1">Next steps</div>
            <p>
              Use this as one simulated quarter. Hit{" "}
              <span className="text-emerald-300">simulate next quarter</span> again with a
              new decision and observe the compounding effects on runway, growth, and
              investor sentiment.
            </p>
            <p className="mt-1">
              In a full MVP, we&apos;d persist each step to a timeline and support
              multiplayer co-founder views plus external shocks.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

