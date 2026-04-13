"use client";

import { cn } from "@/lib/utils";

interface TypographyProps {
  children: React.ReactNode;
  className?: string;
}

export function DisplayText({ children, className }: TypographyProps) {
  return (
    <h1
      className={cn(
        "font-serif text-5xl md:text-7xl lg:text-8xl tracking-tight leading-[0.9] text-text-primary",
        className
      )}
    >
      {children}
    </h1>
  );
}

export function Heading({ children, className }: TypographyProps) {
  return (
    <h2
      className={cn(
        "font-serif text-3xl md:text-4xl tracking-tight leading-tight text-text-primary",
        className
      )}
    >
      {children}
    </h2>
  );
}

export function Subheading({ children, className }: TypographyProps) {
  return (
    <h3
      className={cn(
        "font-sans text-lg md:text-xl font-medium tracking-tight text-text-primary",
        className
      )}
    >
      {children}
    </h3>
  );
}

export function Body({ children, className }: TypographyProps) {
  return (
    <p
      className={cn(
        "font-sans text-base leading-relaxed text-text-secondary",
        className
      )}
    >
      {children}
    </p>
  );
}

export function Caption({ children, className }: TypographyProps) {
  return (
    <span
      className={cn(
        "font-sans text-xs tracking-wide uppercase text-text-tertiary",
        className
      )}
    >
      {children}
    </span>
  );
}

export function Label({ children, className }: TypographyProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-[var(--radius-full)] text-xs font-medium",
        "bg-bg-tertiary text-text-secondary border border-border",
        className
      )}
    >
      {children}
    </span>
  );
}
