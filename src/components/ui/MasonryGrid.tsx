"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MasonryGridProps {
  children: React.ReactNode;
  columns?: number;
  gap?: number;
  className?: string;
}

export function MasonryGrid({
  children,
  columns = 3,
  gap = 16,
  className,
}: MasonryGridProps) {
  return (
    <div
      className={cn("w-full", className)}
      style={{
        columnCount: columns,
        columnGap: `${gap}px`,
      }}
    >
      {children}
    </div>
  );
}

export function MasonryItem({
  children,
  index = 0,
  className,
}: {
  children: React.ReactNode;
  index?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay: index * 0.05,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={cn("break-inside-avoid mb-4", className)}
    >
      {children}
    </motion.div>
  );
}
