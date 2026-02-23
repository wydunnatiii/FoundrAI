import { NextResponse } from "next/server";
import { mockMarket } from "@/lib/mockData";

export async function GET() {
  return NextResponse.json(mockMarket);
}

