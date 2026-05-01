import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["10.34.174.201", "192.168.1.19"],
};

const enableSentry = Boolean(
  process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN,
);

export default enableSentry
  ? withSentryConfig(nextConfig, {
      // Build-time Sentry options.
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      silent: true,
      widenClientFileUpload: true,
      reactComponentAnnotation: { enabled: true },
      tunnelRoute: "/monitoring",
      sourcemaps: { disable: true },
      disableLogger: true,
      automaticVercelMonitors: false,
    })
  : nextConfig;
