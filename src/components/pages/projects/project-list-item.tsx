"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import { Badge } from "@/components/ui/badge";
import { ProjectListItem } from "@/app/actions/project/get-all-project-action";

type Props = {
  project: ProjectListItem;
  index?: number;
};

const MAX_TECH = 4;

export default function ProjectListItemFile({ project, index = 0 }: Props) {
  const prefersReducedMotion = useReducedMotion();

  const visibleTech = project.technologies.slice(0, MAX_TECH);
  const remainingTech = project.technologies.length - MAX_TECH;

  return (
    <motion.article
      initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
      whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{
        duration: 0.35,
        delay: prefersReducedMotion ? 0 : Math.min(index * 0.04, 0.2),
      }}
    >
      <Link
        href={`/projects/${project.slug}`}
        className="group flex flex-col gap-4 overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-border/80 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:flex-row sm:items-center sm:gap-6 sm:p-5"
      >
        {/* Thumbnail */}
        <div className="relative aspect-16/10 w-full shrink-0 overflow-hidden rounded-xl bg-muted sm:aspect-square sm:h-28 sm:w-28">
          {project.bannerImage ? (
            <Image
              src={project.bannerImage}
              alt={project.title}
              fill
              sizes="(max-width: 640px) 100vw, 112px"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm font-medium text-muted-foreground">
              {project.title.charAt(0)}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            <span>{project.category.name}</span>
            {project.featured && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-primary">Featured</span>
              </>
            )}
          </div>

          <div className="flex items-start justify-between gap-3">
            <h3 className="text-lg font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary">
              {project.title}
            </h3>
            <ArrowUpRight
              className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-foreground"
              aria-hidden="true"
            />
          </div>

          {project.shortDescription && (
            <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">
              {project.shortDescription}
            </p>
          )}

          {visibleTech.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {visibleTech.map((tech) => (
                <Badge
                  key={tech}
                  variant="secondary"
                  className="rounded-full px-2.5 py-0.5 text-[11px] font-medium"
                >
                  {tech}
                </Badge>
              ))}
              {remainingTech > 0 && (
                <Badge
                  variant="outline"
                  className="rounded-full px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground"
                >
                  +{remainingTech}
                </Badge>
              )}
            </div>
          )}
        </div>
      </Link>
    </motion.article>
  );
}
