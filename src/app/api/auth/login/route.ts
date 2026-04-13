import { NextRequest, NextResponse } from "next/server";
import { findUserByEmail, generateToken, safeUser } from "@/lib/auth/user-db";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    const user = findUserByEmail(email);
    if (!user || user.password !== password) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const token = generateToken(user);
    return NextResponse.json({ user: safeUser(user), token });
  } catch {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
