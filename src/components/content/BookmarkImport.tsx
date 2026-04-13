"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { apiFetch } from "@/lib/platform/api";
import { cn } from "@/lib/utils";

interface ClassifiedBookmark {
  title: string;
  url: string;
  folder?: string;
  category: string;
  tags: string[];
  confidence: number;
}

interface ImportResult {
  total: number;
  designRelated: number;
  uncategorized: number;
  byCategory: Record<string, ClassifiedBookmark[]>;
  items: ClassifiedBookmark[];
}

const CATEGORY_LABELS: Record<string, string> = {
  architecture: "Architecture",
  industrial_design: "Industrial Design",
  graphic_design: "Graphic Design",
  interior_design: "Interior Design",
  book_design: "Book Design",
  ceramics: "Ceramics",
  art: "Art",
  antiques: "Antiques",
  fashion: "Fashion",
};

export function BookmarkImport() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = useCallback(async (file: File) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/import", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to parse bookmarks");

      const data: ImportResult = await res.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Import failed");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const onFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFileUpload(file);
    },
    [handleFileUpload]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) handleFileUpload(file);
    },
    [handleFileUpload]
  );

  return (
    <div>
      <Button variant="secondary" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "Close Import" : "Import Bookmarks"}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 overflow-hidden"
          >
            {/* Drop zone */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={onDrop}
              onClick={() => fileRef.current?.click()}
              className={cn(
                "border-2 border-dashed rounded-[var(--radius-lg)] p-8 text-center cursor-pointer transition-colors",
                isLoading
                  ? "border-accent/40 bg-accent-subtle"
                  : "border-border hover:border-border-hover hover:bg-bg-secondary"
              )}
            >
              <input
                ref={fileRef}
                type="file"
                accept=".html,.htm"
                onChange={onFileChange}
                className="hidden"
              />

              {isLoading ? (
                <div className="flex flex-col items-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full"
                  />
                  <p className="text-sm text-text-secondary">Analyzing bookmarks...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M12 5V19M5 12H19" />
                  </svg>
                  <p className="text-sm text-text-secondary">
                    Drop your browser bookmarks HTML file here
                  </p>
                  <p className="text-xs text-text-tertiary">
                    Export from Chrome: Bookmarks Manager → ⋮ → Export bookmarks
                  </p>
                </div>
              )}
            </div>

            {error && (
              <p className="mt-3 text-sm text-red-400">{error}</p>
            )}

            {/* Results */}
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 space-y-4"
              >
                {/* Stats */}
                <div className="grid grid-cols-3 gap-3">
                  <Card hover={false}>
                    <CardContent className="text-center py-3">
                      <p className="text-2xl font-serif text-text-primary">{result.total}</p>
                      <p className="text-[10px] uppercase tracking-wider text-text-tertiary">Total</p>
                    </CardContent>
                  </Card>
                  <Card hover={false}>
                    <CardContent className="text-center py-3">
                      <p className="text-2xl font-serif text-accent">{result.designRelated}</p>
                      <p className="text-[10px] uppercase tracking-wider text-text-tertiary">Design</p>
                    </CardContent>
                  </Card>
                  <Card hover={false}>
                    <CardContent className="text-center py-3">
                      <p className="text-2xl font-serif text-text-tertiary">{result.uncategorized}</p>
                      <p className="text-[10px] uppercase tracking-wider text-text-tertiary">Other</p>
                    </CardContent>
                  </Card>
                </div>

                {/* By category */}
                <div className="space-y-3">
                  <h3 className="text-xs uppercase tracking-widest text-text-tertiary">
                    Detected Categories
                  </h3>
                  {Object.entries(result.byCategory).map(([cat, items]) => (
                    <Card key={cat} hover={false}>
                      <CardContent>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-text-primary">
                            {CATEGORY_LABELS[cat] || cat}
                          </span>
                          <span className="text-xs text-accent">{items.length}</span>
                        </div>
                        <div className="space-y-1.5 max-h-48 overflow-y-auto">
                          {items.slice(0, 10).map((item, i) => (
                            <a
                              key={i}
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-xs text-text-secondary hover:text-accent transition-colors group"
                            >
                              <span className="truncate flex-1">{item.title}</span>
                              <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                <path d="M6 3H3V13H13V10" strokeLinecap="round" /><path d="M9 2H14V7" strokeLinecap="round" /><path d="M14 2L7 9" strokeLinecap="round" />
                              </svg>
                            </a>
                          ))}
                          {items.length > 10 && (
                            <p className="text-[10px] text-text-tertiary">
                              +{items.length - 10} more
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
