/**
 * "Moments" power VANI's Practice mode — short real-life situations
 * where the user picks the right phrase under time pressure, hears a
 * simulated reply, then picks the right follow-up.
 *
 * Curated for Kannada first; can grow into a per-language dataset later.
 */

export type MomentOption = {
  english: string;
  phonetic: string;
  isCorrect?: boolean;
};

export type Moment = {
  id: string;
  emoji: string;
  title: string;
  context: string;
  /** What the other person says first (optional — sometimes user initiates). */
  incoming?: { english: string; phonetic: string };
  /** What we ask the user to say. */
  prompt: string;
  options: [MomentOption, MomentOption, MomentOption];
  /** What the other person says after the user's correct phrase. */
  reply: { english: string; phonetic: string };
  /** What we ask the user to say next. */
  followupPrompt: string;
  followupOptions: [MomentOption, MomentOption, MomentOption];
  /** Hint shown when user taps Freeze. */
  freezeHint: string;
};

export type PracticeLanguageCode = "kn" | "hi" | "te";

const MOMENTS_KN: Moment[] = [
  {
    id: "chai-stall",
    emoji: "☕",
    title: "At a chai stall",
    context: "You walk up to a tea stall in Bangalore. The owner looks at you.",
    incoming: { english: "What do you want?", phonetic: "Enu beku?" },
    prompt: "Order one tea.",
    options: [
      { english: "I want one tea", phonetic: "Nange ondu chai beku", isCorrect: true },
      { english: "Where is the hospital?", phonetic: "Aspatre elli ide?" },
      { english: "I'm leaving", phonetic: "Naanu hogtini" },
    ],
    reply: { english: "Okay, here you go", phonetic: "Sari, kotini" },
    followupPrompt: "Ask how much it costs.",
    followupOptions: [
      { english: "How much?", phonetic: "Bele estu?", isCorrect: true },
      { english: "I don't want it", phonetic: "Nange beda" },
      { english: "Okay", phonetic: "Sari" },
    ],
    freezeHint: "Use 'beku' (want) for things you need: 'Nange ___ beku'.",
  },
  {
    id: "lost-in-city",
    emoji: "🗺️",
    title: "Lost in the city",
    context:
      "You're lost on a busy street. Stop a passerby and ask where the hospital is.",
    prompt: "Ask where the hospital is.",
    options: [
      { english: "Where is the hospital?", phonetic: "Aspatre elli ide?", isCorrect: true },
      { english: "I need water", phonetic: "Nange neeru beku" },
      { english: "This is good", phonetic: "Idu chennagide" },
    ],
    reply: { english: "Go straight ahead", phonetic: "Mundakke hogi" },
    followupPrompt: "Thank them politely.",
    followupOptions: [
      { english: "Thank you", phonetic: "Dhanyavaadagalu", isCorrect: true },
      { english: "I'm not going", phonetic: "Naanu hogalla" },
      { english: "How much?", phonetic: "Bele estu?" },
    ],
    freezeHint: "'elli ide' means 'where is'. Just put the place before it.",
  },
  {
    id: "at-the-shop",
    emoji: "🛍️",
    title: "Buying something",
    context: "You see a shirt you like at a clothes shop. Ask the price.",
    prompt: "Ask how much this costs.",
    options: [
      { english: "How much is this?", phonetic: "Idu bele estu?", isCorrect: true },
      { english: "I don't want it", phonetic: "Nange beda" },
      { english: "This is good", phonetic: "Idu chennagide" },
    ],
    reply: { english: "Five hundred rupees", phonetic: "Aidu nooru rupayi" },
    followupPrompt: "Tell them it's too expensive.",
    followupOptions: [
      { english: "It's very expensive", phonetic: "Tumba expensive aagide", isCorrect: true },
      { english: "Okay, I'll take it", phonetic: "Sari, kotini" },
      { english: "Where is the hospital?", phonetic: "Aspatre elli ide?" },
    ],
    freezeHint: "'bele' = price. 'estu' = how much. Easy combo: 'bele estu'.",
  },
  {
    id: "need-help",
    emoji: "🚨",
    title: "You need urgent help",
    context: "You're not feeling well. Stop someone and ask for help.",
    prompt: "Ask for help.",
    options: [
      { english: "I need help", phonetic: "Nange sahaaya beku", isCorrect: true },
      { english: "This is good", phonetic: "Idu chennagide" },
      { english: "How much?", phonetic: "Bele estu?" },
    ],
    reply: { english: "What happened? Are you okay?", phonetic: "Yenaayitu? Neevu sariyaagiddira?" },
    followupPrompt: "Tell them you need a doctor.",
    followupOptions: [
      { english: "I need a doctor", phonetic: "Nange doctor beku", isCorrect: true },
      { english: "I'm leaving", phonetic: "Naanu hogtini" },
      { english: "Okay, here you go", phonetic: "Sari, kotini" },
    ],
    freezeHint: "'sahaaya beku' literally means 'help wanted'. Stay calm and clear.",
  },
  {
    id: "bus-stop",
    emoji: "🚌",
    title: "Catching a bus",
    context: "A bus pulls up. Ask the conductor if it goes to Majestic.",
    incoming: { english: "Where do you want to go?", phonetic: "Yelli hogabeku?" },
    prompt: "Ask if this bus goes to Majestic.",
    options: [
      { english: "Does this go to Majestic?", phonetic: "Idu Majestic-ge hogutta?", isCorrect: true },
      { english: "Where is the hospital?", phonetic: "Aspatre elli ide?" },
      { english: "It's very expensive", phonetic: "Tumba expensive aagide" },
    ],
    reply: { english: "Yes, it goes there", phonetic: "Houdhu, hogutte" },
    followupPrompt: "Ask for one ticket.",
    followupOptions: [
      { english: "I want one ticket", phonetic: "Nange ondu ticket beku", isCorrect: true },
      { english: "I'm not going", phonetic: "Naanu hogalla" },
      { english: "This is good", phonetic: "Idu chennagide" },
    ],
    freezeHint: "Add '-ge' to a place name to mean 'to that place': 'Majestic-ge'.",
  },
];

