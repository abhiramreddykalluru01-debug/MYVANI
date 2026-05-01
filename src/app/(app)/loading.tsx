export default function Loading() {
  return (
    <div className="flex flex-col gap-5 pb-6 animate-pulse">
      {/* Page title skeleton */}
      <div className="h-7 w-48 rounded-lg bg-[#E5E5E5]" />

      {/* Search bar skeleton */}
      <div className="h-12 w-full rounded-2xl bg-[#E5E5E5]" />

      {/* Chip row skeleton */}
      <div className="flex gap-2 overflow-hidden">
        {[72, 88, 64, 96].map((w) => (
          <div
            key={w}
            className="h-7 shrink-0 rounded-full bg-[#E5E5E5]"
            style={{ width: w }}
          />
        ))}
      </div>

      {/* Phrase card skeletons */}
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex flex-col gap-2 rounded-2xl border border-[#E5E5E5] bg-white p-4">
          <div className="h-3 w-28 rounded bg-[#E5E5E5]" />
          <div className="h-10 w-3/4 rounded-lg bg-[#E5E5E5]" />
        </div>
      ))}
    </div>
  );
}
