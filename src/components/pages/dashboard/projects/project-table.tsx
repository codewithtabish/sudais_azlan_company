import Image from "next/image";

import { CalendarDays, ExternalLink, FolderKanban } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAllProjectsAction } from "@/app/actions/project/get-all-project-action";
import ProjectTableActions from "./project-table-action";

function formatDate(date: Date | null) {
  if (!date) return "—";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

function getProjectStatus(published: boolean) {
  return published
    ? {
        label: "Published",
        className: "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      }
    : {
        label: "Draft",
        className: "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400",
      };
}

export default async function ProjectTable() {
  const result = await getAllProjectsAction();

  if (!result.success) {
    return (
      <div className="flex min-h-[300px] items-center justify-center p-6">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-destructive/10">
            <FolderKanban className="size-5 text-destructive" />
          </div>

          <h3 className="text-base font-semibold text-foreground">Unable to load projects</h3>

          <p className="mt-1 text-sm leading-6 text-muted-foreground">{result.error}</p>
        </div>
      </div>
    );
  }

  const projects = result.projects;

  if (projects.length === 0) {
    return (
      <div className="flex min-h-[320px] flex-col items-center justify-center px-6 py-12 text-center">
        <div className="mb-4 flex size-14 items-center justify-center rounded-2xl border border-border bg-muted/50">
          <FolderKanban className="size-6 text-muted-foreground" />
        </div>

        <h3 className="text-base font-semibold text-foreground">No projects yet</h3>

        <p className="mt-1 max-w-md text-sm leading-6 text-muted-foreground">
          Create your first project to start building your portfolio and showcasing your work.
        </p>

        <Button asChild className="mt-5">
          <a href="/dashboard/projects/new">Create Project</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-xl border border-border bg-card">
      {/* Desktop table */}
      <div className="hidden overflow-x-auto md:block">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="min-w-[320px]">Project</TableHead>

              <TableHead>Category</TableHead>

              <TableHead>Status</TableHead>

              <TableHead>Featured</TableHead>

              <TableHead>Created</TableHead>

              <TableHead className="w-[80px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {projects.map((project) => {
              const status = getProjectStatus(project.published);

              return (
                <TableRow key={project.id}>
                  {/* Project */}
                  <TableCell>
                    <div className="flex min-w-[280px] items-center gap-3">
                      <div className="relative size-12 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
                        {project.bannerImage ? (
                          <Image
                            src={project.bannerImage}
                            alt={project.title}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex size-full items-center justify-center">
                            <FolderKanban className="size-5 text-muted-foreground" />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="truncate font-medium text-foreground">{project.title}</p>

                          {project.featured && (
                            <Badge variant="secondary" className="shrink-0 text-[10px]">
                              Featured
                            </Badge>
                          )}
                        </div>

                        <p className="mt-0.5 line-clamp-1 max-w-[420px] text-xs text-muted-foreground">
                          {project.shortDescription || "No description provided."}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  {/* Category */}
                  <TableCell>
                    {project.category ? (
                      <Badge variant="outline">{project.category.name}</Badge>
                    ) : (
                      <span className="text-sm text-muted-foreground">Unassigned</span>
                    )}
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    <Badge variant="outline" className={status.className}>
                      <span className="mr-1.5 size-1.5 rounded-full bg-current" />
                      {status.label}
                    </Badge>
                  </TableCell>

                  {/* Featured */}
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {project.featured ? "Yes" : "No"}
                    </span>
                  </TableCell>

                  {/* Created */}
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CalendarDays className="size-3.5" />
                      {formatDate(project.createdAt)}
                    </div>
                  </TableCell>

                  {/* Actions */}
                  <TableCell>
                    <ProjectTableActions
                      projectId={project.id}
                      projectSlug={project.slug}
                      projectTitle={project.title}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Mobile cards */}
      <div className="divide-y divide-border md:hidden">
        {projects.map((project) => {
          const status = getProjectStatus(project.published);

          return (
            <div key={project.id} className="p-4">
              <div className="flex gap-3">
                <div className="relative size-14 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
                  {project.bannerImage ? (
                    <Image
                      src={project.bannerImage}
                      alt={project.title}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center">
                      <FolderKanban className="size-5 text-muted-foreground" />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate font-medium text-foreground">{project.title}</h3>

                      <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">
                        {project.shortDescription || "No description provided."}
                      </p>
                    </div>

                    <ProjectTableActions
                      projectId={project.id}
                      projectSlug={project.slug}
                      projectTitle={project.title}
                    />
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className={status.className}>
                      <span className="mr-1.5 size-1.5 rounded-full bg-current" />
                      {status.label}
                    </Badge>

                    {project.category && <Badge variant="outline">{project.category.name}</Badge>}

                    {project.featured && <Badge variant="secondary">Featured</Badge>}
                  </div>

                  <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                    <CalendarDays className="size-3.5" />
                    Created {formatDate(project.createdAt)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="flex flex-col gap-2 border-t border-border bg-muted/20 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-foreground">
          Showing <span className="font-medium text-foreground">{projects.length}</span>{" "}
          {projects.length === 1 ? "project" : "projects"}
        </p>

        <a
          href="/projects"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
        >
          View public projects
          <ExternalLink className="size-3.5" />
        </a>
      </div>
    </div>
  );
}
