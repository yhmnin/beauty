"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface CardProps extends HTMLMotionProps<"div"> {
  hover?: boolean;
}

export function Card({ hover = true, className, children, ...props }: CardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -4, scale: 1.01 } : undefined}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "rounded-[var(--radius-lg)] bg-bg-secondary border border-border",
        "overflow-hidden transition-colors duration-300",
        hover && "hover:border-border-hover hover:bg-bg-tertiary cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function CardImage({
  src,
  alt,
  aspect = "auto",
  className,
}: {
  src: string;
  alt: string;
  aspect?: "auto" | "square" | "video" | "portrait";
  className?: string;
}) {
  const aspectClasses = {
    auto: "",
    square: "aspect-square",
    video: "aspect-video",
    portrait: "aspect-[3/4]",
  };

  return (
    <div className={cn("relative overflow-hidden", aspectClasses[aspect], className)}>
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        loading="lazy"
      />
    </div>
  );
}

export function CardContent({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={cn("p-4", className)}>{children}</div>;
}
