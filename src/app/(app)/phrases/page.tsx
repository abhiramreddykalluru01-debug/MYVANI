import {
  listCategoriesByType,
  listFavoritePhraseIds,
  listPhrasesByType,
} from "@/lib/data/phrases";
import { getCurrentLanguageCode } from "@/lib/auth/language";
import { createClient } from "@/lib/supabase/server";
import type { UserRow } from "@/types/db";
import { GeneralPhrasesView } from "@/components/GeneralPhrasesView";
import { ProfessionalPhrasesView } from "@/components/ProfessionalPhrasesView";

const PROFESSION_KEY_ALIASES: Record<string, string[]> = {
  "Software Engineer": [
    "Software Engineer",
    "software engineer",
    "software_engineer",
    "engineer",
  ],
  Nurse: ["Nurse", "nurse", "healthcare"],
  Doctor: ["Doctor", "doctor", "healthcare"],
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

type SearchParams = Promise<{ type?: string }>;

export default async function PhrasesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const kind: "general" | "professional" =
    sp.type === "profession" || sp.type === "professional"
      ? "professional"
      : "general";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const languageCode = await getCurrentLanguageCode();

  let profession: string | null = null;
  if (user) {
    const { data: row } = await supabase
      .from("users")
      .select("profession")
      .eq("id", user.id)
      .maybeSingle();
    profession = (row as Pick<UserRow, "profession"> | null)?.profession ?? null;
  }

  if (kind === "general") {
    const [categories, phrases, favIds] = await Promise.all([
      listCategoriesByType("general"),
      listPhrasesByType("general", { languageCode }),
      user ? listFavoritePhraseIds(user.id) : Promise.resolve(new Set<string>()),
    ]);

    return (
      <GeneralPhrasesView
        categories={categories.map((c) => ({
          id: c.id,
          slug: c.slug,
          title: c.title,
        }))}
        phrases={phrases.map((p) => ({
          id: p.id,
          english_text: p.english_text,
          phonetic_text: p.phonetic_text,
          category_slug: p.category.slug,
          has_audio: Boolean(p.audio_url),
        }))}
        favoritedIds={[...favIds]}
      />
    );
  }

  const professionalPhrases = async () => {
    if (!profession) return [] as Awaited<ReturnType<typeof listPhrasesByType>>;
    const aliases = PROFESSION_KEY_ALIASES[profession] ?? [profession];
    for (const professionKey of aliases) {
      const rows = await listPhrasesByType("professional", {
        professionKey,
        languageCode,
      });
      if (rows.length > 0) return rows;
    }
    // Final fallback: show all professional phrases instead of blank screen.
    return listPhrasesByType("professional", { languageCode });
  };

  const [phrases, favIds] = await Promise.all([
    professionalPhrases(),
    user ? listFavoritePhraseIds(user.id) : Promise.resolve(new Set<string>()),
  ]);

  return (
    <ProfessionalPhrasesView
      phrases={phrases.map((p) => ({
        id: p.id,
        english_text: p.english_text,
        phonetic_text: p.phonetic_text,
        has_audio: Boolean(p.audio_url),
      }))}
      hasProfession={Boolean(profession)}
      profession={profession ?? null}
      favoritedIds={[...favIds]}
    />
  );
}
