"use client";

import { useEffect, useState } from "react";
import { BottomNav } from "@/components/BottomNav";

/**
 * Render nav only after mount to avoid SSR/client className mismatches from
 * stale client bundles during active local development.
 */
export function BottomNavClientOnly() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return <BottomNav />;
}
