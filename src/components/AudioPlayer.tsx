"use client";

type Props = {
  src: string;
  className?: string;
};

/** HTML5 audio — instant playback from URL, no extra API calls. */
export function AudioPlayer({ src, className }: Props) {
  if (!src) return null;
  return (
    <audio
      preload="auto"
      controls
      src={src}
      className={className ?? "h-10 w-full max-w-sm rounded-md border border-black bg-[#F5F5F5]"}
    />
  );
}
