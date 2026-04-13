import { NextRequest, NextResponse } from "next/server";

// In-memory user store (in production, use a real database)
const users = new Map<string, { id: string; email: string; name: string; password: string; createdAt: number }>();

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    const user = users.get(email);
    if (!user || user.password !== password) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const { password: _, ...safeUser } = user;
    return NextResponse.json({ user: safeUser, token: `beauty-${user.id}` });
  } catch {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}

// Export users map for signup route
export { users };
