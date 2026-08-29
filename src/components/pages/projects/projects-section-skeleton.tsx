import { Skeleton } from "@/components/ui/skeleton";

export default function ProjectsSectionSkeleton() {
  return (
    <div className="space-y-12">
      {/* Featured skeleton */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Skeleton className="aspect-video w-full rounded-2xl" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-14 rounded-full" />
          </div>
        </div>

        <div className="space-y-4">
          <Skeleton className="aspect-4/3 w-full rounded-2xl" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-7 w-4/5" />
          <Skeleton className="h-4 w-full" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-14 rounded-full" />
          </div>
        </div>
      </div>

      {/* Toolbar skeleton */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Skeleton className="h-10 w-full max-w-sm rounded-lg" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-32 rounded-lg" />
          <Skeleton className="h-10 w-28 rounded-lg" />
          <Skeleton className="h-10 w-20 rounded-lg" />
        </div>
      </div>

      {/* Grid skeleton */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="aspect-16/10 w-full rounded-2xl" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-6 w-4/5" />
            <Skeleton className="h-4 w-full" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-14 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
