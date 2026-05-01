/**
 * VANI Pattern Lab — universal Kannada survival patterns.
 *
 * Each intent is a frame ([SLOT] + suffix) the user can fill with a noun
 * and a tense, generating dozens of natural sentences from tiny data.
 *
 *   4 intents × ~5 nouns × 3 tenses ≈ 60 ready-to-speak sentences.
 *
 * Tense labelling is pragmatic — for survival speech we pick the most
 * useful natural Kannada form for each tense, not the strict grammatical
 * conjugation. Each form has a short note explaining the meaning shift.
 */

import type { PracticeLanguageCode } from "@/lib/data/moments";

export type Tense = "past" | "present" | "future";

export type PatternNoun = {
  english: string;
  phonetic: string; // Roman phonetic (no native script for now)
};

export type PatternTemplate = {
  /** Sentence with [SLOT] placeholder. */
  template: string;
  /** English meaning with [SLOT] placeholder. */
  englishTemplate: string;
  /** Short grammar note shown subtly under the master card. */
  note: string;
};

export type PatternIntent = {
  id: "get" | "find" | "cost" | "help";
  label: string;
  emoji: string;
  /** Short tagline shown on the intent card. */
  tagline: string;
  /** Slot label like "Object", "Place", "Item", "Action". */
  slotLabel: string;
  templates: Record<Tense, PatternTemplate>;
  nouns: PatternNoun[];
};

const PATTERN_INTENTS_KN: PatternIntent[] = [
  {
    id: "get",
    label: "GET",
    emoji: "🤲",
    tagline: "Ask for what you need",
    slotLabel: "Object",
    templates: {
      past: {
        template: "Nange [SLOT] bekittu",
        englishTemplate: "I needed [SLOT]",
        note: "'bekittu' = needed (past)",
      },
      present: {
        template: "Nange [SLOT] beku",
        englishTemplate: "I want [SLOT]",
        note: "'beku' = want / need (now)",
      },
      future: {
        template: "Nange [SLOT] bekagutte",
        englishTemplate: "I will need [SLOT]",
        note: "'bekagutte' = will need (later)",
      },
    },
    nouns: [
      { english: "Water", phonetic: "neeru" },
      { english: "Food", phonetic: "oota" },
      { english: "Medicine", phonetic: "maatre" },
      { english: "Room", phonetic: "room" },
      { english: "Tea", phonetic: "chai" },
    ],
  },
  {
    id: "find",
    label: "FIND",
    emoji: "🗺️",
    tagline: "Find your way around",
    slotLabel: "Place",
    templates: {
      past: {
        template: "[SLOT] elli ittu?",
        englishTemplate: "Where was [SLOT]?",
        note: "'ittu' = was (past)",
      },
      present: {
        template: "[SLOT] elli ide?",
        englishTemplate: "Where is [SLOT]?",
        note: "'ide' = is (now)",
      },
      future: {
        template: "[SLOT] elli sigatte?",
        englishTemplate: "Where can I find [SLOT]?",
        note: "'sigatte' = will be available",
      },
    },
    nouns: [
      { english: "Hospital", phonetic: "Aspatre" },
      { english: "Pharmacy", phonetic: "Medical" },
      { english: "Bus stand", phonetic: "Bus stand" },
      { english: "My PG", phonetic: "Naa irodu PG" },
      { english: "Toilet", phonetic: "Toilet" },
    ],
  },
  {
    id: "cost",
    label: "COST",
    emoji: "💰",
    tagline: "Ask the price",
    slotLabel: "Item",
    templates: {
      past: {
        template: "[SLOT] eshtu ittu?",
        englishTemplate: "How much was [SLOT]?",
        note: "'ittu' = was (past)",
      },
      present: {
        template: "[SLOT] eshtu?",
        englishTemplate: "How much is [SLOT]?",
        note: "'eshtu' = how much",
      },
      future: {
        template: "[SLOT] eshtu aagutte?",
        englishTemplate: "How much will [SLOT] cost?",
        note: "'aagutte' = will cost",
      },
    },
    nouns: [
      { english: "Auto", phonetic: "Auto" },
      { english: "Ticket", phonetic: "Ticket" },
      { english: "Rent", phonetic: "Bade" },
      { english: "Tea", phonetic: "Chai" },
      { english: "Room", phonetic: "Room" },
    ],
  },
  {
    id: "help",
    label: "HELP",
    emoji: "🆘",
    tagline: "Get help in any situation",
    slotLabel: "Action",
    templates: {
      past: {
        template: "[SLOT] maadidri",
        englishTemplate: "You did [SLOT]",
        note: "'maadidri' = did (past)",
      },
      present: {
        template: "[SLOT] maadi",
        englishTemplate: "Please do [SLOT]",
        note: "'maadi' = please do (request)",
      },
      future: {
        template: "[SLOT] maadtira?",
        englishTemplate: "Will you do [SLOT]?",
        note: "'maadtira' = will you do",
      },
    },
    nouns: [
      { english: "Help", phonetic: "Sahaaya" },
      { english: "Call", phonetic: "Call" },
      { english: "Guide", phonetic: "Daari toridi" },
      { english: "Tell", phonetic: "Heli" },
      { english: "Wait", phonetic: "Kaayuthiri" },
    ],
  },
];

const PATTERN_TEMPLATE_BY_LANGUAGE: Record<
  Exclude<PracticeLanguageCode, "kn">,
  Record<PatternIntent["id"], Record<Tense, PatternTemplate>>
