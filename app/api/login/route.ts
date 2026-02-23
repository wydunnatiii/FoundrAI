import { NextRequest, NextResponse } from "next/server";
import { mockUsers } from "@/lib/mockData";

export async function POST(request: NextRequest) {
  const { email, password } = (await request.json()) as {
    email: string;
    password: string;
  };

  const user = mockUsers.find(
    (u) => u.email === email && u.password === password
  );

  if (!user) {
    return NextResponse.json(
      { error: "Invalid credentials" },
      { status: 401 }
    );
  }

  return NextResponse.json({
    id: user.id,
    email: user.email,
    name: user.name
  });
}

