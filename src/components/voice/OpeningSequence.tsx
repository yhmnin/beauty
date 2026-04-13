"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/lib/store";

export function OpeningSequence() {
  const { setView, setHasCompletedOpening } = useAppStore();
  const [phase, setPhase] = useState<"dark" | "title" | "subtitle" | "fade">("dark");

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase("title"), 800),
      setTimeout(() => setPhase("subtitle"), 2800),
      setTimeout(() => setPhase("fade"), 5500),
      setTimeout(() => {
        setHasCompletedOpening(true);
        setView("home");
      }, 7000),
    ];

    return () => timers.forEach(clearTimeout);
  }, [setView, setHasCompletedOpening]);

  const skipOpening = useCallback(() => {
    setHasCompletedOpening(true);
    setView("home");
  }, [setView, setHasCompletedOpening]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-bg-primary cursor-pointer"
      onClick={skipOpening}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
    >
      <AnimatePresence mode="wait">
        {phase === "dark" && (
          <motion.div
            key="dark"
            className="absolute inset-0 bg-bg-primary"
            exit={{ opacity: 0 }}
          />
        )}

        {(phase === "title" || phase === "subtitle") && (
          <motion.div
            key="content"
            className="flex flex-col items-center gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.h1
              className="font-serif text-6xl md:text-8xl tracking-tight text-text-primary"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            >
              Beauty
            </motion.h1>

            {phase === "subtitle" && (
              <motion.p
                className="text-text-tertiary text-lg md:text-xl tracking-wide font-light max-w-md text-center leading-relaxed"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              >
                What do you find beautiful?
              </motion.p>
            )}

            <motion.div
              className="mt-8 w-12 h-[1px] bg-gradient-to-r from-transparent via-accent/40 to-transparent"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
            />
          </motion.div>
        )}

        {phase === "fade" && (
          <motion.div
            key="fade"
            className="absolute inset-0 bg-bg-primary"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
          />
        )}
      </AnimatePresence>

      <motion.span
        className="absolute bottom-8 text-text-tertiary/40 text-xs tracking-widest uppercase"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        Tap anywhere to skip
      </motion.span>
    </motion.div>
  );
}
