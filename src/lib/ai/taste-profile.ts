export interface TasteInterest {
  label: string;
  intensity: number;
  category: string;
  firstMentioned: number;
  lastMentioned: number;
  mentionCount: number;
}

export interface TasteProfileData {
  interests: TasteInterest[];
  primaryAffinity: string;
  culturalLean: string;
  eraPreference: string;
  materialSense: string;
}

const CATEGORY_MAP: Record<string, string> = {
  minimalism: "industrial_design",
  modernism: "architecture",
  "japanese craft": "ceramics",
  wabi: "antiques",
  sabi: "antiques",
  mingei: "ceramics",
  bauhaus: "graphic_design",
  swiss: "graphic_design",
  typography: "graphic_design",
  concrete: "architecture",
  book: "book_design",
  binding: "book_design",
  ceramic: "ceramics",
  pottery: "ceramics",
  furniture: "industrial_design",
  interior: "interior_design",
  brutalism: "architecture",
  midcentury: "industrial_design",
};

export function createEmptyProfile(): TasteProfileData {
  return {
    interests: [],
    primaryAffinity: "Undiscovered",
    culturalLean: "Exploring",
    eraPreference: "All eras",
    materialSense: "Evolving",
  };
}

export function updateTasteProfile(
  profile: TasteProfileData,
  interest: string,
  intensity: number = 0.5
): TasteProfileData {
  const existing = profile.interests.find(
    (i) => i.label.toLowerCase() === interest.toLowerCase()
  );

  if (existing) {
    existing.intensity = Math.min(1, existing.intensity + intensity * 0.2);
    existing.lastMentioned = Date.now();
    existing.mentionCount += 1;
  } else {
    const category = detectCategory(interest);
    profile.interests.push({
      label: interest,
      intensity: Math.min(1, intensity),
      category,
      firstMentioned: Date.now(),
      lastMentioned: Date.now(),
      mentionCount: 1,
    });
  }

  profile.interests.sort((a, b) => b.intensity - a.intensity);

  updateDerivedAttributes(profile);

  return profile;
}

function detectCategory(interest: string): string {
  const lower = interest.toLowerCase();
  for (const [keyword, category] of Object.entries(CATEGORY_MAP)) {
    if (lower.includes(keyword)) return category;
  }
  return "general";
}

function updateDerivedAttributes(profile: TasteProfileData) {
  if (profile.interests.length === 0) return;

  profile.primaryAffinity = profile.interests[0]?.label || "Undiscovered";

  const categoryCounts = new Map<string, number>();
  for (const interest of profile.interests) {
    const count = categoryCounts.get(interest.category) || 0;
    categoryCounts.set(interest.category, count + interest.intensity);
  }

  const japaneseKeywords = ["japanese", "mingei", "wabi", "sabi", "zen"];
  const europeanKeywords = ["swiss", "bauhaus", "italian", "scandinavian", "dutch"];

  let jpScore = 0;
  let euScore = 0;
  for (const interest of profile.interests) {
    const lower = interest.label.toLowerCase();
    if (japaneseKeywords.some((k) => lower.includes(k))) jpScore += interest.intensity;
    if (europeanKeywords.some((k) => lower.includes(k))) euScore += interest.intensity;
  }

  if (jpScore > euScore * 1.5) {
    profile.culturalLean = "Japanese";
  } else if (euScore > jpScore * 1.5) {
    profile.culturalLean = "European";
  } else if (jpScore > 0 && euScore > 0) {
    profile.culturalLean = "Japanese-European";
  } else {
    profile.culturalLean = "Exploring";
  }
}

export function getTopInterests(
  profile: TasteProfileData,
  count: number = 8
): TasteInterest[] {
  return profile.interests.slice(0, count);
}
