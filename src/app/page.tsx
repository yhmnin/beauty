"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useAppStore } from "@/lib/store";
import { usePlatform } from "@/lib/platform/hooks";
import { OpeningSequence } from "@/components/voice/OpeningSequence";
import { HomeView } from "@/components/content/HomeView";
import { ConversationView } from "@/components/voice/ConversationView";
import { ExploreView } from "@/components/content/ExploreView";
import { ProfileView } from "@/components/content/ProfileView";
import { Navigation } from "@/components/layout/Navigation";

export default function Home() {
  const { view } = useAppStore();
  const { isPhone, isTV } = usePlatform();

  return (
    <div
      className="min-h-screen bg-bg-primary"
      style={{
        paddingBottom: isPhone ? "calc(4.5rem + env(safe-area-inset-bottom, 0px))" : undefined,
        fontSize: isTV ? "120%" : undefined,
      }}
    >
      <Navigation />

      <AnimatePresence mode="wait">
        {view === "opening" && (
          <motion.div key="opening" exit={{ opacity: 0 }} transition={{ duration: 0.8 }}>
            <OpeningSequence />
          </motion.div>
        )}

        {view === "home" && (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <HomeView />
          </motion.div>
        )}

        {view === "conversation" && (
          <motion.div
            key="conversation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="h-screen"
          >
            <ConversationView />
          </motion.div>
        )}

        {view === "explore" && (
          <motion.div
            key="explore"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <ExploreView />
          </motion.div>
        )}

        {view === "profile" && (
          <motion.div
            key="profile"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <ProfileView />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
