import type { CompanyMetrics, MarketConditions } from "@/lib/simulationLogic";

export type MockCompany = CompanyMetrics & {
  id: number;
  name: string;
  valuation: number;
};

export type MockMarket = MarketConditions & { id: number };

export type MockUser = {
  id: number;
  email: string;
  password: string;
  name: string;
};

export const mockCompany: MockCompany = {
  id: 1,
  name: "TechNova",
  cash: 500000,
  valuation: 5000000,
  burnRate: 50000,
  employees: 12,
  marketShare: 5,
  growthRate: 12,
  investorPressure: 7,
  customerSatisfaction: 80
};

export const mockMarket: MockMarket = {
  id: 1,
  competitionLevel: 8,
  economicClimate: "Recession",
  industryGrowth: 6,
  fundingEnvironment: "Tight"
};

export const mockUsers: MockUser[] = [
  {
    id: 1,
    email: "founder@example.com",
    password: "foundr123",
    name: "Demo Founder"
  }
];

