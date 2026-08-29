"use client";

import { FolderOpen } from "lucide-react";

type Props = {
  /** Optional custom message */
  message?: string;
};

export default function ProjectsEmptyState({
  message = "Try adjusting your search or filters to find what you’re looking for.",
}: Props) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/30 px-6 py-16 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <FolderOpen className="h-6 w-6" aria-hidden="true" />
      </div>

      <h3 className="text-lg font-semibold text-foreground">No projects found</h3>

      <p className="mt-2 max-w-sm text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
