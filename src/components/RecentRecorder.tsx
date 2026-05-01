"use client";

import { useEffect, useRef } from "react";
import { markPhraseRecent } from "@/app/actions/phrases";

/** Fire-and-forget: records this phrase as recently used once on mount. */
export function RecentRecorder({ phraseId }: { phraseId: string }) {
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    const fd = new FormData();
    fd.append("phrase_id", phraseId);
    void markPhraseRecent(fd);
  }, [phraseId]);

  return null;
}
