export type StaticReply = {
  english: string;
  phonetic: string;
  native: string;
};

export type StaticUserTurn = {
  speaker: "user";
  english: string;
  phonetic: string;
  native: string;
};

export type StaticOtherTurn = {
  speaker: "other";
  replies: StaticReply[];
};

export type StaticTurn = StaticUserTurn | StaticOtherTurn;

export type StaticSituationPhase = {
  phase: number;
  title: string;
  other_label: string;
  other_emoji: string;
  turns: StaticTurn[];
};

export type StaticSituationScript = {
  id: string;
  title: string;
  contextEnglish: string;
  other_label: string;
  other_emoji: string;
  end_note: string;
  turns: StaticTurn[];
  phases?: StaticSituationPhase[];
};