const MOMENT_PHONETIC_MAP: Record<
  Exclude<PracticeLanguageCode, "kn">,
  Record<string, string>
> = {
  hi: {
    "What do you want?": "Aapko kya chahiye?",
    "I want one tea": "Mujhe ek chai chahiye",
    "Where is the hospital?": "Aspataal kahan hai?",
    "I'm leaving": "Main ja raha hoon",
    "Okay, here you go": "Theek hai, lijiye",
    "How much?": "Kitna hai?",
    "I don't want it": "Mujhe nahi chahiye",
    "Okay": "Theek hai",
    "Go straight ahead": "Seedha jaiye",
    "Thank you": "Dhanyavaad",
    "How much is this?": "Yeh kitne ka hai?",
    "This is good": "Yeh achha hai",
    "Five hundred rupees": "Paanch sau rupaye",
    "It's very expensive": "Bahut mehenga hai",
    "I need help": "Mujhe madad chahiye",
    "What happened? Are you okay?": "Kya hua? Aap theek hain?",
    "I need a doctor": "Mujhe doctor chahiye",
    "Where do you want to go?": "Aapko kahan jaana hai?",
    "Does this go to Majestic?": "Kya yeh Majestic jaati hai?",
    "Yes, it goes there": "Haan, yeh wahan jaati hai",
    "I want one ticket": "Mujhe ek ticket chahiye",
  },
  te: {
    "What do you want?": "Meeku em kaavali?",
    "I want one tea": "Naaku oka chai kaavali",
    "Where is the hospital?": "Aasupatri ekkada undi?",
    "I'm leaving": "Nenu veltunnaanu",
    "Okay, here you go": "Sare, idigo",
    "How much?": "Entha?",
    "I don't want it": "Naaku vaddu",
    "Okay": "Sare",
    "Go straight ahead": "Munduku vellandi",
    "Thank you": "Dhanyavaadalu",
    "How much is this?": "Idi entha?",
    "This is good": "Idi baagundi",
    "Five hundred rupees": "Aidu vandala rupayalu",
    "It's very expensive": "Chaala ekkuva undi",
    "I need help": "Naaku sahaayam kaavali",
    "What happened? Are you okay?": "Em jarigindi? Meeku baagundaa?",
    "I need a doctor": "Naaku doctor kaavali",
    "Where do you want to go?": "Meeku ekkadiki vellaali?",
    "Does this go to Majestic?": "Idi Majestic ki velthundaa?",
    "Yes, it goes there": "Avunu, akkada velthundi",
    "I want one ticket": "Naaku oka ticket kaavali",
  },
};

function localizePhonetic(
  english: string,
  fallback: string,
  languageCode: Exclude<PracticeLanguageCode, "kn">,
) {
  return MOMENT_PHONETIC_MAP[languageCode][english] ?? fallback;
}

export function getMoments(languageCode: PracticeLanguageCode): Moment[] {
  if (languageCode === "kn") return MOMENTS_KN;
  return MOMENTS_KN.map((moment) => ({
    ...moment,
    incoming: moment.incoming
      ? {
          ...moment.incoming,
          phonetic: localizePhonetic(
            moment.incoming.english,
            moment.incoming.phonetic,
            languageCode,
          ),
        }
      : undefined,
    options: moment.options.map((opt) => ({
      ...opt,
      phonetic: localizePhonetic(opt.english, opt.phonetic, languageCode),
    })) as Moment["options"],
    reply: {
      ...moment.reply,
      phonetic: localizePhonetic(
        moment.reply.english,
        moment.reply.phonetic,
        languageCode,
      ),
    },
    followupOptions: moment.followupOptions.map((opt) => ({
      ...opt,
      phonetic: localizePhonetic(opt.english, opt.phonetic, languageCode),
    })) as Moment["followupOptions"],
  }));
}

export const MOMENTS: Moment[] = MOMENTS_KN;
