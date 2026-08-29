"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Grid3X3, List, Search } from "lucide-react";

import type { ProjectListItem } from "@/app/actions/project/get-all-project-action";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import FeaturedProjects from "./featured-projects";
import ProjectCard from "./project-card";
import ProjectListItemFile from "./project-list-item";
import ProjectsEmptyState from "./projects-empty-state";

type SortOption = "featured" | "newest" | "oldest" | "a-z" | "z-a";
type FeaturedFilter = "all" | "featured" | "standard";
type ViewMode = "grid" | "list";

type Props = {
  projects: ProjectListItem[];
};

function readStoredView(): ViewMode {
  if (typeof window === "undefined") return "grid";

  try {
    const stored = window.localStorage.getItem("projects-view");
    if (stored === "grid" || stored === "list") return stored;
  } catch {
    // ignore
  }

  return "grid";
}

export default function ProjectsBrowser({ projects }: Props) {
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("all");
  const [featuredFilter, setFeaturedFilter] = useState<FeaturedFilter>("all");
  const [sort, setSort] = useState<SortOption>("featured");
  const [view, setView] = useState<ViewMode>("grid");
  const [hasHydratedView, setHasHydratedView] = useState(false);

  useEffect(() => {
    const stored = readStoredView();
    const id = window.requestAnimationFrame(() => {
      setView(stored);
      setHasHydratedView(true);
    });
    return () => window.cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    if (!hasHydratedView) return;
    try {
      window.localStorage.setItem("projects-view", view);
    } catch {
      // ignore
    }
  }, [view, hasHydratedView]);

  const publishedProjects = useMemo(() => projects.filter((p) => p.published), [projects]);

  const featuredProjects = useMemo(
    () => publishedProjects.filter((p) => p.featured).slice(0, 2),
    [publishedProjects],
  );

  const categories = useMemo(() => {
    const map = new Map<string, { id: string; name: string }>();
    for (const project of publishedProjects) {
      if (!map.has(project.category.id)) {
        map.set(project.category.id, {
          id: project.category.id,
          name: project.category.name,
        });
      }
    }
    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [publishedProjects]);

  const filteredProjects = useMemo(() => {
    let result = [...publishedProjects];

    const q = search.trim().toLowerCase();
    if (q) {
      result = result.filter((project) => {
        const haystack = [
          project.title,
          project.shortDescription ?? "",
          project.category.name,
          ...project.technologies,
        ]
          .join(" ")
          .toLowerCase();
        return haystack.includes(q);
      });
    }

    if (categoryId !== "all") {
      result = result.filter((p) => p.category.id === categoryId);
    }

    if (featuredFilter === "featured") {
      result = result.filter((p) => p.featured);
    } else if (featuredFilter === "standard") {
      result = result.filter((p) => !p.featured);
    }

    result.sort((a, b) => {
      switch (sort) {
        case "featured":
          if (a.featured !== b.featured) return a.featured ? -1 : 1;
          return b.createdAt.getTime() - a.createdAt.getTime();
        case "newest":
          return b.createdAt.getTime() - a.createdAt.getTime();
        case "oldest":
          return a.createdAt.getTime() - b.createdAt.getTime();
        case "a-z":
          return a.title.localeCompare(b.title);
        case "z-a":
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });

    return result;
  }, [publishedProjects, search, categoryId, featuredFilter, sort]);

  const clearFilters = useCallback(() => {
    setSearch("");
    setCategoryId("all");
    setFeaturedFilter("all");
    setSort("featured");
  }, []);

  const hasActiveFilters =
    search.trim() !== "" || categoryId !== "all" || featuredFilter !== "all" || sort !== "featured";

  return (
    <div className="space-y-14">
      {featuredProjects.length > 0 && !hasActiveFilters && (
        <FeaturedProjects projects={featuredProjects} />
      )}

      <section aria-labelledby="all-projects-heading" className="space-y-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Archive
          </p>
          <h2
            id="all-projects-heading"
            className="mt-1 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
          >
            All Projects
          </h2>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full max-w-md">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search projects..."
                className="pl-9"
                aria-label="Search projects"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger className="w-[160px]" aria-label="Filter by category">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={featuredFilter}
                onValueChange={(v) => setFeaturedFilter(v as FeaturedFilter)}
              >
                <SelectTrigger className="w-[140px]" aria-label="Filter by featured">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All projects</SelectItem>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="standard">Standard</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sort} onValueChange={(v) => setSort(v as SortOption)}>
                <SelectTrigger className="w-[150px]" aria-label="Sort projects">
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured first</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                  <SelectItem value="a-z">A – Z</SelectItem>
                  <SelectItem value="z-a">Z – A</SelectItem>
                </SelectContent>
              </Select>

              <div className="hidden items-center rounded-lg border border-border p-1 sm:flex">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className={cn("h-8 w-8", view === "grid" && "bg-muted text-foreground")}
                  onClick={() => setView("grid")}
                  aria-label="Grid view"
                  aria-pressed={view === "grid"}
                >
                  <Grid3X3 className="h-4 w-4" aria-hidden="true" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className={cn("h-8 w-8", view === "list" && "bg-muted text-foreground")}
                  onClick={() => setView("list")}
                  aria-label="List view"
                  aria-pressed={view === "list"}
                >
                  <List className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            {filteredProjects.length} {filteredProjects.length === 1 ? "project" : "projects"}
          </p>
        </div>

        {filteredProjects.length === 0 ? (
          <div className="space-y-4">
            <ProjectsEmptyState />
            {hasActiveFilters && (
              <div className="flex justify-center">
                <Button variant="outline" onClick={clearFilters}>
                  Clear filters
                </Button>
              </div>
            )}
          </div>
        ) : view === "grid" ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                featured={project.featured}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProjects.map((project, index) => (
              <ProjectListItemFile key={project.id} project={project} index={index} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
