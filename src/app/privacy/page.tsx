import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | VANI",
  description: "Privacy Policy for VANI language assistance app.",
};

const LAST_UPDATED = "May 5, 2026";

export default function PrivacyPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-5 py-10 text-sm leading-6 text-black">
      <h1 className="text-3xl font-semibold tracking-tight">Privacy Policy</h1>
      <p className="mt-2 text-xs text-[#666666]">Last updated: {LAST_UPDATED}</p>

      <section className="mt-8 space-y-3">
        <h2 className="text-lg font-semibold">1. Who we are</h2>
        <p>
          VANI helps people communicate quickly in Indian languages using phrase cards,
          quick-help phrases, and text-to-speech features.
        </p>
      </section>

      <section className="mt-6 space-y-3">
        <h2 className="text-lg font-semibold">2. Data we collect</h2>
        <p>When you use VANI, we may collect and store:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Account data from Google sign-in (for example, your email and account id).</li>
          <li>Profile data you provide, such as name, city, profession, and language preferences.</li>
          <li>Usage data, such as phrase favorites and recently used phrases.</li>
          <li>Feedback you submit, including rating, message, and optional contact details.</li>
          <li>Analytics events (for example, page views and product interaction events).</li>
          <li>Audio generated from text you type in Type &amp; Say, stored to serve playback.</li>
        </ul>
      </section>

      <section className="mt-6 space-y-3">
        <h2 className="text-lg font-semibold">3. How we use data</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>Provide login, account management, and core app functionality.</li>
          <li>Personalize phrase and language experience based on your profile settings.</li>
          <li>Save your favorites and recents so your app experience is faster.</li>
          <li>Improve reliability, quality, and product decisions through analytics and feedback.</li>
          <li>Operate text-to-speech audio playback and caching features.</li>
        </ul>
      </section>

      <section className="mt-6 space-y-3">
        <h2 className="text-lg font-semibold">4. Services we use</h2>
        <p>
          We use third-party services to run VANI, including Supabase (authentication, database,
          and storage), Google OAuth (sign-in), and PostHog (analytics).
        </p>
      </section>

      <section className="mt-6 space-y-3">
        <h2 className="text-lg font-semibold">5. Data sharing</h2>
        <p>
          We do not sell your personal information. We share data only with service providers
          required to operate VANI or when legally required.
        </p>
      </section>

      <section className="mt-6 space-y-3">
        <h2 className="text-lg font-semibold">6. Data retention</h2>
        <p>
          We retain data as long as needed to operate the app, support your account, comply with
          legal obligations, and resolve disputes. We may delete or anonymize data that is no
          longer required.
        </p>
      </section>

      <section className="mt-6 space-y-3">
        <h2 className="text-lg font-semibold">7. Your choices</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>You can update profile information from within the app.</li>
          <li>You may stop using the app at any time.</li>
          <li>You can contact us to request account or data deletion.</li>
        </ul>
      </section>

      <section className="mt-6 space-y-3">
        <h2 className="text-lg font-semibold">8. Security</h2>
        <p>
          We use reasonable technical and organizational safeguards to protect your data. No method
          of storage or transmission is completely secure.
        </p>
      </section>

      <section className="mt-6 space-y-3">
        <h2 className="text-lg font-semibold">9. Changes to this policy</h2>
        <p>
          We may update this Privacy Policy from time to time. We will post the updated version on
          this page with a revised date.
        </p>
      </section>

      <section className="mt-6 space-y-3">
        <h2 className="text-lg font-semibold">10. Contact</h2>
        <p>
          For privacy questions or deletion requests, contact:{" "}
          <a className="underline" href="mailto:hello@myvani.co.in">
            hello@myvani.co.in
          </a>
        </p>
      </section>

      <p className="mt-10 text-xs text-[#666666]">
        Also see our <Link className="underline" href="/terms">Terms of Service</Link>.
      </p>
    </main>
  );
}
