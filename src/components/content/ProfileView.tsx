"use client";

import { motion } from "framer-motion";
import { DisplayText, Heading, Body, Caption, Label } from "@/components/ui/Typography";
import { Card, CardContent } from "@/components/ui/Card";
import { BookmarkImport } from "@/components/content/BookmarkImport";
import { useAppStore } from "@/lib/store";
import { usePlatform } from "@/lib/platform/hooks";

const SAMPLE_INTERESTS = [
  { label: "Minimalism", strength: 0.9 },
  { label: "Japanese Craft", strength: 0.85 },
  { label: "Concrete Architecture", strength: 0.75 },
  { label: "Swiss Typography", strength: 0.7 },
  { label: "Ceramic Arts", strength: 0.6 },
  { label: "Book Design", strength: 0.5 },
  { label: "Mid-Century Modern", strength: 0.45 },
  { label: "Industrial Design", strength: 0.4 },
];

export function ProfileView() {
  const { conversationHistory } = useAppStore();
  const { isPhone } = usePlatform();

  return (
    <div className={`min-h-screen ${isPhone ? "pt-6" : "pt-20"} pb-12 px-4 md:px-8 lg:px-12`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-3xl mx-auto"
      >
        <div className="mb-12">
          <DisplayText className="mb-4">Your Taste</DisplayText>
          <Body className="max-w-lg">
            A reflection of your aesthetic sensibility, shaped through
            conversation and exploration.
          </Body>
        </div>

        <div className="mb-12">
          <Heading className="mb-6">Aesthetic Profile</Heading>
          <div className="space-y-4">
            {SAMPLE_INTERESTS.map((interest, i) => (
              <motion.div
                key={interest.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: i * 0.08,
                  duration: 0.5,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm text-text-primary">
                    {interest.label}
                  </span>
                  <Caption>{Math.round(interest.strength * 100)}%</Caption>
                </div>
                <div className="h-1.5 bg-bg-tertiary rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${interest.strength * 100}%` }}
                    transition={{
                      delay: i * 0.08 + 0.3,
                      duration: 0.8,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="h-full rounded-full"
                    style={{
                      background: `linear-gradient(90deg, var(--accent-muted), var(--accent))`,
                      opacity: 0.4 + interest.strength * 0.6,
                    }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mb-12">
          <Heading className="mb-6">Conversation History</Heading>
          {conversationHistory.length === 0 ? (
            <Card hover={false}>
              <CardContent className="py-12 text-center">
                <p className="text-text-tertiary text-sm">
                  Start a conversation to build your aesthetic profile.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {conversationHistory.slice(-20).map((msg, i) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <Card hover={false}>
                    <CardContent>
                      <div className="flex items-center gap-2 mb-1">
                        <Label>{msg.role}</Label>
                        <Caption>
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </Caption>
                      </div>
                      <p className="text-sm text-text-secondary">
                        {msg.content}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        <div className="mb-12">
          <Heading className="mb-6">Import Sources</Heading>
          <Body className="mb-4">
            Feed your browser bookmarks to discover design content you&apos;ve already collected.
          </Body>
          <BookmarkImport />
        </div>

        <div>
          <Heading className="mb-6">Your Aesthetic DNA</Heading>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { label: "Conversations", value: conversationHistory.length.toString() },
              { label: "Interests Mapped", value: SAMPLE_INTERESTS.length.toString() },
              { label: "Primary Affinity", value: "Minimalism" },
              { label: "Cultural Lean", value: "Japanese-European" },
              { label: "Era Preference", value: "Mid-20th Century" },
              { label: "Material Sense", value: "Concrete & Ceramic" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.08 }}
              >
                <Card hover={false}>
                  <CardContent>
                    <Caption>{stat.label}</Caption>
                    <p className="text-xl font-serif text-text-primary mt-1">
                      {stat.value}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
