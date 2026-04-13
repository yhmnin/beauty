"use client";

import { motion } from "framer-motion";
import { useAppStore } from "@/lib/store";
import { usePlatform } from "@/lib/platform/hooks";
import { VoiceOrb } from "@/components/voice/VoiceOrb";
import { DisplayText, Body } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";

const CURATED_THEMES = [
  { label: "Japanese Mingei", query: "mingei folk craft" },
  { label: "Swiss Typography", query: "swiss graphic design" },
  { label: "Sacred Architecture", query: "church temple sacred" },
  { label: "Ceramic Masters", query: "ceramics pottery" },
  { label: "Book as Object", query: "book design binding" },
  { label: "Expo '70", query: "osaka expo 1970" },
];

export function HomeView() {
  const { setView } = useAppStore();
  const { isPhone, isTV } = usePlatform();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-accent/[0.03] blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="text-center relative z-10 max-w-2xl"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8"
        >
          <DisplayText>
            What do you
            <br />
            <span className="text-accent">find beautiful?</span>
          </DisplayText>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <Body className="mb-12 max-w-md mx-auto">
            Speak with Beauty to discover the stories behind humanity&apos;s
            finest aesthetic achievements.
          </Body>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="flex justify-center mb-12"
        >
          <VoiceOrb
            audioLevel={0}
            isSpeaking={false}
            isListening={false}
            isConnected={false}
            size={isPhone ? 160 : isTV ? 320 : 220}
            onClick={() => setView("conversation")}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex gap-3 justify-center flex-wrap"
        >
          <Button variant="primary" size="lg" onClick={() => setView("conversation")}>
            Start Conversation
          </Button>
          <Button variant="secondary" size="lg" onClick={() => setView("explore")}>
            Explore Collection
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 1 }}
          className="mt-16"
        >
          <p className="text-text-tertiary text-xs uppercase tracking-widest mb-4">
            Begin a journey
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {CURATED_THEMES.map((theme) => (
              <motion.button
                key={theme.label}
                whileHover={{ scale: 1.05, borderColor: "var(--accent-muted)" }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setView("conversation")}
                className="px-4 py-2 rounded-[var(--radius-full)] text-xs text-text-secondary bg-bg-secondary border border-border hover:text-text-primary transition-colors cursor-pointer"
              >
                {theme.label}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
