import Link from "next/link";
import { STATIC_SITUATION_SCRIPTS } from "@/lib/situation/static-scripts";

export default function SituationHubPage() {
  return (
    <div className="flex flex-col gap-6 pb-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-black">
          Situation
        </h1>
        <p className="mt-1 text-sm text-[#666666]">
          Pick a scene — open the full conversation to read and practice.
        </p>
      </div>

      <ul className="flex flex-col gap-3">
        {STATIC_SITUATION_SCRIPTS.map((script) => (
          <li key={script.id}>
            <Link
              href={`/situation/${script.id}`}
              className="flex w-full items-center gap-4 rounded-2xl border border-black bg-white p-4 text-left shadow-[0_6px_18px_rgba(0,0,0,0.06)] transition-all duration-200 hover:bg-[#F5F5F5] hover:shadow-[0_10px_26px_rgba(0,0,0,0.10)] active:scale-[0.99]"
            >
              <span
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-black bg-[#FAFAFA] text-3xl leading-none"
                aria-hidden
              >
                {script.other_emoji}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-base font-semibold text-black">
                  {script.title}
                </span>
                <span className="mt-0.5 line-clamp-2 text-sm text-[#666666]">
                  {script.contextEnglish}
                </span>
              </span>
              <span className="shrink-0 text-lg text-[#999999]" aria-hidden>
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
