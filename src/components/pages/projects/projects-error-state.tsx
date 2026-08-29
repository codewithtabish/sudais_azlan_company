"use client";

import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  message?: string;
};

export default function ProjectsErrorState({ message }: Props) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card px-6 py-20 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <AlertCircle className="h-6 w-6" aria-hidden="true" />
      </div>

      <h3 className="text-lg font-semibold text-foreground">Unable to load projects</h3>

      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        {message || "Something went wrong while loading projects. Please try again."}
      </p>

      <Button variant="outline" className="mt-6" onClick={() => window.location.reload()}>
        <RefreshCw className="mr-2 h-4 w-4" aria-hidden="true" />
        Try again
      </Button>
    </div>
  );
}
