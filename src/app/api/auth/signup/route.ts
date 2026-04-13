import { NextRequest, NextResponse } from "next/server";

// Shared in-memory user store
const users = new Map<string, { id: string; email: string; name: string; password: string; createdAt: number }>();

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    if (users.has(email)) {
      return NextResponse.json({ error: "Account already exists" }, { status: 409 });
    }

    const user = {
      id: crypto.randomUUID(),
      email,
      name: name || email.split("@")[0],
      password,
      createdAt: Date.now(),
    };

    users.set(email, user);

    const { password: _, ...safeUser } = user;
    return NextResponse.json({ user: safeUser, token: `beauty-${user.id}` });
  } catch {
    return NextResponse.json({ error: "Signup failed" }, { status: 500 });
  }
}
