"use client";

import { submitFeedback } from "@/app/actions/feedback";
import { useState, useTransition } from "react";

export default function FeedbackPage() {
  const [rating, setRating] = useState<number>(5);
  const [message, setMessage] = useState("");
  const [contact, setContact] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSent(false);

    startTransition(async () => {
      const result = await submitFeedback({ rating, message, contact });
      if (!result.ok) {
        setError(result.error ?? "Could not save feedback.");
        return;
      }
      setSent(true);
      setMessage("");
      setContact("");
      setRating(5);
    });
  }

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wide text-[#666666]">
          Feedback
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-black">
          Tell us how VANI feels
        </h1>
        <p className="mt-1 text-sm text-[#888888]">
          This helps us improve quickly before launch.
        </p>
      </header>

      <form
        onSubmit={onSubmit}
        className="rounded-2xl border border-black bg-white p-5 shadow-[0_6px_18px_rgba(0,0,0,0.06)]"
      >
        <label className="block">
          <span className="text-xs uppercase tracking-wide text-[#999999]">
            Rating
          </span>
          <div className="mt-2 flex gap-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setRating(n)}
                className={`h-9 w-9 rounded-lg border border-black text-sm font-semibold transition-colors ${
                  rating === n ? "bg-black text-white" : "bg-[#F5F5F5] text-black"
                }`}
                aria-label={`Rate ${n}`}
              >
                {n}
              </button>
            ))}
          </div>
        </label>

        <label className="mt-4 block">
          <span className="text-xs uppercase tracking-wide text-[#999999]">
            What should we improve?
          </span>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your feedback..."
            rows={5}
            maxLength={1200}
            className="mt-2 w-full rounded-xl border border-black bg-white px-3 py-2 text-sm text-black outline-none placeholder:text-[#999999]"
          />
        </label>

        <label className="mt-4 block">
          <span className="text-xs uppercase tracking-wide text-[#999999]">
            Contact (optional)
          </span>
          <input
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="Phone or email"
            maxLength={200}
            className="mt-2 w-full rounded-xl border border-black bg-white px-3 py-2 text-sm text-black outline-none placeholder:text-[#999999]"
          />
        </label>

        <button
          type="submit"
          disabled={isPending}
          className="mt-5 rounded-xl border border-black bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#333333]"
        >
          {isPending ? "Sending..." : "Send feedback"}
        </button>
      </form>

      {error ? (
        <p className="rounded-xl border border-black bg-[#FFECEC] px-4 py-3 text-sm text-black">
          {error}
        </p>
      ) : null}

      {sent ? (
        <p className="rounded-xl border border-black bg-[#F5F5F5] px-4 py-3 text-sm text-black">
          Thanks! Your feedback is saved to Supabase.
        </p>
      ) : null}
    </div>
  );
}
