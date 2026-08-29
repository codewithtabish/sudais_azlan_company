// src/app/projects/page.tsx  (or wherever your public projects route lives)

import { Suspense } from "react";

import ProjectsSectionSkeleton from "@/components/pages/projects/projects-section-skeleton";
import ProjectsSection from "@/components/pages/projects/project-setion";
import ABOUTCTA from "@/components/pages/about/about-cta";

export default function ProjectsPage() {
  return (
    <main className="w-full">
      {/* Static header — renders immediately */}
      <header className="mb-12 space-y-4 pt-8 sm:mb-16 sm:pt-12">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
          Selected Work
        </p>

        <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
          Projects
        </h1>

        <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
          A collection of products, experiments, platforms and experiences I&apos;ve designed and
          engineered.
        </p>
      </header>

      {/* Only this section suspends */}
      <Suspense fallback={<ProjectsSectionSkeleton />}>
        <ProjectsSection />
      </Suspense>
      <ABOUTCTA />
    </main>
  );
}
