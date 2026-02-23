import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import {
  CompanyMetrics,
  MarketConditions,
  FounderDecisionInput,
  SimulationResult,
  simulateFallbackDecision,
  calculateHealthScore,
  deriveRiskLevel
} from "@/lib/simulationLogic";

type RequestBody = {
  company: CompanyMetrics & { name?: string; valuation?: number };
  market: MarketConditions;
  decision: FounderDecisionInput;
};

const openaiApiKey = process.env.OPENAI_API_KEY;

async function callOpenAISimulation(
  payload: RequestBody
): Promise<SimulationResult | null> {
  if (!openaiApiKey) {
    return null;
  }

  const client = new OpenAI({ apiKey: openaiApiKey });

  const prompt = `
You are an experienced startup operator and VC. Simulate the consequences of a founder decision for a startup, and respond with PURE JSON only.

Company metrics:
- Cash: ${payload.company.cash}
- Burn Rate: ${payload.company.burnRate}
- Employees: ${payload.company.employees}
- Market Share: ${payload.company.marketShare}
- Growth Rate: ${payload.company.growthRate}
- Investor Pressure (0-10): ${payload.company.investorPressure}
- Customer Satisfaction (0-100): ${payload.company.customerSatisfaction}
- Valuation (if provided): ${payload.company.valuation ?? "unknown"}

Market conditions:
- Economic Climate: ${payload.market.economicClimate}
- Competition Level (0-10): ${payload.market.competitionLevel}
- Industry Growth (0-10): ${payload.market.industryGrowth}
- Funding Environment: ${payload.market.fundingEnvironment}

Founder decision description:
"${payload.decision.description}"

Return a JSON object with:
- updatedMetrics: { cash, burnRate, employees, marketShare, growthRate, investorPressure, customerSatisfaction }
- risks: string[]
- opportunities: string[]
- shortTermImpact: string
- longTermImpact: string
- successProbability: number (0-100)
- riskLevel: "Low" | "Medium" | "High"
- healthScore: number (0-100)

Strictly respond with valid JSON, no markdown, no commentary.`;

  const completion = await client.responses.create({
    model: "gpt-4.1-mini",
    input: prompt,
    response_format: { type: "json_object" }
  });

  const content = completion.output[0]?.content?.[0];
  if (!content || content.type !== "output_text") {
    return null;
  }

  try {
    const parsed = JSON.parse(content.text()) as SimulationResult;
    return parsed;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as RequestBody;

    let result: SimulationResult | null = null;
    try {
      result = await callOpenAISimulation(body);
    } catch {
      result = null;
    }

    if (!result) {
      result = simulateFallbackDecision(
        body.company,
        body.market,
        body.decision
      );

      if (!("valuation" in body.company) || body.company.valuation === undefined) {
        body.company.valuation =
          body.company.cash * 10 + body.company.growthRate * 100000;
      }

      const healthScore = calculateHealthScore(body.company, body.market);
      const riskLevel = deriveRiskLevel(body.company, body.market);

      result.riskLevel = riskLevel;
      result.healthScore = healthScore;
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("simulate-decision error", error);
    return NextResponse.json(
      { error: "Failed to simulate decision" },
      { status: 500 }
    );
  }
}

