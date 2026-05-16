import Link from "next/link";
import { notFound } from "next/navigation";
import { getCurrentLanguageCode } from "@/lib/auth/language";
import { LANGUAGE_CODE_TO_NAME } from "@/lib/constants/languages";
import { SituationConversation } from "../_components/SituationConversation";
import { getSituationScriptById } from "@/lib/situation/static-scripts";

export const dynamic = "force-dynamic";

type Params = Promise<{ id: string }>;

export default async function SituationDetailPage({ params }: { params: Params }) {
  const { id } = await params;
  const languageCode = await getCurrentLanguageCode();
  const script = getSituationScriptById(id, languageCode);
  if (!script) notFound();

  const languageLabel = LANGUAGE_CODE_TO_NAME[languageCode] ?? languageCode;

  return (
    <div className="flex flex-col gap-6 pb-6">
      <div>
        <Link
          href="/situation"
          className="inline-flex items-center gap-1 text-sm font-medium text-[#666666] underline-offset-2 hover:text-black hover:underline"
        >
          <span aria-hidden>←</span> All situations
        </Link>
        <p className="mt-2 text-xs text-[#888888]">
          Phrases in{" "}
          <span className="font-medium text-black">{languageLabel}</span>
          {" — switch on the dashboard if needed."}
        </p>
      </div>

      <SituationConversation script={script} />
    </div>
  );
}
