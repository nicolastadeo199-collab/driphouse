export function CardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-lg border border-border bg-background-elevated">
      <div className="aspect-square bg-white/5" />
      <div className="space-y-2 p-3">
        <div className="h-3 w-3/4 rounded bg-white/5" />
        <div className="h-3 w-1/3 rounded bg-white/5" />
      </div>
    </div>
  );
}

export function RowSkeleton() {
  return (
    <div className="flex animate-pulse items-center gap-3 px-3 py-2">
      <div className="h-10 w-10 shrink-0 rounded bg-white/5" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-2/3 rounded bg-white/5" />
        <div className="h-3 w-1/4 rounded bg-white/5" />
      </div>
    </div>
  );
}
