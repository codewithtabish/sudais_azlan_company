import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="w-full">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Breadcrumb skeleton */}
        <div className="mb-6 flex items-center gap-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-2" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-2" />
          <Skeleton className="h-4 w-28" />
        </div>

        {/* Page header */}
        <header className="mb-8">
          <div className="space-y-3">
            <Skeleton className="h-8 w-48 sm:h-9" />
            <Skeleton className="h-5 w-full max-w-2xl" />
            <Skeleton className="h-5 w-3/4 max-w-xl" />
          </div>
        </header>

        {/* Form skeleton */}
        <section className="rounded-xl border border-border bg-card">
          <div className="space-y-6 p-4 sm:p-6 lg:p-8">
            {/* Basic information */}
            <div className="space-y-4">
              <Skeleton className="h-5 w-40" />

              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>

                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
              </div>

              <div className="space-y-2">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-24 w-full rounded-md" />
              </div>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>

            {/* Banner */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-48 w-full rounded-lg" />
            </div>

            {/* Content editor */}
            <div className="space-y-3">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-64 w-full rounded-lg" />
            </div>

            {/* Links */}
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>

              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            </div>

            {/* Technologies */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>

            {/* Settings */}
            <div className="space-y-4">
              <Skeleton className="h-5 w-24" />

              <div className="flex flex-col gap-4 rounded-lg border border-border p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-64" />
                </div>

                <Skeleton className="h-6 w-11 rounded-full" />
              </div>

              <div className="flex flex-col gap-4 rounded-lg border border-border p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-64" />
                </div>

                <Skeleton className="h-6 w-11 rounded-full" />
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:justify-end">
              <Skeleton className="h-10 w-full sm:w-24" />
              <Skeleton className="h-10 w-full sm:w-32" />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
