"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VoiceOrb } from "./VoiceOrb";
import { RealtimeVoiceClient } from "@/lib/voice/realtime-client";
import { useAppStore } from "@/lib/store";
import { apiFetch } from "@/lib/platform/api";
import { usePlatform } from "@/lib/platform/hooks";
import { cn } from "@/lib/utils";

export function ConversationView() {
  const { isPhone, isTV } = usePlatform();
  const {
    voice,
    setVoice,
    addMessage,
    conversationHistory,
    searchResults,
    setSearchResults,
  } = useAppStore();
  const clientRef = useRef<RealtimeVoiceClient | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [textInput, setTextInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [conversationHistory]);

  const connect = useCallback(async () => {
    if (voice.isConnected) {
      clientRef.current?.disconnect();
      setVoice({ isConnected: false, isListening: false, isSpeaking: false });
      return;
    }

    setError(null);
    const client = new RealtimeVoiceClient();
    clientRef.current = client;

    client.setCallbacks({
      onAudioLevel: (level) => setVoice({ audioLevel: level }),
      onTranscript: (text, role) => {
        if (text.trim()) {
          addMessage({
            id: crypto.randomUUID(),
            role,
            content: text,
            timestamp: Date.now(),
          });
        }
      },
      onConnectionChange: (connected) => {
        setVoice({ isConnected: connected, isListening: connected });
      },
      onSpeakingChange: (speaking) => {
        setVoice({ isSpeaking: speaking });
      },
    });

    try {
      await client.connect();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to connect"
      );
    }
  }, [voice.isConnected, setVoice, addMessage]);

  const sendTextMessage = useCallback(async () => {
    const text = textInput.trim();
    if (!text) return;

    setTextInput("");
    addMessage({
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      timestamp: Date.now(),
    });

    setIsTyping(true);

    try {
      const res = await apiFetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({
          message: text,
          history: conversationHistory.slice(-10),
        }),
      });

      const data = await res.json();

      if (data.text) {
        addMessage({
          id: crypto.randomUUID(),
          role: "assistant",
          content: data.text,
          timestamp: Date.now(),
          relatedContent: data.relatedContent,
        });
      }

      if (data.relatedContent?.length > 0) {
        setSearchResults(data.relatedContent);
      }
    } catch {
      addMessage({
        id: crypto.randomUUID(),
        role: "assistant",
        content: "I couldn't process that right now. Please try again.",
        timestamp: Date.now(),
      });
    } finally {
      setIsTyping(false);
    }
  }, [textInput, addMessage, conversationHistory, setSearchResults]);

  useEffect(() => {
    return () => {
      clientRef.current?.disconnect();
    };
  }, []);

  return (
    <div className="flex flex-col items-center h-full pt-20 pb-8 px-4">
      <div className="flex-1 flex flex-col items-center justify-center max-w-2xl w-full">
        <VoiceOrb
          audioLevel={voice.audioLevel}
          isSpeaking={voice.isSpeaking}
          isListening={voice.isListening}
          isConnected={voice.isConnected}
          size={isPhone ? 200 : isTV ? 400 : 280}
          onClick={connect}
        />

        {error && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 text-red-400/80 text-sm"
          >
            {error}
          </motion.p>
        )}

        <motion.p
          className="mt-6 text-text-tertiary text-sm text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {voice.isConnected
            ? "Speak naturally about what inspires you"
            : "Tap the orb to start a conversation"}
        </motion.p>
      </div>

      <div
        ref={scrollRef}
        className="w-full max-w-2xl mt-8 max-h-[40vh] overflow-y-auto space-y-3 scrollbar-hide"
      >
        <AnimatePresence>
          {conversationHistory.slice(-10).map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                "px-4 py-3 rounded-[var(--radius-lg)] max-w-[85%] text-sm leading-relaxed",
                msg.role === "user"
                  ? "ml-auto bg-bg-tertiary text-text-primary border border-border"
                  : "mr-auto bg-accent-subtle text-text-primary"
              )}
            >
              {msg.content}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="w-full max-w-2xl mt-4">
        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendTextMessage()}
            placeholder={voice.isConnected ? "Or type here..." : "Type what inspires you..."}
            className="flex-1 bg-bg-secondary border border-border rounded-[var(--radius-full)] px-5 py-3 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-border-hover transition-colors"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={sendTextMessage}
            disabled={!textInput.trim() || isTyping}
            className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-bg-primary disabled:opacity-30 cursor-pointer transition-opacity"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 8H14M14 8L9 3M14 8L9 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.button>
        </div>
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-2 flex items-center gap-1.5 px-2"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span className="text-xs text-text-tertiary">Beauty is thinking...</span>
          </motion.div>
        )}
      </div>

      {searchResults.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl mt-6"
        >
          <p className="text-text-tertiary text-xs uppercase tracking-widest mb-3">
            Related Works
          </p>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {searchResults.slice(0, 6).map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ y: -4 }}
                className="flex-shrink-0 w-36 rounded-[var(--radius-md)] overflow-hidden bg-bg-secondary border border-border cursor-pointer"
              >
                <div className="aspect-[3/4] bg-bg-tertiary">
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="p-2">
                  <p className="text-xs text-text-primary truncate">
                    {item.title}
                  </p>
                  <p className="text-[10px] text-text-tertiary truncate">
                    {item.creator}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
