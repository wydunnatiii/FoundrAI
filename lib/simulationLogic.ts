export type CompanyMetrics = {
  cash: number;
  burnRate: number;
  employees: number;
  marketShare: number;
  growthRate: number;
  investorPressure: number; // 0–10
  customerSatisfaction: number; // 0–100
  valuation?: number; // optional for scenarios where valuation is tracked
};

export type MarketConditions = {
  competitionLevel: number; // 0–10
  economicClimate: "Boom" | "Neutral" | "Recession";
  industryGrowth: number; // 0–10
  fundingEnvironment: "Frothy" | "Normal" | "Tight";
};

export type FounderDecisionType =
  | "raise_funding"
  | "layoff"
  | "increase_marketing"
  | "pivot_product"
  | "reduce_burn"
  | "expand_internationally";

export type FounderDecisionInput = {
  type: FounderDecisionType;
  description: string;
  magnitude?: number; // e.g. 0.2 for 20%
};

export type SimulationResult = {
  updatedMetrics: CompanyMetrics;
  risks: string[];
  opportunities: string[];
  shortTermImpact: string;
  longTermImpact: string;
  successProbability: number; // 0–100
  riskLevel: "Low" | "Medium" | "High";
  healthScore: number;
};

export function calculateCashStability(cash: number, burnRate: number): number {
  if (burnRate <= 0) return 100;
  const runwayMonths = cash / burnRate;
  if (runwayMonths >= 24) return 100;
  if (runwayMonths <= 3) return 10;
  return Math.max(10, Math.min(100, (runwayMonths / 24) * 100));
}

export function calculateInvestorConfidence(
  investorPressure: number,
  growthRate: number
): number {
  const pressurePenalty = (investorPressure / 10) * 40; // up to -40
  const growthBoost = Math.min(40, Math.max(-20, (growthRate - 10) * 2));
  return Math.max(0, Math.min(100, 70 + growthBoost - pressurePenalty));
}

export function calculateHealthScore(
  metrics: CompanyMetrics,
  market: MarketConditions
): number {
  const cashStability = calculateCashStability(metrics.cash, metrics.burnRate);
  const investorConfidence = calculateInvestorConfidence(
    metrics.investorPressure,
    metrics.growthRate
  );

  const normalizedGrowth = Math.max(0, Math.min(100, metrics.growthRate * 3));
  const normalizedMarketShare = Math.max(
    0,
    Math.min(100, metrics.marketShare * 3)
  );
  const normalizedIndustryGrowth = Math.max(
    0,
    Math.min(100, market.industryGrowth * 8)
  );

  const baseScore =
    0.25 * normalizedGrowth +
    0.2 * normalizedMarketShare +
    0.2 * cashStability +
    0.15 * metrics.customerSatisfaction +
    0.2 * investorConfidence;

  let macroAdjustment = 0;
  if (market.economicClimate === "Recession") {
    macroAdjustment -= 8;
  } else if (market.economicClimate === "Boom") {
    macroAdjustment += 5;
  }
  macroAdjustment += (normalizedIndustryGrowth - 50) * 0.05;

  const adjusted = baseScore + macroAdjustment;
  return Math.max(0, Math.min(100, Math.round(adjusted)));
}

export function deriveRiskLevel(
  metrics: CompanyMetrics,
  market: MarketConditions
): "Low" | "Medium" | "High" {
  const cashStability = calculateCashStability(metrics.cash, metrics.burnRate);
  const highBankruptcyRisk = metrics.burnRate > metrics.cash / 6;

  if (highBankruptcyRisk || cashStability < 25) return "High";
  if (cashStability < 55 || market.competitionLevel >= 7) return "Medium";
  return "Low";
}

