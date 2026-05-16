import { PracticeHub } from "@/components/PracticeHub";
import { getCurrentLanguageCode } from "@/lib/auth/language";
import { GuestLanguageStrip } from "@/components/GuestLanguageStrip";
import type { PracticeLanguageCode } from "@/lib/data/moments";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function PracticePage() {
  const languageCode = await getCurrentLanguageCode();
  const practiceLanguage: PracticeLanguageCode =
    languageCode === "hi" || languageCode === "te" ? languageCode : "kn";
  return (
    <>
      <GuestLanguageStrip />
      <PracticeHub
        learningLanguageCode={languageCode}
        practiceLanguageCode={practiceLanguage}
      />
    </>
  );
}
