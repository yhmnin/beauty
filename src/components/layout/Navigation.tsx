"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAppStore, type AppView } from "@/lib/store";
import { usePlatform } from "@/lib/platform/hooks";

const navItems: { id: AppView; label: string; icon: React.ReactNode }[] = [
  {
    id: "home",
    label: "Home",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 7.5L10 2L17 7.5V16C17 16.5523 16.5523 17 16 17H4C3.44772 17 3 16.5523 3 16V7.5Z" />
      </svg>
    ),
  },
  {
    id: "conversation",
    label: "Converse",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="10" cy="10" r="7" />
        <circle cx="10" cy="10" r="3" />
      </svg>
    ),
  },
  {
    id: "explore",
    label: "Explore",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="6" height="6" rx="1" />
        <rect x="11" y="3" width="6" height="4" rx="1" />
        <rect x="3" y="11" width="6" height="4" rx="1" />
        <rect x="11" y="9" width="6" height="6" rx="1" />
      </svg>
    ),
  },
  {
    id: "profile",
    label: "Profile",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="10" cy="7" r="3" />
        <path d="M4 17C4 13.6863 6.68629 11 10 11C13.3137 11 16 13.6863 16 17" />
      </svg>
    ),
  },
];

export function Navigation() {
  const { view, setView, hasCompletedOpening } = useAppStore();
  const { screenCategory } = usePlatform();

  if (!hasCompletedOpening || view === "opening") return null;

  const isPhone = screenCategory === "phone";

  if (isPhone) {
    return <MobileNav view={view} setView={setView} />;
  }

  return <DesktopNav view={view} setView={setView} />;
}

function DesktopNav({
  view,
  setView,
}: {
  view: AppView;
  setView: (v: AppView) => void;
}) {
  return (
    <AnimatePresence>
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4"
        style={{ paddingTop: "max(1rem, env(safe-area-inset-top))" }}
      >
        <motion.button
          onClick={() => setView("home")}
          className="font-serif text-xl tracking-tight text-text-primary cursor-pointer"
          whileHover={{ opacity: 0.7 }}
        >
          Beauty
        </motion.button>

        <div className="flex items-center gap-1 bg-bg-secondary/80 backdrop-blur-xl border border-border rounded-[var(--radius-full)] px-1.5 py-1.5">
          {navItems.map((item) => (
            <DesktopNavItem
              key={item.id}
              label={item.label}
              isActive={view === item.id}
              onClick={() => setView(item.id)}
            />
          ))}
        </div>

        <div className="w-[60px]" />
      </motion.nav>
    </AnimatePresence>
  );
}

function DesktopNavItem({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative px-4 py-1.5 text-sm font-medium rounded-[var(--radius-full)] transition-colors duration-200 cursor-pointer",
        isActive
          ? "text-text-primary"
          : "text-text-tertiary hover:text-text-secondary"
      )}
    >
      {isActive && (
        <motion.div
          layoutId="nav-pill"
          className="absolute inset-0 bg-bg-elevated border border-border-hover rounded-[var(--radius-full)]"
          transition={{ type: "spring", duration: 0.5, bounce: 0.15 }}
        />
      )}
      <span className="relative z-10">{label}</span>
    </button>
  );
}

function MobileNav({
  view,
  setView,
}: {
  view: AppView;
  setView: (v: AppView) => void;
}) {
  return (
    <motion.nav
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="fixed bottom-0 left-0 right-0 z-50 bg-bg-secondary/90 backdrop-blur-xl border-t border-border"
      style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
    >
      <div className="flex items-center justify-around px-2 pt-2">
        {navItems.map((item) => (
          <MobileNavItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            isActive={view === item.id}
            onClick={() => setView(item.id)}
          />
        ))}
      </div>
    </motion.nav>
  );
}

function MobileNavItem({
  icon,
  label,
  isActive,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors duration-200 cursor-pointer min-w-[60px]",
        isActive ? "text-text-primary" : "text-text-tertiary"
      )}
    >
      {isActive && (
        <motion.div
          layoutId="mobile-nav-indicator"
          className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full bg-text-primary"
          transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
        />
      )}
      {icon}
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );
}
