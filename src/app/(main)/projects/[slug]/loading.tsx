import { Skeleton } from "@/components/ui/skeleton";

export default function SingleProjectLoading() {
  return (
    <main className="w-full">
      <header className="pb-10 pt-8 sm:pb-12 lg:pb-16">
        {/* Category badges */}
        <div className="mb-5 flex flex-wrap items-center gap-2">
          <Skeleton className="h-7 w-24 rounded-full" />
          <Skeleton className="h-7 w-20 rounded-full" />
        </div>

        {/* Title */}
        <div className="max-w-5xl space-y-3">
          <Skeleton className="h-10 w-full sm:h-12 lg:h-14" />
          <Skeleton className="h-10 w-4/5 sm:h-12 lg:h-14" />
          <Skeleton className="h-10 w-2/3 sm:h-12 lg:h-14" />
        </div>

        {/* Description */}
        <div className="mt-6 max-w-3xl space-y-2">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-3/4" />
        </div>

        {/* Meta + links */}
        <div className="mt-8 flex flex-col gap-5 border-t border-dashed border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-14 rounded-full" />
          </div>

          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-8 w-24 rounded-md" />
            <Skeleton className="h-8 w-24 rounded-md" />
          </div>
        </div>

        {/* Banner */}
        <div className="mt-10 sm:mt-12 lg:mt-14">
          <Skeleton className="aspect-video w-full rounded-2xl sm:rounded-3xl" />
        </div>
      </header>

      {/* Content area */}
      <div className="space-y-6 pb-16">
        <Skeleton className="h-4 w-full max-w-3xl" />
        <Skeleton className="h-4 w-full max-w-3xl" />
        <Skeleton className="h-4 w-5/6 max-w-2xl" />
        <Skeleton className="mt-8 h-8 w-64" />
        <Skeleton className="h-4 w-full max-w-3xl" />
        <Skeleton className="h-4 w-full max-w-3xl" />
        <Skeleton className="h-4 w-2/3 max-w-xl" />
        <Skeleton className="mt-8 aspect-video w-full max-w-3xl rounded-2xl" />
        <Skeleton className="h-4 w-full max-w-3xl" />
        <Skeleton className="h-4 w-4/5 max-w-2xl" />
      </div>
    </main>
  );
}
