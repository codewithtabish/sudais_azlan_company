"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ProjectListItem } from "@/app/actions/project/get-all-project-action";

type Props = {
  project: ProjectListItem;
  featured?: boolean;
  large?: boolean;
  index?: number;
};

const MAX_TECH = 3;

export default function ProjectCard({
  project,
  featured = false,
  large = false,
  index = 0,
}: Props) {
  const prefersReducedMotion = useReducedMotion();

  const visibleTech = project.technologies.slice(0, MAX_TECH);
  const remainingTech = project.technologies.length - MAX_TECH;

  return (
    <motion.article
      initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
      whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.4,
        delay: prefersReducedMotion ? 0 : Math.min(index * 0.06, 0.3),
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={cn("group h-full", large && "lg:col-span-2")}
    >
      <Link
        href={`/projects/${project.slug}`}
        className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-border/80 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {/* Image */}
        <div
          className={cn(
            "relative overflow-hidden bg-muted",
            large ? "aspect-video" : "aspect-16/10",
          )}
        >
          {project.bannerImage ? (
            <Image
              src={project.bannerImage}
              alt={project.title}
              fill
              sizes={
                large
                  ? "(max-width: 1024px) 100vw, 66vw"
                  : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              }
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted">
              <span className="text-sm font-medium text-muted-foreground">
                {project.title.charAt(0)}
              </span>
            </div>
          )}

          {/* Overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-background/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          {/* Arrow */}
          <div className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-background/80 text-foreground opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100">
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col gap-3 p-5 sm:p-6">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            <span>{project.category.name}</span>
            {featured && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-primary">Featured</span>
              </>
            )}
          </div>

          <h3
            className={cn(
              "font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary",
              large ? "text-xl sm:text-2xl" : "text-lg",
            )}
          >
            {project.title}
          </h3>

          {project.shortDescription && (
            <p
              className={cn(
                "text-sm leading-6 text-muted-foreground",
                large ? "line-clamp-3" : "line-clamp-2",
              )}
            >
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
