import { createClient } from "@/lib/supabase/server";
import { getCurrentLanguageCode } from "@/lib/auth/language";
import { GuestLanguagePicker } from "@/components/GuestLanguagePicker";

/**
 * Server component that renders the guest language picker, but only when
 * no Supabase user is present. Returns null for signed-in users so pages
 * can drop this in without conditional wrappers.
 */
export async function GuestLanguageStrip() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) return null;

  const languageCode = await getCurrentLanguageCode();
  return (
    <div className="-mt-2">
      <GuestLanguagePicker currentCode={languageCode} />
    </div>
  );
}
