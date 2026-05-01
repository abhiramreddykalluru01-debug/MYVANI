"use client";

import { createClient } from "@/lib/supabase/client";
import { resetAnalytics, track } from "@/lib/analytics/client";
import { useRouter } from "next/navigation";

export function SignOutButton() {
  const router = useRouter();

  async function signOut() {
    const supabase = createClient();
    track("auth_signout");
    await supabase.auth.signOut();
    resetAnalytics();
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={() => void signOut()}
      className="rounded-xl border border-black bg-white px-4 py-2 text-sm font-medium text-black hover:bg-[#F5F5F5]"
    >
      Sign out
    </button>
  );
}
