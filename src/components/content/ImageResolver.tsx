"use client";

import { useEffect, useRef } from "react";
import { apiFetch } from "@/lib/platform/api";
import { cacheResolvedImage } from "@/lib/content/image-urls";
import { getAllContent } from "@/lib/content/aesthetic-db";

/**
 * Background component that resolves images for all content items
 * on first page load. Runs once and populates the image cache.
 */
export function ImageResolver() {
  const resolved = useRef(false);

  useEffect(() => {
    if (resolved.current) return;
    resolved.current = true;

    const allContent = getAllContent();
    const ids = allContent
      .filter((c) => !c.imageUrl || c.imageUrl.includes("unsplash.com"))
      .map((c) => c.id);

    if (ids.length === 0) return;

    // Resolve in batches via API
    (async () => {
      try {
        const res = await apiFetch("/api/resolve-image", {
          method: "POST",
          body: JSON.stringify({ ids: ids.slice(0, 30) }),
        });

        if (!res.ok) return;

        const data = await res.json();
        if (data.images) {
          for (const [id, img] of Object.entries(data.images) as [string, any][]) {
            cacheResolvedImage(id, {
              url: img.url,
              source: img.source,
              credit: img.credit,
            });
          }
        }
      } catch {
        // Silent fail — images will use existing fallbacks
      }
    })();
  }, []);

  return null;
}
