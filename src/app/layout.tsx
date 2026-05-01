import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import { AnalyticsProvider } from "@/components/AnalyticsProvider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VANI",
  description: "Learn phrases — fast, minimal, mobile-first.",
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
        {children}
      </body>
    </html>
  );
}
