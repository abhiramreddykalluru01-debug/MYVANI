import type { StaticSituationScript } from "@/lib/situation/static-scripts";

function TurnList({
  scriptId,
  turns,
  otherLabel,
  otherEmoji,
  keyPrefix,
}: {
  scriptId: string;
  turns: StaticSituationScript["turns"];
  otherLabel: string;
  otherEmoji: string;
  keyPrefix: string;
}) {
  return (
    <div className="flex flex-col gap-3">
      {turns.map((turn, idx) =>
        turn.speaker === "user" ? (
          <div
            key={`${scriptId}-${keyPrefix}-u-${idx}`}
            className="ml-4 rounded-2xl border border-black bg-white p-4 shadow-[0_4px_14px_rgba(0,0,0,0.06)]"
          >
            <div className="mb-2 flex items-center gap-1.5">
              <span className="text-base leading-none" aria-hidden>
                🧑
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wide text-[#888888]">
                You say
              </span>
            </div>
            <p className="text-[10px] text-[#999999]">{turn.english}</p>
            <p className="mt-1 text-2xl font-semibold leading-tight tracking-tight text-black break-words">
              {turn.phonetic}
            </p>
            <p className="mt-1 text-sm text-[#555555] break-words">{turn.native}</p>
          </div>
        ) : (
          <div
            key={`${scriptId}-${keyPrefix}-o-${idx}`}
            className="mr-4 rounded-2xl border border-[#DDDDDD] bg-[#F5F5F5] p-4"
          >
            <div className="mb-3 flex items-center gap-1.5">
              <span className="text-base leading-none" aria-hidden>
                {otherEmoji}
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wide text-[#888888]">
                {otherLabel} may say
              </span>
            </div>
            <div className="flex flex-col gap-2.5">
              {turn.replies.map((reply, rIdx) => (
                <div
                  key={rIdx}
                  className="rounded-xl border border-[#E0E0E0] bg-white px-3 py-2.5"
                >
                  <p className="text-sm font-semibold text-black break-words">
                    {reply.phonetic}
                  </p>
                  <p className="mt-0.5 text-xs text-[#666666] break-words">
                    {reply.native}
                  </p>
                  <p className="mt-0.5 text-[10px] text-[#AAAAAA]">{reply.english}</p>
                </div>
              ))}
            </div>
          </div>
        ),
      )}
    </div>
  );
}

export function SituationConversation({ script }: { script: StaticSituationScript }) {
  const hasPhases = Boolean(script.phases?.length);

  return (
    <div className="flex flex-col gap-3">
      <div className="border-b border-black pb-3">
        <h2 className="text-lg font-semibold text-black">{script.title}</h2>
        <p className="mt-1 text-sm text-[#666666]">{script.contextEnglish}</p>
      </div>

      {hasPhases ? (
        <div className="flex flex-col gap-6">
          {script.phases!.map((phase) => (
            <div key={phase.phase} className="flex flex-col gap-3">
              <div className="flex items-center gap-3 rounded-2xl border border-black bg-black px-4 py-2.5 text-white">
                <span className="rounded-full border border-white/30 bg-white/10 px-2.5 py-0.5 text-[11px] font-bold tabular-nums">
                  Phase {phase.phase}
                </span>
                <span className="text-base leading-none" aria-hidden>
                  {phase.other_emoji}
                </span>
                <span className="text-sm font-semibold">{phase.title}</span>
              </div>
              <TurnList
                scriptId={script.id}
                turns={phase.turns}
                otherLabel={phase.other_label}
                otherEmoji={phase.other_emoji}
                keyPrefix={`p${phase.phase}`}
              />
            </div>
          ))}
        </div>
      ) : (
        <TurnList
          scriptId={script.id}
          turns={script.turns}
          otherLabel={script.other_label}
          otherEmoji={script.other_emoji}
          keyPrefix="flat"
        />
      )}

      {script.end_note ? (
        <div className="flex items-center gap-2 rounded-2xl border border-black bg-black px-4 py-3">
          <span className="text-base leading-none" aria-hidden>
            ✅
          </span>
          <p className="text-sm font-medium text-white">{script.end_note}</p>
        </div>
      ) : null}
    </div>
  );
}
