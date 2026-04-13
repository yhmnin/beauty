"use client";

import { useEffect } from "react";
import { registerServiceWorker } from "@/lib/platform/service-worker";

export function ServiceWorkerRegistrar() {
  useEffect(() => {
    registerServiceWorker();
  }, []);

  return null;
}
