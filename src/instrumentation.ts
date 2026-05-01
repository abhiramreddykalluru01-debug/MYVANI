/**
 * Next.js instrumentation hook — runs once on cold start.
 * Loads the matching Sentry config based on runtime so client / server /
 * edge errors all flow into the same project.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("../sentry.server.config");
  }
  if (process.env.NEXT_RUNTIME === "edge") {
    await import("../sentry.edge.config");
  }
}

export async function onRequestError(
  err: unknown,
  request: Parameters<
    NonNullable<typeof import("@sentry/nextjs").captureRequestError>
  >[1],
  errorContext: Parameters<
    NonNullable<typeof import("@sentry/nextjs").captureRequestError>
  >[2],
) {
  const Sentry = await import("@sentry/nextjs");
  Sentry.captureRequestError(err, request, errorContext);
}
