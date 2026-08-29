// src/components/pages/dashboard/projects/project-table-skeleton.tsx

import { Skeleton } from "@/components/ui/skeleton";

const ProjectTableSkeleton = () => {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="border-b border-border px-5 py-4 sm:px-6">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="mt-2 h-4 w-56" />
      </div>

      <div className="divide-y divide-border">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="flex items-center gap-4 px-5 py-4 sm:px-6">
            <Skeleton className="h-12 w-16 shrink-0 rounded-lg" />

            <div className="min-w-0 flex-1">
              <Skeleton className="h-4 w-40 max-w-full" />
              <Skeleton className="mt-2 h-3 w-64 max-w-full" />
            </div>

            <Skeleton className="hidden h-6 w-20 sm:block" />

            <Skeleton className="hidden h-6 w-20 md:block" />

            <Skeleton className="h-9 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectTableSkeleton;
