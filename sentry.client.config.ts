// Loaded by @sentry/nextjs in the browser.
// No-ops gracefully if NEXT_PUBLIC_SENTRY_DSN is not set.
import * as Sentry from "@sentry/nextjs";

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    tracesSampleRate: 0.1,
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 1.0,
    environment: process.env.NEXT_PUBLIC_ENV ?? process.env.NODE_ENV,
    enabled: process.env.NODE_ENV !== "development",
  });
}
