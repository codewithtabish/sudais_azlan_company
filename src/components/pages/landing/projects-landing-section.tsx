import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  getAllProjectsAction,
  ProjectListItem,
} from "@/app/actions/project/get-all-project-action";

const MAX_TECH = 3;

function LandingProjectCard({
  project,
  className,
}: {
  project: ProjectListItem;
  className?: string;
}) {
  const visibleTech = project.technologies.slice(0, MAX_TECH);
  const remaining = project.technologies.length - MAX_TECH;

  return (
    <article className={cn("group h-full", className)}>
      <Link
        href={`/projects/${project.slug}`}
        className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-border/80 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {/* Image */}
        <div className="relative aspect-16/10 overflow-hidden bg-muted">
          {project.bannerImage ? (
            <Image
              src={project.bannerImage}
              alt={project.title}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted">
              <span className="text-sm font-medium text-muted-foreground">
                {project.title.charAt(0)}
              </span>
            </div>
          )}

          <div className="absolute inset-0 bg-linear-to-t from-background/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          <div className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-background/80 text-foreground opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100">
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col gap-3 p-5 sm:p-6">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            <span>{project.category.name}</span>
            {project.featured && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-primary">Featured</span>
              </>
            )}
          </div>

          <h3 className="text-lg font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary sm:text-xl">
            {project.title}
          </h3>

          {project.shortDescription && (
            <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">
              {project.shortDescription}
            </p>
          )}

          {visibleTech.length > 0 && (
            <div className="mt-auto flex flex-wrap gap-1.5 pt-1">
              {visibleTech.map((tech) => (
                <Badge
                  key={tech}
                  variant="secondary"
                  className="rounded-full px-2.5 py-0.5 text-[11px] font-medium"
                >
                  {tech}
                </Badge>
              ))}
              {remaining > 0 && (
                <Badge
                  variant="outline"
                  className="rounded-full px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground"
                >
                  +{remaining}
                </Badge>
              )}
            </div>
          )}
        </div>
      </Link>
    </article>
  );
}

export default async function ProjectsLandingSection() {
  const result = await getAllProjectsAction();

  if (!result.success) {
    return null;
  }

  // Public + prefer featured, then take first 3
  const published = result.projects.filter((p) => p.published);

  const featured = published.filter((p) => p.featured);
  const rest = published.filter((p) => !p.featured);

  const selected = [...featured, ...rest].slice(0, 3);

  if (selected.length === 0) {
    return null;
  }

  const [first, second, third] = selected;

  return (
    <section aria-labelledby="landing-projects-heading" className="py-16 sm:py-20">
      {/* Header */}
      <div className="mb-10 space-y-3 sm:mb-12">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
          Selected Work
        </p>
        <h2
          id="landing-projects-heading"
          className="max-w-2xl text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
        >
          Projects
        </h2>
        <p className="max-w-xl text-base leading-7 text-muted-foreground">
          A few things I&apos;ve designed and built recently.
        </p>
      </div>

      {/* Cards */}
      <div className="space-y-6">
        {/* Row 1 — first two side by side on large screens */}
        <div className="grid gap-6 lg:grid-cols-2">
          {first && <LandingProjectCard project={first} />}
          {second && <LandingProjectCard project={second} />}
        </div>

        {/* Row 2 — third centered */}
        {third && (
          <div className="flex justify-center">
            <div className="w-full max-w-xl lg:max-w-none lg:w-[calc(50%-0.75rem)]">
              <LandingProjectCard project={third} />
            </div>
          </div>
        )}
      </div>

      {/* Explore more */}
      <div className="mt-12 flex justify-center sm:mt-14">
        <Button asChild variant="outline" size="lg" className="group gap-2">
          <Link href="/projects">
            Explore more projects
            <ArrowRight
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </Button>
      </div>
    </section>
  );
}
