import { QuickHelpView } from "@/components/QuickHelpView";
import {
  listCategoriesByType,
  listFavoritePhraseIds,
  listPhrasesByType,
} from "@/lib/data/phrases";
import { getCurrentLanguageCode } from "@/lib/auth/language";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function QuickHelpPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const languageCode = await getCurrentLanguageCode();

  const [categories, phrases, favIds] = await Promise.all([
    listCategoriesByType("quick_help"),
    listPhrasesByType("quick_help", { languageCode }),
    user ? listFavoritePhraseIds(user.id) : Promise.resolve(new Set<string>()),
  ]);

  return (
    <QuickHelpView
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
