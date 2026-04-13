/**
 * Resolves the correct API base URL depending on the deployment context:
 * 
 * 1. Web (server-rendered Next.js): uses relative URLs ("/api/...")
 * 2. Capacitor / Tauri (static shell): uses the configured remote API host
 * 3. Development: uses localhost
 *
 * Set NEXT_PUBLIC_API_URL in env to point native shells at a hosted backend.
 */

function getApiBaseUrl(): string {
  // If explicitly configured (for native shells pointing to remote server)
  if (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  // Client-side check for Capacitor/Tauri environments
  if (typeof window !== "undefined") {
    const win = window as unknown as Record<string, unknown>;

    // Capacitor loads from capacitor://localhost or https://localhost
    if (win.Capacitor || window.location.protocol === "capacitor:") {
      return process.env.NEXT_PUBLIC_API_URL || "https://beauty-api.vercel.app";
    }

    // Tauri loads from tauri://localhost
    if (win.__TAURI__ || window.location.protocol === "tauri:") {
      return process.env.NEXT_PUBLIC_API_URL || "https://beauty-api.vercel.app";
    }
  }

  // Default: same-origin relative URLs (standard Next.js server)
  return "";
}

const API_BASE = getApiBaseUrl();

export function apiUrl(path: string): string {
  return `${API_BASE}${path}`;
}

export async function apiFetch(
  path: string,
  init?: RequestInit
): Promise<Response> {
  const url = apiUrl(path);
  return fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
}
