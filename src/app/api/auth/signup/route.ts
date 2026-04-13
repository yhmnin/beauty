import { NextRequest, NextResponse } from "next/server";
import { findUserByEmail, createUser, generateToken, safeUser } from "@/lib/auth/user-db";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    if (findUserByEmail(email)) {
      return NextResponse.json({ error: "Account already exists. Try signing in." }, { status: 409 });
    }

    const user = createUser(name || email.split("@")[0], email, password);
    const token = generateToken(user);

    return NextResponse.json({ user: safeUser(user), token });
  } catch {
    return NextResponse.json({ error: "Signup failed" }, { status: 500 });
  }
}
