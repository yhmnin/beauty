"use client";

import { useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { VoiceVisualizer } from "@/lib/voice/voice-visualizer";
import { cn } from "@/lib/utils";

interface VoiceOrbProps {
  audioLevel: number;
  isSpeaking: boolean;
  isListening: boolean;
  isConnected: boolean;
  size?: number;
  className?: string;
  onClick?: () => void;
}

export function VoiceOrb({
  audioLevel,
  isSpeaking,
  isListening,
  isConnected,
  size = 300,
  className,
  onClick,
}: VoiceOrbProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const visualizerRef = useRef<VoiceVisualizer | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const viz = new VoiceVisualizer(canvas);
    visualizerRef.current = viz;
    viz.start();

    const handleResize = () => viz.resize();
    window.addEventListener("resize", handleResize);

    return () => {
      viz.stop();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    visualizerRef.current?.setAudioLevel(audioLevel);
  }, [audioLevel]);

  useEffect(() => {
    visualizerRef.current?.setSpeaking(isSpeaking);
  }, [isSpeaking]);

  useEffect(() => {
    visualizerRef.current?.setListening(isListening);
  }, [isListening]);

  return (
    <motion.div
      className={cn("relative cursor-pointer select-none", className)}
      style={{ width: size, height: size }}
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ width: size, height: size }}
      />

      {!isConnected && (
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{
              opacity: [0.4, 0.8, 0.4],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="text-text-tertiary text-sm font-medium tracking-wide"
          >
            Tap to begin
          </motion.div>
        </div>
      )}

      {isConnected && isListening && !isSpeaking && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-text-tertiary text-xs tracking-widest uppercase"
          >
            Listening
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
