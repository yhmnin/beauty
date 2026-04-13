export type Platform =
  | "web"
  | "ios"
  | "android"
  | "macos"
  | "windows"
  | "linux"
  | "tv"
  | "unknown";

export type ScreenCategory = "phone" | "tablet" | "desktop" | "tv";

export function detectPlatform(): Platform {
  if (typeof window === "undefined") return "web";

  const ua = navigator.userAgent.toLowerCase();
  const win = window as unknown as Record<string, unknown>;

  // Tauri desktop — detect OS from UA, not hardcode macOS
  if (win.__TAURI__) {
    if (/macintosh/.test(ua)) return "macos";
    if (/windows/.test(ua)) return "windows";
    if (/linux/.test(ua)) return "linux";
    return "macos";
  }

  // Capacitor native wrapper
  if (win.Capacitor) {
    if (/iphone|ipad|ipod/.test(ua)) return "ios";
    if (/android/.test(ua)) return "android";
  }

  // Smart TV platforms (check before generic desktop/mobile)
  if (
    /smart-tv|smarttv|netcast|appletv|googletv|hbbtv|pov_tv|webos|tizen|roku|vizio|philipstv|samsungbrowser.*tv/i.test(
      ua
    )
  ) {
    return "tv";
  }

  // Mobile browsers
  if (/iphone|ipad|ipod/.test(ua)) return "ios";
  if (/android/.test(ua)) return "android";

  // Desktop browsers
  if (/macintosh/.test(ua)) return "macos";
  if (/windows/.test(ua)) return "windows";
  if (/linux/.test(ua)) return "linux";

  return "web";
}

export function getScreenCategory(): ScreenCategory {
  if (typeof window === "undefined") return "desktop";

  const width = window.innerWidth;
  const platform = detectPlatform();

  // Explicit TV platform or very large screen
  if (platform === "tv" || width >= 1920) return "tv";
  if (width < 640) return "phone";
  if (width < 1024) return "tablet";
  return "desktop";
}

export function supportsVoice(): boolean {
  if (typeof window === "undefined") return false;
  return (
    typeof navigator.mediaDevices?.getUserMedia === "function" &&
    typeof window.RTCPeerConnection === "function"
  );
}

export function supportsPWA(): boolean {
  if (typeof window === "undefined") return false;
  return "serviceWorker" in navigator;
}

export function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as unknown as Record<string, boolean>).standalone === true
  );
}

export function hasPointer(): boolean {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(pointer: fine)").matches;
}

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
