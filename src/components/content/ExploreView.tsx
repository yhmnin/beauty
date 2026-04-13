"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardImage, CardContent } from "@/components/ui/Card";
import { MasonryGrid, MasonryItem } from "@/components/ui/MasonryGrid";
import { DisplayText, Body, Caption, Label } from "@/components/ui/Typography";
import { getAllContent, getRelatedItems, getContentByTag, getContentById } from "@/lib/content/aesthetic-db";
import { getImageMeta } from "@/lib/content/image-urls";
import { usePlatform } from "@/lib/platform/hooks";
import { useAppStore, type ContentItem, type CardDisplayMode } from "@/lib/store";
import { SaveButton } from "@/components/auth/SaveButton";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "architecture", label: "Architecture" },
  { id: "industrial_design", label: "Industrial Design" },
  { id: "graphic_design", label: "Graphic Design" },
  { id: "interior_design", label: "Interior Design" },
  { id: "book_design", label: "Book Design" },
  { id: "ceramics", label: "Ceramics" },
  { id: "art", label: "Art" },
  { id: "antiques", label: "Antiques" },
  { id: "movement", label: "Movements" },
];

const MEDIA_FILTERS = [
  { id: "all", label: "All Media" },
  { id: "image", label: "Images" },
  { id: "video", label: "Video" },
  { id: "text", label: "Text" },
  { id: "music", label: "Music" },
];

function MediaIcon({ type, size = 14 }: { type: string; size?: number }) {
  switch (type) {
    case "video":
      return (
        <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="6,3 13,8 6,13" />
        </svg>
      );
    case "music":
      return (
        <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 13V3L14 1V11" /><circle cx="4" cy="13" r="2" /><circle cx="12" cy="11" r="2" />
        </svg>
      );
    case "text":
      return (
        <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 3H13M3 7H10M3 11H13M3 15H8" />
        </svg>
      );
    default:
      return null;
  }
}

