"use client";

import { cn } from "@/lib/utils";

interface TypographyProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Type Scale:
 *   Display    32pt  →  font-display (KH Giga), 2.625rem
 *   H1         28pt  →  font-display (KH Giga), 2.333rem
 *   H2         20pt  →  font-display (KH Giga), 1.667rem
 *   Body       16pt  →  font-body (KH Teka),    1rem
 *   Caption    14pt  →  font-body (KH Teka),    0.875rem
 *   Small      12pt  →  font-body (KH Teka),    0.75rem
 *
 * All heading fonts use KH Giga (supports Latin + CJK)
 * All body fonts use KH Teka (supports Latin + CJK)
 * Noto Sans SC/JP loaded as CJK fallback
 */

export function DisplayText({ children, className }: TypographyProps) {
  return (
    <h1
      style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-display)" }}
      className={cn(
        "font-medium tracking-tight leading-[1.05] text-text-primary",
        className
      )}
    >
      {children}
    </h1>
  );
}

export function H1({ children, className }: TypographyProps) {
  return (
    <h1
      style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-h1)" }}
      className={cn(
        "font-medium tracking-tight leading-[1.1] text-text-primary",
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
      style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-h2)" }}
      className={cn(
        "font-medium tracking-tight leading-[1.2] text-text-primary",
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
      style={{ fontFamily: "var(--font-display)" }}
      className={cn(
        "text-base font-medium tracking-tight leading-snug text-text-primary",
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
      style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-body)" }}
      className={cn(
        "leading-relaxed text-text-secondary",
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
      style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-caption)" }}
      className={cn(
        "tracking-wide uppercase text-text-tertiary",
        className
      )}
    >
      {children}
    </span>
  );
}

export function SmallText({ children, className }: TypographyProps) {
  return (
    <span
      style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-small)" }}
      className={cn(
        "text-text-tertiary leading-normal",
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
      style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-small)" }}
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-[var(--radius-full)] font-medium",
        "bg-bg-tertiary text-text-secondary border border-border",
        className
      )}
    >
      {children}
    </span>
  );
}
