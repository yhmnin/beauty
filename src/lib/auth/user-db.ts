/**
 * Shared user database.
 * Single source of truth for all auth (web app + Chrome extension).
 * In production, replace with PostgreSQL/Supabase.
 */

export interface StoredUser {
  id: string;
  email: string;
  name: string;
  password: string;
  createdAt: number;
}

// Singleton in-memory store (shared across all API routes in the same process)
const users = new Map<string, StoredUser>();
const tokens = new Map<string, string>(); // token -> email

export function findUserByEmail(email: string): StoredUser | undefined {
  return users.get(email);
}

export function findUserByToken(token: string): StoredUser | undefined {
  const email = tokens.get(token);
  return email ? users.get(email) : undefined;
}

export function createUser(name: string, email: string, password: string): StoredUser {
  const user: StoredUser = {
    id: crypto.randomUUID(),
    email,
    name,
    password,
    createdAt: Date.now(),
  };
  users.set(email, user);
  return user;
}

export function generateToken(user: StoredUser): string {
  const token = `beauty-${user.id}-${Date.now().toString(36)}`;
  tokens.set(token, user.email);
  return token;
}

export function changePassword(email: string, oldPassword: string, newPassword: string): boolean {
  const user = users.get(email);
  if (!user || user.password !== oldPassword) return false;
  user.password = newPassword;
  return true;
}

export function safeUser(user: StoredUser) {
  const { password: _, ...safe } = user;
  return safe;
}