> = {
  hi: {
    get: {
      past: {
        template: "Mujhe [SLOT] chahiye tha",
        englishTemplate: "I needed [SLOT]",
        note: "'chahiye tha' = needed (past)",
      },
      present: {
        template: "Mujhe [SLOT] chahiye",
        englishTemplate: "I want [SLOT]",
        note: "'chahiye' = want / need (now)",
      },
      future: {
        template: "Mujhe [SLOT] chahiye hoga",
        englishTemplate: "I will need [SLOT]",
        note: "'chahiye hoga' = will need (later)",
      },
    },
    find: {
      past: {
        template: "[SLOT] kahan tha?",
        englishTemplate: "Where was [SLOT]?",
        note: "'tha' = was (past)",
      },
      present: {
        template: "[SLOT] kahan hai?",
        englishTemplate: "Where is [SLOT]?",
        note: "'hai' = is (now)",
      },
      future: {
        template: "[SLOT] kahan milega?",
        englishTemplate: "Where can I find [SLOT]?",
        note: "'milega' = can be found",
      },
    },
    cost: {
      past: {
        template: "[SLOT] kitna tha?",
        englishTemplate: "How much was [SLOT]?",
        note: "'kitna tha' = was (past)",
      },
      present: {
        template: "[SLOT] kitna hai?",
        englishTemplate: "How much is [SLOT]?",
        note: "'kitna hai' = how much",
      },
      future: {
        template: "[SLOT] kitne ka padega?",
        englishTemplate: "How much will [SLOT] cost?",
        note: "'padega' = will cost",
      },
    },
    help: {
      past: {
        template: "[SLOT] kiya",
        englishTemplate: "You did [SLOT]",
        note: "'kiya' = did (past)",
      },
      present: {
        template: "[SLOT] kijiye",
        englishTemplate: "Please do [SLOT]",
        note: "'kijiye' = please do",
      },
      future: {
        template: "[SLOT] karenge?",
        englishTemplate: "Will you do [SLOT]?",
        note: "'karenge' = will you do",
      },
    },
  },
  te: {
    get: {
      past: {
        template: "Naaku [SLOT] kaavali ani undedi",
        englishTemplate: "I needed [SLOT]",
        note: "'kaavali ani undedi' = needed (past)",
      },
      present: {
        template: "Naaku [SLOT] kaavali",
        englishTemplate: "I want [SLOT]",
        note: "'kaavali' = want / need (now)",
      },
      future: {
        template: "Naaku [SLOT] kaavali avutundi",
        englishTemplate: "I will need [SLOT]",
        note: "'avutundi' = will need (later)",
      },
    },
    find: {
      past: {
        template: "[SLOT] ekkada undedi?",
        englishTemplate: "Where was [SLOT]?",
        note: "'undedi' = was (past)",
      },
      present: {
        template: "[SLOT] ekkada undi?",
        englishTemplate: "Where is [SLOT]?",
        note: "'undi' = is (now)",
      },
      future: {
        template: "[SLOT] ekkada dorukutundi?",
        englishTemplate: "Where can I find [SLOT]?",
        note: "'dorukutundi' = can be found",
      },
    },
    cost: {
      past: {
        template: "[SLOT] entha undedi?",
        englishTemplate: "How much was [SLOT]?",
        note: "'entha undedi' = was (past)",
      },
      present: {
        template: "[SLOT] entha?",
        englishTemplate: "How much is [SLOT]?",
        note: "'entha' = how much",
      },
      future: {
        template: "[SLOT] entha avutundi?",
        englishTemplate: "How much will [SLOT] cost?",
        note: "'avutundi' = will cost",
      },
    },
    help: {
      past: {
        template: "[SLOT] chesaaru",
        englishTemplate: "You did [SLOT]",
        note: "'chesaaru' = did (past)",
      },
      present: {
        template: "[SLOT] cheyandi",
        englishTemplate: "Please do [SLOT]",
        note: "'cheyandi' = please do",
      },
      future: {
        template: "[SLOT] chestaaraa?",
        englishTemplate: "Will you do [SLOT]?",
        note: "'chestaaraa' = will you do",
      },
    },
  },
};

const PATTERN_NOUN_BY_LANGUAGE: Record<
  Exclude<PracticeLanguageCode, "kn">,
  Record<string, string>
> = {
  hi: {
    Water: "paani",
    Food: "khana",
    Medicine: "dawai",
    Room: "kamra",
    Tea: "chai",
    Hospital: "aspataal",
    Pharmacy: "medical",
    "Bus stand": "bus stand",
    "My PG": "mera PG",
    Toilet: "toilet",
    Auto: "auto",
    Ticket: "ticket",
    Rent: "kiraya",
    Help: "madad",
    Call: "call",
    Guide: "raasta dikhaaiye",
    Tell: "bataaiye",
    Wait: "rukiye",
  },
  te: {
    Water: "neellu",
    Food: "tindi",
    Medicine: "mandu",
    Room: "room",
    Tea: "chai",
    Hospital: "aasupatri",
    Pharmacy: "medical",
    "Bus stand": "bus stand",
    "My PG": "naa PG",
    Toilet: "toilet",
    Auto: "auto",
    Ticket: "ticket",
    Rent: "rentu",
    Help: "sahaayam",
    Call: "call",
    Guide: "daari chupinchandi",
    Tell: "cheppandi",
    Wait: "aagandi",
  },
};

export function getPatternIntents(languageCode: PracticeLanguageCode): PatternIntent[] {
  if (languageCode === "kn") return PATTERN_INTENTS_KN;
  return PATTERN_INTENTS_KN.map((intent) => ({
    ...intent,
    templates: PATTERN_TEMPLATE_BY_LANGUAGE[languageCode][intent.id],
    nouns: intent.nouns.map((noun) => ({
      ...noun,
      phonetic:
        PATTERN_NOUN_BY_LANGUAGE[languageCode][noun.english] ?? noun.phonetic,
    })),
  }));
}

export const PATTERN_INTENTS: PatternIntent[] = PATTERN_INTENTS_KN;
