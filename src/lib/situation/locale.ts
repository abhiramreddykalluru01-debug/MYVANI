import type { LanguageCode } from "@/types/db";
import type {
  StaticReply,
  StaticSituationPhase,
  StaticSituationScript,
  StaticTurn,
  StaticUserTurn,
} from "@/lib/situation/types";

export type SituationLineKey = string;

export type SituationLocalizedLine = {
  phonetic: string;
  native: string;
};

/** Stable key for a user line or one reply inside a script. */
export function situationLineKey(
  scriptId: string,
  opts: {
    phase?: number;
    turn: number;
    speaker: "user" | "other";
    reply?: number;
    english: string;
  },
): SituationLineKey {
  const phasePart = opts.phase != null ? `p${opts.phase}` : "flat";
  const replyPart =
    opts.speaker === "other" && opts.reply != null ? `:r${opts.reply}` : "";
  return `${scriptId}|${phasePart}|t${opts.turn}|${opts.speaker}${replyPart}|${opts.english}`;
}

/** Walk every speakable line (for building Hindi overlays). */
export function forEachSituationLine(
  script: StaticSituationScript,
  visit: (key: SituationLineKey) => void,
): void {
  const walkTurns = (turns: StaticTurn[], phase?: number) => {
    turns.forEach((turn, turnIdx) => {
      if (turn.speaker === "user") {
        visit(
          situationLineKey(script.id, {
            phase,
            turn: turnIdx,
            speaker: "user",
            english: turn.english,
          }),
        );
        return;
      }
      turn.replies.forEach((reply, replyIdx) => {
        visit(
          situationLineKey(script.id, {
            phase,
            turn: turnIdx,
            speaker: "other",
            reply: replyIdx,
            english: reply.english,
          }),
        );
      });
    });
  };

  if (script.phases?.length) {
    for (const phase of script.phases) {
      walkTurns(phase.turns, phase.phase);
    }
  } else {
    walkTurns(script.turns);
  }
}

export function localizeSituationScript(
  script: StaticSituationScript,
  lang: LanguageCode,
  hiByKey: Readonly<Record<SituationLineKey, SituationLocalizedLine>>,
): StaticSituationScript {
  if (lang !== "hi") return script;

  const applyLine = (
    key: SituationLineKey,
    line: SituationLocalizedLine,
  ): SituationLocalizedLine => hiByKey[key] ?? line;

  const mapUser = (
    scriptId: string,
    phase: number | undefined,
    turnIdx: number,
    turn: StaticUserTurn,
  ): StaticUserTurn => {
    const key = situationLineKey(scriptId, {
      phase,
      turn: turnIdx,
      speaker: "user",
      english: turn.english,
    });
    const hi = applyLine(key, {
      phonetic: turn.phonetic,
      native: turn.native,
    });
    return { ...turn, phonetic: hi.phonetic, native: hi.native };
  };

  const mapReply = (
    scriptId: string,
    phase: number | undefined,
    turnIdx: number,
    replyIdx: number,
    reply: StaticReply,
  ): StaticReply => {
    const key = situationLineKey(scriptId, {
      phase,
      turn: turnIdx,
      speaker: "other",
      reply: replyIdx,
      english: reply.english,
    });
    const hi = applyLine(key, {
      phonetic: reply.phonetic,
      native: reply.native,
    });
    return { ...reply, phonetic: hi.phonetic, native: hi.native };
  };

  const mapTurns = (
    scriptId: string,
    phase: number | undefined,
    turns: StaticTurn[],
  ): StaticTurn[] =>
    turns.map((turn, turnIdx) => {
      if (turn.speaker === "user") {
        return mapUser(scriptId, phase, turnIdx, turn);
      }
      return {
        ...turn,
        replies: turn.replies.map((reply, replyIdx) =>
          mapReply(scriptId, phase, turnIdx, replyIdx, reply),
        ),
      };
    });

  const mapPhase = (
    scriptId: string,
    phase: StaticSituationPhase,
  ): StaticSituationPhase => ({
    ...phase,
    turns: mapTurns(scriptId, phase.phase, phase.turns),
  });

  return {
    ...script,
    turns: mapTurns(script.id, undefined, script.turns),
    phases: script.phases?.map((phase) => mapPhase(script.id, phase)),
  };
}
