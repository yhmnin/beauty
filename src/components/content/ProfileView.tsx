"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DisplayText, Heading, Body, Caption, Label } from "@/components/ui/Typography";
import { Card, CardContent } from "@/components/ui/Card";
import { BookmarkImport } from "@/components/content/BookmarkImport";
import { AuthModal } from "@/components/auth/AuthModal";
import { useAppStore } from "@/lib/store";
import { useAuthStore } from "@/lib/auth/auth-store";
import { getContentById } from "@/lib/content/aesthetic-db";
import { usePlatform } from "@/lib/platform/hooks";
import { cn } from "@/lib/utils";

export function ProfileView() {
  const { conversationHistory } = useAppStore();
  const { user, isAuthenticated, savedItems, collections, logout, changePassword, unsaveItem, syncFromServer } = useAuthStore();
  const { isPhone } = usePlatform();
  const [showAuth, setShowAuth] = useState(false);
  const [activeCollection, setActiveCollection] = useState("default");
  const [showPasswordChange, setShowPasswordChange] = useState(false);

  // Sync saved items from server (picks up extension saves)
  useEffect(() => {
    if (isAuthenticated) {
      syncFromServer();
    }
  }, [isAuthenticated, syncFromServer]);

  // If not logged in, show login prompt
  if (!isAuthenticated) {
    return (
      <div className={`min-h-screen ${isPhone ? "pt-6" : "pt-20"} pb-12 px-4 md:px-8 lg:px-12`}>
        <div className="max-w-md mx-auto text-center pt-20">
          <DisplayText className="mb-4">Your Taste</DisplayText>
          <Body className="mb-8">
            Sign in to save inspirations, build collections, and track your aesthetic journey.
          </Body>
          <button
            onClick={() => setShowAuth(true)}
            className="px-8 py-3 rounded-[var(--radius-full)] bg-text-primary text-bg-primary text-sm font-medium hover:bg-text-secondary transition-colors cursor-pointer"
          >
            Sign In or Create Account
          </button>
          <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
        </div>
      </div>
    );
  }

  const collectionItems = savedItems.filter(
    (s) => activeCollection === "default" || s.collection === activeCollection
  );

  return (
    <div className={`min-h-screen ${isPhone ? "pt-6" : "pt-20"} pb-12 px-4 md:px-8 lg:px-12`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-4xl mx-auto"
      >
        {/* User header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-bg-elevated border border-border flex items-center justify-center text-xl font-medium text-text-primary">
              {user?.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-h2)" }} className="text-text-primary">
                {user?.name}
              </h1>
              <p style={{ fontSize: "var(--text-caption)" }} className="text-text-tertiary">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPasswordChange(!showPasswordChange)}
              className="px-3 py-1.5 rounded-[var(--radius-full)] text-xs text-text-tertiary hover:text-text-secondary border border-border hover:border-border-hover transition-colors cursor-pointer"
            >
              Settings
            </button>
            <button
              onClick={logout}
              className="px-3 py-1.5 rounded-[var(--radius-full)] text-xs text-text-tertiary hover:text-red-400 border border-border hover:border-red-400/30 transition-colors cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Password change panel */}
        <AnimatePresence>
          {showPasswordChange && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-8"
            >
              <PasswordChangeForm
                onDone={() => setShowPasswordChange(false)}
                changePassword={changePassword}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-10">
          <Card hover={false}>
            <CardContent className="text-center py-4">
              <p className="text-2xl font-serif text-text-primary">{savedItems.length}</p>
              <Caption>Saved</Caption>
            </CardContent>
          </Card>
          <Card hover={false}>
            <CardContent className="text-center py-4">
              <p className="text-2xl font-serif text-text-primary">{collections.length}</p>
              <Caption>Collections</Caption>
            </CardContent>
          </Card>
          <Card hover={false}>
            <CardContent className="text-center py-4">
              <p className="text-2xl font-serif text-text-primary">{conversationHistory.length}</p>
              <Caption>Messages</Caption>
            </CardContent>
          </Card>
        </div>

        {/* Collections tabs */}
        <div className="mb-6">
          <Heading className="mb-4">Saved</Heading>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {collections.map((col) => (
              <button
                key={col.id}
                onClick={() => setActiveCollection(col.id)}
                className={cn(
                  "flex-shrink-0 px-4 py-2 rounded-[var(--radius-full)] text-sm font-medium transition-all cursor-pointer",
                  activeCollection === col.id
                    ? "bg-text-primary text-bg-primary"
                    : "bg-bg-secondary text-text-tertiary border border-border hover:text-text-secondary"
                )}
              >
                {col.name} ({col.itemCount})
              </button>
            ))}
          </div>
        </div>

        {/* Saved items grid */}
        {collectionItems.length === 0 ? (
          <Card hover={false}>
            <CardContent className="py-16 text-center">
              <p className="text-text-tertiary text-sm mb-2">No saved items yet</p>
              <p className="text-text-tertiary text-xs">
                Browse Explore and click the bookmark icon to save inspirations.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {collectionItems.map((item, i) => (
              <SavedItemCard key={item.contentId} item={item} index={i} onUnsave={unsaveItem} />
            ))}
          </div>
        )}

        {/* Import section */}
        <div className="mt-12">
          <Heading className="mb-4">Import</Heading>
          <Body className="mb-4">
            Import bookmarks from your browser to discover design content.
          </Body>
          <BookmarkImport />
        </div>
      </motion.div>
    </div>
  );
}

function SavedItemCard({
  item,
  index,
  onUnsave,
}: {
  item: { contentId: string; savedAt: number; title?: string; imageUrl?: string; creator?: string };
  index: number;
  onUnsave: (id: string) => void;
}) {
  const content = getContentById(item.contentId);
  const title = item.title || content?.title || item.contentId;
  const imageUrl = item.imageUrl || content?.imageUrl;
  const creator = item.creator || content?.creator;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-[var(--radius-md)] overflow-hidden bg-bg-secondary border border-border group relative"
    >
      <div className="aspect-square bg-bg-tertiary">
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-text-tertiary text-xs">
            No image
          </div>
        )}
      </div>
      <div className="p-2.5">
        <p className="text-xs text-text-primary truncate leading-tight">{title}</p>
        {creator && <p className="text-[10px] text-text-tertiary truncate mt-0.5">{creator}</p>}
        <p className="text-[9px] text-text-tertiary mt-1">
          {new Date(item.savedAt).toLocaleDateString()}
        </p>
      </div>
      <button
        onClick={(e) => { e.stopPropagation(); onUnsave(item.contentId); }}
        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-bg-primary/70 backdrop-blur-sm flex items-center justify-center text-text-tertiary hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
        title="Remove"
      >
        <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M4 4L12 12M12 4L4 12" />
        </svg>
      </button>
    </motion.div>
  );
}

