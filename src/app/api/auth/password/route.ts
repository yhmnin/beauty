import { NextRequest, NextResponse } from "next/server";
import { findUserByToken, changePassword } from "@/lib/auth/user-db";

export async function POST(req: NextRequest) {
  try {
    const { oldPassword, newPassword } = await req.json();
    const auth = req.headers.get("authorization");

    if (!auth?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const token = auth.slice(7);
    const user = findUserByToken(token);
    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!oldPassword || !newPassword) {
      return NextResponse.json({ error: "Both old and new passwords required" }, { status: 400 });
    }
    if (newPassword.length < 6) {
      return NextResponse.json({ error: "New password must be at least 6 characters" }, { status: 400 });
    }

    const changed = changePassword(user.email, oldPassword, newPassword);
    if (!changed) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 403 });
    }

    return NextResponse.json({ success: true, message: "Password changed" });
  } catch {
    return NextResponse.json({ error: "Password change failed" }, { status: 500 });
  }
}
