export function registerServiceWorker() {
  if (typeof window === "undefined") return;
  if (!("serviceWorker" in navigator)) return;

  window.addEventListener("load", async () => {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js");
      console.log("SW registered:", registration.scope);

      registration.addEventListener("updatefound", () => {
        const newWorker = registration.installing;
        if (!newWorker) return;

        newWorker.addEventListener("statechange", () => {
          if (newWorker.state === "activated" && navigator.serviceWorker.controller) {
            console.log("New content available, refresh to update.");
          }
        });
      });
    } catch (error) {
      console.error("SW registration failed:", error);
    }
  });
}