function PasswordChangeForm({
  onDone,
  changePassword,
}: {
  onDone: () => void;
  changePassword: (old: string, n: string) => Promise<{ ok: boolean; error?: string }>;
}) {
  const [oldPw, setOldPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);
    const result = await changePassword(oldPw, newPw);
    setLoading(false);
    if (result.ok) {
      setMsg("Password changed successfully");
      setTimeout(onDone, 1500);
    } else {
      setMsg(result.error || "Failed");
    }
  };

  return (
    <Card hover={false}>
      <CardContent>
        <Heading className="mb-4">Change Password</Heading>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="password"
            value={oldPw}
            onChange={(e) => setOldPw(e.target.value)}
            placeholder="Current password"
            required
            className="w-full bg-bg-tertiary border border-border rounded-[var(--radius-md)] px-4 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-border-hover"
          />
          <input
            type="password"
            value={newPw}
            onChange={(e) => setNewPw(e.target.value)}
            placeholder="New password (min 6 characters)"
            required
            minLength={6}
            className="w-full bg-bg-tertiary border border-border rounded-[var(--radius-md)] px-4 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-border-hover"
          />
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-[var(--radius-full)] bg-text-primary text-bg-primary text-sm font-medium hover:bg-text-secondary transition-colors cursor-pointer disabled:opacity-50"
            >
              {loading ? "..." : "Update Password"}
            </button>
            <button
              type="button"
              onClick={onDone}
              className="px-4 py-2 text-xs text-text-tertiary hover:text-text-secondary cursor-pointer"
            >
              Cancel
            </button>
            {msg && (
              <span className={cn("text-xs", msg.includes("success") ? "text-green-400" : "text-red-400")}>
                {msg}
              </span>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
