import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import { AnalyticsProvider } from "@/components/AnalyticsProvider";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VANI — Speak with confidence",
  description:
    "Phrases for everyday situations in Indian languages. Speak immediately.",
  applicationName: "VANI",
  appleWebApp: {
    capable: true,
    title: "VANI",
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full bg-[#F5F5F5] font-sans text-black antialiased">
        <Suspense fallback={null}>
          <AnalyticsProvider />
        </Suspense>
        <ServiceWorkerRegister />
        {children}
      </body>
    </html>
  );
}
