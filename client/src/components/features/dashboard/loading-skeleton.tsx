import { cn } from "@/lib/utils";

function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn("animate-pulse bg-muted/60 rounded-lg", className)} />
  );
}

export function CurrentWeatherSkeleton() {
  return (
    <div className="bg-card border border-card-border rounded-2xl shadow-md overflow-hidden" data-testid="skeleton-current-weather">
      <div className="bg-muted/20 px-6 pt-6 pb-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <Skeleton className="h-7 w-40" />
            <Skeleton className="h-4 w-28" />
          </div>
          <Skeleton className="h-20 w-20 rounded-full" />
        </div>
        <Skeleton className="h-16 w-48 mt-4" />
        <Skeleton className="h-3 w-32 mt-2" />
      </div>
      <div className="px-6 py-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-muted/30 rounded-xl p-3.5 flex items-center gap-3">
            <Skeleton className="h-4 w-4 shrink-0" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ForecastSkeleton() {
  return (
    <div className="bg-card border border-card-border rounded-2xl shadow-md overflow-hidden" data-testid="skeleton-forecast">
      <div className="px-6 py-4 border-b border-border/60 space-y-2">
        <Skeleton className="h-5 w-56" />
        <Skeleton className="h-3 w-36" />
      </div>
      <div className="p-4 space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-2 py-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-8 w-8 rounded" />
            <div className="flex-1 space-y-1">
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-4 w-14" />
            <Skeleton className="h-4 w-14 hidden sm:block" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function DateNavigatorSkeleton() {
  return (
    <div className="bg-card border border-card-border rounded-2xl shadow-md p-4" data-testid="skeleton-date-navigator">
      <div className="flex gap-2 overflow-hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="shrink-0 flex flex-col items-center gap-1 px-3 py-2.5 min-w-[80px]">
            <Skeleton className="h-3 w-8" />
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-3 w-14" />
          </div>
        ))}
      </div>
    </div>
  );
}
