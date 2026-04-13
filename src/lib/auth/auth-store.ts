import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface SavedItem {
  contentId: string;
  savedAt: number;
  collection?: string;
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
  isAuthenticated: boolean;
  savedItems: SavedItem[];
  collections: UserCollection[];

  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;

  saveItem: (contentId: string, collection?: string) => void;
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
      isAuthenticated: false,
      savedItems: [],
      collections: [
        { id: "default", name: "All Saves", createdAt: Date.now(), itemCount: 0 },
      ],

      login: async (email: string, _password: string) => {
        // Client-side auth — in production, replace with API call to NextAuth/Supabase
        const stored = localStorage.getItem(`beauty-user-${email}`);
        if (stored) {
          const user = JSON.parse(stored) as User;
          set({ user, isAuthenticated: true });
          return true;
        }
        return false;
      },

      signup: async (name: string, email: string, _password: string) => {
        const user: User = {
          id: crypto.randomUUID(),
          email,
          name,
          createdAt: Date.now(),
        };
        localStorage.setItem(`beauty-user-${email}`, JSON.stringify(user));
        set({ user, isAuthenticated: true });
        return true;
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      saveItem: (contentId: string, collection?: string) => {
        const { savedItems, collections } = get();
        if (savedItems.some((s) => s.contentId === contentId)) return;

        const newItem: SavedItem = {
          contentId,
          savedAt: Date.now(),
          collection: collection || "default",
        };

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

      unsaveItem: (contentId: string) => {
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

      isItemSaved: (contentId: string) => {
        return get().savedItems.some((s) => s.contentId === contentId);
      },

      createCollection: (name: string) => {
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

      deleteCollection: (id: string) => {
        if (id === "default") return;
        const { collections, savedItems } = get();
        set({
          collections: collections.filter((c) => c.id !== id),
          savedItems: savedItems.map((s) =>
            s.collection === id ? { ...s, collection: "default" } : s
          ),
        });
      },

      getCollectionItems: (collectionId: string) => {
        return get().savedItems.filter(
          (s) => s.collection === collectionId || (collectionId === "default" && !s.collection)
        );
      },
    }),
    {
      name: "beauty-auth",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        savedItems: state.savedItems,
        collections: state.collections,
      }),
    }
  )
);
