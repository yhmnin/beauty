"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "@/lib/auth/auth-store";
import { cn } from "@/lib/utils";

interface SaveButtonProps {
  contentId: string;
  size?: "sm" | "md";
  className?: string;
  onAuthRequired?: () => void;
}

export function SaveButton({ contentId, size = "sm", className, onAuthRequired }: SaveButtonProps) {
  const { isAuthenticated, isItemSaved, saveItem, unsaveItem } = useAuthStore();
  const saved = isItemSaved(contentId);
  const [animating, setAnimating] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (!isAuthenticated) {
      onAuthRequired?.();
      return;
    }

    setAnimating(true);
    if (saved) {
      unsaveItem(contentId);
    } else {
      saveItem(contentId);
    }
    setTimeout(() => setAnimating(false), 400);
  };

  const s = size === "sm" ? 28 : 34;
  const iconSize = size === "sm" ? 14 : 18;

  return (
    <motion.button
      onClick={handleClick}
      whileTap={{ scale: 0.85 }}
      className={cn(
        "rounded-full flex items-center justify-center transition-all cursor-pointer",
        saved
          ? "bg-text-primary text-bg-primary"
          : "bg-bg-primary/60 backdrop-blur-sm text-text-secondary hover:text-text-primary border border-border",
        className
      )}
      style={{ width: s, height: s }}
      title={saved ? "Unsave" : "Save"}
    >
      <motion.svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 16 16"
        fill={saved ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.5"
        animate={animating ? { scale: [1, 1.3, 1] } : {}}
        transition={{ duration: 0.3 }}
      >
        <path d="M3 2.5V14L8 10.5L13 14V2.5C13 2.22386 12.7761 2 12.5 2H3.5C3.22386 2 3 2.22386 3 2.5Z" strokeLinecap="round" strokeLinejoin="round" />
      </motion.svg>
    </motion.button>
  );
}
