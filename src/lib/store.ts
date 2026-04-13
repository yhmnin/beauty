import { create } from "zustand";

export type AppView = "opening" | "home" | "conversation" | "explore" | "profile";
export type MediaType = "image" | "video" | "text" | "music";
export type CardDisplayMode = "minimal" | "info";

interface VoiceState {
  isConnected: boolean;
  isListening: boolean;
  isSpeaking: boolean;
  audioLevel: number;
  transcript: string;
}

interface AppState {
  view: AppView;
  setView: (view: AppView) => void;
  hasCompletedOpening: boolean;
  setHasCompletedOpening: (value: boolean) => void;

  voice: VoiceState;
  setVoice: (partial: Partial<VoiceState>) => void;

  searchResults: ContentItem[];
  setSearchResults: (results: ContentItem[]) => void;

  conversationHistory: ConversationMessage[];
  addMessage: (message: ConversationMessage) => void;
  clearConversation: () => void;

  cardDisplayMode: CardDisplayMode;
  setCardDisplayMode: (mode: CardDisplayMode) => void;

  activeTagFilter: string | null;
  setActiveTagFilter: (tag: string | null) => void;
}

export interface ContentItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  creator?: string;
  creatorId?: string;
  year?: string;
  tags: string[];
  mediaType: MediaType;
  sourceUrl?: string;
  videoUrl?: string;
  musicUrl?: string;
  textContent?: string;
  relatedIds?: string[];
}

export interface ConversationMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  relatedContent?: ContentItem[];
}

export const useAppStore = create<AppState>((set) => ({
  view: "opening",
  setView: (view) => set({ view }),
  hasCompletedOpening: false,
  setHasCompletedOpening: (value) => set({ hasCompletedOpening: value }),

  voice: {
    isConnected: false,
    isListening: false,
    isSpeaking: false,
    audioLevel: 0,
    transcript: "",
  },
  setVoice: (partial) =>
    set((state) => ({ voice: { ...state.voice, ...partial } })),

  searchResults: [],
  setSearchResults: (results) => set({ searchResults: results }),

  conversationHistory: [],
  addMessage: (message) =>
    set((state) => ({
      conversationHistory: [...state.conversationHistory, message],
    })),
  clearConversation: () => set({ conversationHistory: [] }),

  cardDisplayMode: "info",
  setCardDisplayMode: (mode) => set({ cardDisplayMode: mode }),

  activeTagFilter: null,
  setActiveTagFilter: (tag) => set({ activeTagFilter: tag }),
}));