export function ExploreView() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeMedia, setActiveMedia] = useState("all");
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const { cardDisplayMode, setCardDisplayMode, activeTagFilter, setActiveTagFilter } = useAppStore();
  const { isPhone, isTablet, isTV } = usePlatform();

  const allContent = useMemo(() => getAllContent(), []);

  const filteredContent = useMemo(() => {
    let items = allContent;

    if (activeTagFilter) {
      items = getContentByTag(activeTagFilter);
    } else if (activeCategory !== "all") {
      items = items.filter(
        (item) => item.category === activeCategory || item.tags.includes(activeCategory)
      );
    }

    if (activeMedia !== "all") {
      items = items.filter((item) => item.mediaType === activeMedia);
    }

    return items;
  }, [activeCategory, activeMedia, activeTagFilter, allContent]);

  const handleTagClick = useCallback((tag: string) => {
    setActiveTagFilter(tag);
    setActiveCategory("all");
  }, [setActiveTagFilter]);

  const clearTagFilter = useCallback(() => {
    setActiveTagFilter(null);
  }, [setActiveTagFilter]);

  const handleCreatorClick = useCallback((creatorId?: string) => {
    if (creatorId) {
      const item = getContentById(creatorId);
      if (item) setSelectedItem(item);
    }
  }, []);

  return (
    <div className={cn(
      "min-h-screen pb-12 px-4 md:px-8 lg:px-12",
      isPhone ? "pt-6" : "pt-20"
    )}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-7xl mx-auto"
      >
        {/* Header with display mode toggle */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <DisplayText className="mb-3">Explore</DisplayText>
            <Body className="max-w-lg">
              A curated collection of humanity&apos;s finest aesthetic achievements.
            </Body>
          </div>
          <div className="flex items-center gap-1 bg-bg-secondary border border-border rounded-[var(--radius-full)] p-1">
            <DisplayToggle
              active={cardDisplayMode === "minimal"}
              onClick={() => setCardDisplayMode("minimal")}
              label="Grid"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="2" y="2" width="5" height="5" rx="1" />
                <rect x="9" y="2" width="5" height="5" rx="1" />
                <rect x="2" y="9" width="5" height="5" rx="1" />
                <rect x="9" y="9" width="5" height="5" rx="1" />
              </svg>
            </DisplayToggle>
            <DisplayToggle
              active={cardDisplayMode === "info"}
              onClick={() => setCardDisplayMode("info")}
              label="Detail"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="2" y="2" width="12" height="5" rx="1" />
                <path d="M2 10H10M2 13H7" />
              </svg>
            </DisplayToggle>
          </div>
        </div>

        {/* Active tag filter indicator */}
        {activeTagFilter && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 mb-6 px-4 py-2.5 bg-accent-subtle rounded-[var(--radius-lg)] border border-accent/20"
          >
            <span className="text-sm text-accent">Filtered by:</span>
            <span className="text-sm font-medium text-text-primary">{activeTagFilter}</span>
            <button onClick={clearTagFilter} className="ml-auto text-text-tertiary hover:text-text-primary cursor-pointer">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </motion.div>
        )}

        {/* Category filters */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-3 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => { setActiveCategory(cat.id); setActiveTagFilter(null); }}
              className={cn(
                "flex-shrink-0 px-4 py-2 rounded-[var(--radius-full)] text-sm font-medium transition-all duration-300 cursor-pointer",
                activeCategory === cat.id && !activeTagFilter
                  ? "bg-text-primary text-bg-primary"
                  : "bg-bg-secondary text-text-tertiary border border-border hover:text-text-secondary hover:border-border-hover"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Media type filters */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide">
          {MEDIA_FILTERS.map((mf) => (
            <button
              key={mf.id}
              onClick={() => setActiveMedia(mf.id)}
              className={cn(
                "flex-shrink-0 px-3 py-1.5 rounded-[var(--radius-full)] text-xs font-medium transition-all duration-300 cursor-pointer",
                activeMedia === mf.id
                  ? "bg-bg-elevated text-text-primary border border-border-hover"
                  : "text-text-tertiary hover:text-text-secondary"
              )}
            >
              {mf.label}
            </button>
          ))}
        </div>

        {/* Content grid */}
        <MasonryGrid
          columns={isPhone ? (cardDisplayMode === "minimal" ? 2 : 1) : isTablet ? 2 : isTV ? 4 : 3}
          gap={isPhone ? (cardDisplayMode === "minimal" ? 8 : 12) : 16}
          className="[&]:columns-1 md:[&]:columns-2 lg:[&]:columns-3 2xl:[&]:columns-4"
        >
          {filteredContent.map((item, index) => (
            <MasonryItem key={item.id} index={index}>
              {cardDisplayMode === "minimal" ? (
                <MinimalCard item={item} onClick={() => setSelectedItem(item)} />
              ) : (
                <InfoCard
                  item={item}
                  index={index}
                  onClick={() => setSelectedItem(item)}
                  onTagClick={handleTagClick}
                  onCreatorClick={handleCreatorClick}
                />
              )}
            </MasonryItem>
          ))}
        </MasonryGrid>

        {filteredContent.length === 0 && (
          <div className="text-center py-20">
            <p className="text-text-tertiary">No content matches this filter.</p>
          </div>
        )}
      </motion.div>

      <AnimatePresence>
        {selectedItem && (
          <ContentDetailPanel
            item={selectedItem}
            onClose={() => setSelectedItem(null)}
            onNavigate={setSelectedItem}
            onTagClick={handleTagClick}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Display mode toggle button ── */
function DisplayToggle({
  active,
  onClick,
  label,
  children,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={cn(
        "p-2 rounded-[var(--radius-full)] transition-all cursor-pointer",
        active ? "bg-bg-elevated text-text-primary" : "text-text-tertiary hover:text-text-secondary"
      )}
    >
      {children}
    </button>
  );
}

/* ── Minimal (pure image) card ── */
function MinimalCard({ item, onClick }: { item: ContentItem; onClick: () => void }) {
  return (
    <Card onClick={onClick} className="group relative">
      <CardImage
        src={item.imageUrl}
        alt={item.title}
        aspect="auto"
      />
      {item.mediaType !== "image" && (
        <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-bg-primary/70 backdrop-blur-sm flex items-center justify-center text-text-secondary">
          <MediaIcon type={item.mediaType} size={12} />
        </div>
      )}
      {/* Hover overlay with title + save */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-3">
        <p className="text-white text-xs font-medium truncate flex-1 mr-2">{item.title}</p>
        <SaveButton contentId={item.id} title={item.title} imageUrl={item.imageUrl} creator={item.creator} size="sm" />
      </div>
    </Card>
  );
}

/* ── Info card (image + metadata) ── */
function InfoCard({
  item,
  index,
  onClick,
  onTagClick,
  onCreatorClick,
}: {
  item: ContentItem;
  index: number;
  onClick: () => void;
  onTagClick: (tag: string) => void;
  onCreatorClick: (creatorId?: string) => void;
}) {
  return (
    <Card onClick={onClick} className="group">
      <div className="relative">
        <CardImage
          src={item.imageUrl}
          alt={item.title}
          aspect={index % 3 === 0 ? "portrait" : index % 3 === 1 ? "square" : "video"}
        />
        {item.mediaType !== "image" && (
          <div className="absolute top-2 right-2 px-2 py-1 rounded-full bg-bg-primary/70 backdrop-blur-sm flex items-center gap-1 text-text-secondary text-[10px]">
            <MediaIcon type={item.mediaType} size={11} />
            <span className="uppercase">{item.mediaType}</span>
          </div>
        )}
        {item.mediaType === "text" && item.textContent && (
          <div className="absolute inset-0 bg-bg-primary/80 flex items-center justify-center p-6">
            <p className="text-text-primary text-sm italic leading-relaxed text-center line-clamp-4 font-serif">
              {item.textContent}
            </p>
          </div>
        )}
        <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <SaveButton contentId={item.id} title={item.title} imageUrl={item.imageUrl} creator={item.creator} size="sm" />
        </div>
      </div>
      <CardContent>
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="text-sm font-medium text-text-primary leading-tight">{item.title}</h3>
          {item.year && <Caption className="flex-shrink-0">{item.year}</Caption>}
        </div>
        {item.creator && (
          <button
            onClick={(e) => { e.stopPropagation(); onCreatorClick(item.creatorId); }}
            className={cn(
              "text-xs mb-2 transition-colors",
              item.creatorId ? "text-accent hover:text-accent-muted cursor-pointer" : "text-text-tertiary"
            )}
          >
            {item.creator}
          </button>
        )}
        <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">
          {item.description}
        </p>
        <div className="flex gap-1.5 mt-3 flex-wrap">
          {item.tags.slice(0, 3).map((tag) => (
            <button
              key={tag}
              onClick={(e) => { e.stopPropagation(); onTagClick(tag); }}
              className="inline-flex items-center px-2.5 py-0.5 rounded-[var(--radius-full)] text-[10px] font-medium bg-bg-tertiary text-text-secondary border border-border hover:border-accent/30 hover:text-accent transition-colors cursor-pointer"
            >
              {tag}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

/* ── Cosmos-style split detail panel ── */
function ContentDetailPanel({
  item,
  onClose,
  onNavigate,
  onTagClick,
}: {
  item: ContentItem;
  onClose: () => void;
  onNavigate: (item: ContentItem) => void;
  onTagClick: (tag: string) => void;
}) {
  const relatedItems = useMemo(() => getRelatedItems(item), [item]);
  const imageMeta = useMemo(() => getImageMeta(item.id), [item.id]);
  const { isPhone } = usePlatform();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-stretch"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-bg-primary/95 backdrop-blur-2xl" />

      <motion.div
        initial={{ opacity: 0, y: isPhone ? 40 : 0, x: isPhone ? 0 : 20 }}
        animate={{ opacity: 1, y: 0, x: 0 }}
        exit={{ opacity: 0, y: isPhone ? 30 : 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "relative w-full max-h-screen overflow-y-auto",
          isPhone
            ? "flex flex-col pt-12 pb-24"
            : "flex flex-row max-w-6xl mx-auto my-8 rounded-[var(--radius-xl)] border border-border bg-bg-secondary overflow-hidden"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left: Media */}
        <div className={cn(
          "flex-shrink-0 relative",
          isPhone ? "w-full aspect-[4/3]" : "w-[55%] min-h-[70vh]"
        )}>
          {item.mediaType === "video" && item.videoUrl ? (
            <div className="w-full h-full bg-bg-tertiary flex flex-col items-center justify-center gap-4 p-8">
              <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover absolute inset-0 opacity-40" />
              <div className="relative z-10 flex flex-col items-center gap-4">
                <a
                  href={item.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-16 h-16 rounded-full bg-accent/90 flex items-center justify-center hover:bg-accent transition-colors"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><polygon points="9,5 19,12 9,19" /></svg>
                </a>
                <span className="text-text-secondary text-sm">Watch Video</span>
              </div>
            </div>
          ) : item.mediaType === "music" && item.musicUrl ? (
            <div className="w-full h-full relative flex flex-col items-center justify-center gap-4">
              <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover absolute inset-0 opacity-30" />
              <div className="relative z-10 flex flex-col items-center gap-4">
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="w-24 h-24 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center"
                >
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M9 18V5L21 3V16" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
                  </svg>
                </motion.div>
                <a
                  href={item.musicUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2 rounded-[var(--radius-full)] bg-text-primary text-bg-primary text-sm font-medium hover:bg-text-secondary transition-colors"
                >
                  Listen
                </a>
              </div>
            </div>
          ) : item.mediaType === "text" && item.textContent ? (
            <div className="w-full h-full relative flex items-center justify-center p-12">
              <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover absolute inset-0 opacity-15" />
              <blockquote className="relative z-10 font-serif text-xl md:text-2xl text-text-primary leading-relaxed text-center italic max-w-lg">
                {item.textContent}
              </blockquote>
            </div>
          ) : (
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-full object-cover"
            />
          )}
          {/* Image credit overlay — like Cosmos's attribution labels */}
          {imageMeta && (
            <div className="absolute bottom-0 left-0 right-0 px-3 py-2 bg-gradient-to-t from-black/50 to-transparent">
              <p className="text-[10px] text-white/60 truncate">
                {imageMeta.source} — {imageMeta.credit}
              </p>
            </div>
          )}
        </div>

        {/* Right: Info panel */}
        <div className={cn(
          "flex flex-col",
          isPhone ? "px-5 py-6" : "w-[45%] p-8 overflow-y-auto"
        )}>
          {/* Category + Year badges */}
          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => { onClose(); onTagClick(item.category); }}
              className="inline-flex items-center px-3 py-1 rounded-[var(--radius-full)] text-[10px] font-medium uppercase tracking-wider bg-bg-tertiary text-text-secondary border border-border hover:border-accent/30 hover:text-accent transition-colors cursor-pointer"
            >
              {item.category.replace(/_/g, " ")}
            </button>
            {item.year && (
              <span className="text-[10px] uppercase tracking-wider text-text-tertiary">{item.year}</span>
            )}
            {item.mediaType !== "image" && (
              <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-text-tertiary">
                <MediaIcon type={item.mediaType} size={10} />
                {item.mediaType}
              </span>
            )}
          </div>

          {/* Title */}
          <h2 className="font-serif text-2xl md:text-3xl text-text-primary mb-2 leading-tight">
            {item.title}
          </h2>

          {/* Creator — clickable */}
          {item.creator && (
            <button
              onClick={() => {
                if (item.creatorId) {
                  const creatorItem = getContentById(item.creatorId);
                  if (creatorItem) onNavigate(creatorItem);
                }
              }}
              className={cn(
                "text-base mb-4 text-left",
                item.creatorId ? "text-accent hover:underline cursor-pointer" : "text-text-tertiary"
              )}
            >
              {item.creator}
            </button>
          )}

          {/* Description */}
          <p className="text-text-secondary leading-relaxed text-sm mb-6">
            {item.description}
          </p>

          {/* Source link */}
          {item.sourceUrl && (
            <a
              href={item.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-text-tertiary hover:text-accent transition-colors mb-6"
            >
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M6 3H3V13H13V10" /><path d="M9 2H14V7" /><path d="M14 2L7 9" />
              </svg>
              View source
            </a>
          )}

          {/* Tags — all clickable */}
          <div className="flex gap-2 flex-wrap mb-8">
            {item.tags.map((tag) => (
              <button
                key={tag}
                onClick={() => { onClose(); onTagClick(tag); }}
                className="px-3 py-1 rounded-[var(--radius-full)] text-xs font-medium bg-bg-tertiary text-text-secondary border border-border hover:border-accent/30 hover:text-accent transition-colors cursor-pointer"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Related content */}
          {relatedItems.length > 0 && (
            <div className="mt-auto pt-6 border-t border-border">
              <h3 className="text-xs uppercase tracking-widest text-text-tertiary mb-4">Related</h3>
              <div className="grid grid-cols-3 gap-2">
                {relatedItems.slice(0, 6).map((related) => (
                  <motion.button
                    key={related.id}
                    whileHover={{ scale: 1.03 }}
                    onClick={() => onNavigate(related)}
                    className="rounded-[var(--radius-md)] overflow-hidden bg-bg-tertiary border border-border hover:border-border-hover transition-colors cursor-pointer text-left"
                  >
                    <div className="aspect-square relative">
                      <img src={related.imageUrl} alt={related.title} className="w-full h-full object-cover" />
                      {related.mediaType !== "image" && (
                        <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-bg-primary/70 flex items-center justify-center text-text-secondary">
                          <MediaIcon type={related.mediaType} size={9} />
                        </div>
                      )}
                    </div>
                    <div className="p-1.5">
                      <p className="text-[10px] text-text-primary truncate leading-tight">{related.title}</p>
                      {related.creator && (
                        <p className="text-[9px] text-text-tertiary truncate">{related.creator}</p>
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-bg-primary/60 backdrop-blur-md border border-border flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </motion.div>
    </motion.div>
  );
}