export function simulateFallbackDecision(
  metrics: CompanyMetrics,
  market: MarketConditions,
  decision: FounderDecisionInput
): SimulationResult {
  const updated: CompanyMetrics = { ...metrics };
  const risks: string[] = [];
  const opportunities: string[] = [];

  const magnitude = decision.magnitude ?? 0.2;

  switch (decision.type) {
    case "raise_funding": {
      const fundingMultiplier =
        market.fundingEnvironment === "Frothy"
          ? 1.4
          : market.fundingEnvironment === "Normal"
          ? 1
          : 0.6;
      const raised = metrics.burnRate * 12 * fundingMultiplier;
      updated.cash += raised;
      updated.investorPressure = Math.max(
        3,
        metrics.investorPressure - 2
      );
      const currentValuation =
        updated.valuation ?? metrics.cash * 10 + metrics.growthRate * 100000;
      updated.valuation = currentValuation * (1 + 0.1 * fundingMultiplier);
      opportunities.push(
        "New funding extends runway and unlocks strategic initiatives."
      );
      if (market.fundingEnvironment === "Tight") {
        risks.push(
          "Tight funding environment may force unfavorable terms and dilution."
        );
      }
      break;
    }
    case "layoff": {
      const layoffPct = magnitude;
      const employeesCut = Math.round(metrics.employees * layoffPct);
      updated.employees = Math.max(1, metrics.employees - employeesCut);
      updated.burnRate *= 1 - layoffPct * 0.8;
      updated.customerSatisfaction = Math.max(
        40,
        metrics.customerSatisfaction - 10
      );
      updated.growthRate = Math.max(0, metrics.growthRate - 4);
      risks.push(
        "Layoffs can damage morale, slow execution, and hurt brand perception."
      );
      opportunities.push(
        "Reduced burn improves runway, buying time to find product-market fit."
      );
      if (metrics.burnRate > metrics.cash / 6) {
        opportunities.push(
          "Cost cuts directly address high bankruptcy risk from short runway."
        );
      }
      break;
    }
    case "increase_marketing": {
      const spendIncrease = metrics.burnRate * magnitude;
      updated.burnRate += spendIncrease;
      const isRecession = market.economicClimate === "Recession";

      const growthDelta = isRecession ? 3 : 5;
      const shareDelta = isRecession ? 1 : 2;
      updated.growthRate += growthDelta;
      updated.marketShare += shareDelta;

      if (isRecession) {
        risks.push(
          "Increasing marketing during a recession burns cash faster; demand may not materialize."
        );
        opportunities.push(
          "Competitors may cut spend, letting you capture outsized share if campaigns work."
        );
      } else {
        opportunities.push(
          "Aggressive marketing in healthy markets can accelerate growth and valuation."
        );
      }
      break;
    }
    case "pivot_product": {
      updated.growthRate = Math.max(0, metrics.growthRate - 2);
      updated.customerSatisfaction = Math.max(
        30,
        metrics.customerSatisfaction - 15
      );
      if (market.competitionLevel >= 7) {
        opportunities.push(
          "Pivoting in a crowded space can unlock a differentiated wedge if executed well."
        );
      } else {
        risks.push(
          "Pivoting away from early traction may reset learning and delay revenue."
        );
      }
      risks.push(
        "Pivots introduce execution risk and may confuse existing customers."
      );
      break;
    }
    case "reduce_burn": {
      const reduction = metrics.burnRate * magnitude;
      updated.burnRate = Math.max(0, metrics.burnRate - reduction);
      updated.growthRate = Math.max(0, metrics.growthRate - 2);
      opportunities.push(
        "Lower burn extends runway and reduces bankruptcy risk."
      );
      risks.push(
        "Over-optimizing for efficiency can underfund promising growth bets."
      );
      break;
    }
    case "expand_internationally": {
      const expansionBurn = metrics.burnRate * (magnitude + 0.1);
      updated.burnRate += expansionBurn;
      updated.marketShare += 2;
      updated.growthRate += 3;
      risks.push(
        "International expansion adds operational complexity and regulatory risk."
      );
      if (market.economicClimate === "Recession") {
        risks.push(
          "Expanding globally in a recession may stretch the organization too thin."
        );
      }
      opportunities.push(
        "New markets can diversify revenue and reduce dependence on a single region."
      );
      break;
    }
    default:
      risks.push("Unknown decision type; minimal changes applied.");
  }

  const healthScore = calculateHealthScore(updated, market);
  const riskLevel = deriveRiskLevel(updated, market);

  let successProbability = healthScore;
  if (riskLevel === "High") successProbability -= 20;
  if (riskLevel === "Low") successProbability += 5;
  successProbability = Math.max(0, Math.min(100, Math.round(successProbability)));

  const shortTermImpact =
    risks.length > 0
      ? "Short term, the company will feel the operational and cash impact of this decision."
      : "Short term, this decision should be relatively smooth to absorb operationally.";

  const longTermImpact =
    opportunities.length > 0
      ? "Long term, this could reshape the company trajectory if execution risk is managed."
      : "Long term impact appears limited unless combined with additional strategic moves.";

  return {
    updatedMetrics: updated,
    risks,
    opportunities,
    shortTermImpact,
    longTermImpact,
    successProbability,
    riskLevel,
    healthScore
  };
}

