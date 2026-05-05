import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service | VANI",
  description: "Terms of Service for VANI language assistance app.",
};

const LAST_UPDATED = "May 5, 2026";

export default function TermsPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-5 py-10 text-sm leading-6 text-black">
      <h1 className="text-3xl font-semibold tracking-tight">Terms of Service</h1>
      <p className="mt-2 text-xs text-[#666666]">Last updated: {LAST_UPDATED}</p>

      <section className="mt-8 space-y-3">
        <h2 className="text-lg font-semibold">1. Acceptance of terms</h2>
        <p>
          By accessing or using VANI, you agree to these Terms. If you do not agree, please do not
          use the service.
        </p>
      </section>

      <section className="mt-6 space-y-3">
        <h2 className="text-lg font-semibold">2. Service description</h2>
        <p>
          VANI provides language assistance features, including phrase discovery, quick-help
          suggestions, translation-style phrase support, and text-to-speech playback.
        </p>
      </section>

      <section className="mt-6 space-y-3">
        <h2 className="text-lg font-semibold">3. Account and access</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>You may sign in using supported authentication providers, including Google.</li>
          <li>You are responsible for activity on your account.</li>
          <li>Provide accurate profile information where requested.</li>
        </ul>
      </section>

      <section className="mt-6 space-y-3">
        <h2 className="text-lg font-semibold">4. Acceptable use</h2>
        <p>You agree not to misuse the service. This includes not attempting to:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Disrupt, overload, or damage VANI infrastructure.</li>
          <li>Bypass security, rate limits, or access controls.</li>
          <li>Use the service for unlawful, abusive, or fraudulent activity.</li>
        </ul>
      </section>

      <section className="mt-6 space-y-3">
        <h2 className="text-lg font-semibold">5. Intellectual property</h2>
        <p>
          The VANI service, branding, interface, and related content are protected by applicable
          intellectual property laws. You may not copy or resell the service except as permitted by
          law.
        </p>
      </section>

      <section className="mt-6 space-y-3">
        <h2 className="text-lg font-semibold">6. Disclaimers</h2>
        <p>
          VANI is provided on an &quot;as is&quot; and &quot;as available&quot; basis. Phrase or
          speech output may not always be complete, correct, or suitable for every context,
          including emergency situations.
        </p>
      </section>

      <section className="mt-6 space-y-3">
        <h2 className="text-lg font-semibold">7. Limitation of liability</h2>
        <p>
          To the fullest extent permitted by law, VANI and its operators are not liable for
          indirect, incidental, special, consequential, or punitive damages arising from use of the
          service.
        </p>
      </section>

      <section className="mt-6 space-y-3">
        <h2 className="text-lg font-semibold">8. Changes and termination</h2>
        <p>
          We may modify or discontinue parts of the service at any time. We may suspend access for
          misuse, legal reasons, or operational risk.
        </p>
      </section>

      <section className="mt-6 space-y-3">
        <h2 className="text-lg font-semibold">9. Changes to these terms</h2>
        <p>
          We may update these Terms from time to time. Continued use after changes means you accept
          the updated Terms.
        </p>
      </section>

      <section className="mt-6 space-y-3">
        <h2 className="text-lg font-semibold">10. Contact</h2>
        <p>
          Questions about these Terms can be sent to:{" "}
          <a className="underline" href="mailto:hello@myvani.co.in">
            hello@myvani.co.in
          </a>
        </p>
      </section>

      <p className="mt-10 text-xs text-[#666666]">
        Also see our <Link className="underline" href="/privacy">Privacy Policy</Link>.
      </p>
    </main>
  );
}
