import { NextResponse } from "next/server";
import { mockCompany } from "@/lib/mockData";

export async function GET() {
  return NextResponse.json(mockCompany);
}

