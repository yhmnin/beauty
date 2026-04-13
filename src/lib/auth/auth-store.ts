import { create } from "zustand";
import { persist } from "zustand/middleware";
import { apiFetch } from "@/lib/platform/api";

export interface SavedItem {
  contentId: string;
  savedAt: number;
  collection?: string;
  title?: string;
  imageUrl?: string;
  creator?: string;
}

export interface UserCollection {
  id: string;
  name: string;
  createdAt: number;
  itemCount: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  createdAt: number;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  savedItems: SavedItem[];
  collections: UserCollection[];

  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  syncFromServer: () => Promise<void>;

  saveItem: (contentId: string, meta?: { title?: string; imageUrl?: string; creator?: string }, collection?: string) => void;
  unsaveItem: (contentId: string) => void;
  isItemSaved: (contentId: string) => boolean;

  createCollection: (name: string) => string;
  deleteCollection: (id: string) => void;
  getCollectionItems: (collectionId: string) => SavedItem[];
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      savedItems: [],
      collections: [
        { id: "default", name: "All Saves", createdAt: Date.now(), itemCount: 0 },
      ],

      login: async (email, password) => {
        try {
          const res = await apiFetch("/api/auth/login", {
            method: "POST",
            body: JSON.stringify({ email, password }),
          });
          const data = await res.json();
          if (data.user && data.token) {
            set({ user: data.user, token: data.token, isAuthenticated: true });
            return { ok: true };
          }
          return { ok: false, error: data.error || "Login failed" };
        } catch {
          return { ok: false, error: "Cannot connect to server" };
        }
      },

      signup: async (name, email, password) => {
        try {
          const res = await apiFetch("/api/auth/signup", {
            method: "POST",
            body: JSON.stringify({ name, email, password }),
          });
          const data = await res.json();
          if (data.user && data.token) {
            set({ user: data.user, token: data.token, isAuthenticated: true });
            return { ok: true };
          }
          return { ok: false, error: data.error || "Signup failed" };
        } catch {
          return { ok: false, error: "Cannot connect to server" };
        }
      },

      changePassword: async (oldPassword, newPassword) => {
        const { token } = get();
        if (!token) return { ok: false, error: "Not authenticated" };
        try {
          const res = await apiFetch("/api/auth/password", {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: JSON.stringify({ oldPassword, newPassword }),
          });
          const data = await res.json();
          if (data.success) return { ok: true };
          return { ok: false, error: data.error || "Failed" };
        } catch {
          return { ok: false, error: "Cannot connect to server" };
        }
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },

      syncFromServer: async () => {
        const { token, savedItems } = get();
        if (!token) return;
        try {
          const res = await apiFetch("/api/save", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!res.ok) return;
          const data = await res.json();
          if (!data.items || data.items.length === 0) return;

          const existingIds = new Set(savedItems.map((s) => s.contentId));
          const newItems: SavedItem[] = [];

          for (const item of data.items) {
            const contentId = item.id;
            if (existingIds.has(contentId)) continue;
            newItems.push({
              contentId,
              savedAt: item.savedAt,
              collection: "default",
              title: item.sourceTitle || item.url || "",
              imageUrl: item.type === "image" ? item.url : undefined,
            });
          }

          if (newItems.length > 0) {
            const { collections } = get();
            const defaultCol = collections.find((c) => c.id === "default");
            set({
              savedItems: [...newItems, ...savedItems],
              collections: collections.map((c) =>
                c.id === "default"
                  ? { ...c, itemCount: (defaultCol?.itemCount || 0) + newItems.length }
                  : c
              ),
            });
          }
        } catch {}
      },

      saveItem: (contentId, meta, collection) => {
        const { savedItems, collections, token } = get();
        if (savedItems.some((s) => s.contentId === contentId)) return;

        const newItem: SavedItem = {
          contentId,
          savedAt: Date.now(),
          collection: collection || "default",
          title: meta?.title,
          imageUrl: meta?.imageUrl,
          creator: meta?.creator,
        };

        // Also push to server API (so extension can see it)
        if (token) {
          apiFetch("/api/save", {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: JSON.stringify({
              type: "image",
              url: meta?.imageUrl || "",
              sourceUrl: contentId,
              sourceTitle: meta?.title || contentId,
            }),
          }).catch(() => {});
        }

        const updatedCollections = collections.map((c) =>
          c.id === (collection || "default")
            ? { ...c, itemCount: c.itemCount + 1 }
            : c
        );

        set({
          savedItems: [newItem, ...savedItems],
          collections: updatedCollections,
        });
      },

      unsaveItem: (contentId) => {
        const { savedItems, collections } = get();
        const item = savedItems.find((s) => s.contentId === contentId);
        if (!item) return;

        const updatedCollections = collections.map((c) =>
          c.id === (item.collection || "default")
            ? { ...c, itemCount: Math.max(0, c.itemCount - 1) }
            : c
        );

        set({
          savedItems: savedItems.filter((s) => s.contentId !== contentId),
          collections: updatedCollections,
        });
      },

      isItemSaved: (contentId) => {
        return get().savedItems.some((s) => s.contentId === contentId);
      },

      createCollection: (name) => {
        const id = crypto.randomUUID();
        const { collections } = get();
        set({
          collections: [
            ...collections,
            { id, name, createdAt: Date.now(), itemCount: 0 },
          ],
        });
        return id;
      },

      deleteCollection: (id) => {
        if (id === "default") return;
        const { collections, savedItems } = get();
        set({
          collections: collections.filter((c) => c.id !== id),
          savedItems: savedItems.map((s) =>
            s.collection === id ? { ...s, collection: "default" } : s
          ),
        });
      },

      getCollectionItems: (collectionId) => {
        return get().savedItems.filter(
          (s) => s.collection === collectionId || (collectionId === "default" && !s.collection)
        );
      },
    }),
    {
      name: "beauty-auth",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        savedItems: state.savedItems,
        collections: state.collections,
      }),
    }
  )
);
