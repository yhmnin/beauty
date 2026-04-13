"use client";

import { useState, useEffect, useSyncExternalStore } from "react";
import {
  detectPlatform,
  getScreenCategory,
  supportsVoice,
  isStandalone,
  type Platform,
  type ScreenCategory,
} from "./detect";

function subscribe(callback: () => void) {
  window.addEventListener("resize", callback);
  return () => window.removeEventListener("resize", callback);
}

function getSnapshot(): ScreenCategory {
  return getScreenCategory();
}

function getServerSnapshot(): ScreenCategory {
  return "desktop";
}

export function usePlatform() {
  const screenCategory = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  const [platform, setPlatform] = useState<Platform>("web");
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [standalone, setStandalone] = useState(false);

  useEffect(() => {
    setPlatform(detectPlatform());
    setVoiceSupported(supportsVoice());
    setStandalone(isStandalone());
  }, []);

  return {
    platform,
    screenCategory,
    isPhone: screenCategory === "phone",
    isTablet: screenCategory === "tablet",
    isDesktop: screenCategory === "desktop",
    isTV: screenCategory === "tv",
    voiceSupported,
    standalone,
    isMobile: screenCategory === "phone" || screenCategory === "tablet",
  };
}
