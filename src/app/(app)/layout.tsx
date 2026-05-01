import { BottomNav } from "@/components/BottomNav";
import { IdentifyUser } from "@/components/IdentifyUser";
import { createClient } from "@/lib/supabase/server";
import type { UserRow } from "@/types/db";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let language: string | null = null;
  if (user) {
    const { data: row } = await supabase
      .from("users")
      .select("language_to")
      .eq("id", user.id)
      .maybeSingle();
    language = (row as Pick<UserRow, "language_to"> | null)?.language_to ?? null;
  }

  return (
    <div className="flex min-h-full flex-col pb-24">
      {user ? (
        <IdentifyUser
          userId={user.id}
          email={user.email ?? null}
          language={language}
        />
      ) : null}
      <div className="mx-auto w-full max-w-lg flex-1 px-4 pt-6">{children}</div>
      <BottomNav />
    </div>
  );
}
