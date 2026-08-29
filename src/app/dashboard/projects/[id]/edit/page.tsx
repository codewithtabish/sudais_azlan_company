// src/app/dashboard/projects/[id]/edit/page.tsx

import Link from "next/link";
import { Suspense } from "react";

import { ArrowLeft, FolderKanban } from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import {
  getProjectByIdAction,
  type ProjectEditorItem,
} from "@/app/actions/project/get-project-by-id-action";

import ProjectEditForm, {
  type ProjectContent,
  type ProjectEditData,
} from "@/components/pages/dashboard/projects/project-edit-form";

// ============================================================
// TYPES
// ============================================================

type EditProjectPageProps = {
  params: Promise<{
    id: string;
  }>;
};

// ============================================================
// CONTENT NORMALIZER
// ============================================================

function normalizeProjectContent(value: ProjectContent | null): ProjectContent | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  if (!Array.isArray(value.blocks)) {
    return null;
  }

  return {
    ...value,
    blocks: value.blocks,
  };
}

// ============================================================
// DATE NORMALIZER
// ============================================================

function normalizeDate(value: Date | null): string | null {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toISOString().slice(0, 10);
}

// ============================================================
// PROJECT ADAPTER
// ============================================================

function convertProjectToEditData(project: ProjectEditorItem): ProjectEditData {
  return {
    id: project.id,

    title: project.title,

    shortDescription: project.shortDescription,

    slug: project.slug,

    categoryId: project.categoryId,

    content: normalizeProjectContent(project.content),

    bannerImage: project.bannerImage,

    ogImageUrl: project.ogImageUrl,

    liveUrl: project.liveUrl,

    githubUrl: project.githubUrl,

    demoUrl: project.demoUrl,

    caseStudyUrl: project.caseStudyUrl,

    technologies: Array.isArray(project.technologies)
      ? project.technologies.filter(
          (technology): technology is string => typeof technology === "string",
        )
      : [],

    featured: Boolean(project.featured),

    published: Boolean(project.published),

    sortOrder: typeof project.sortOrder === "number" ? project.sortOrder : 0,

    startedAt: normalizeDate(project.startedAt),

    completedAt: normalizeDate(project.completedAt),
  };
}

// ============================================================
// PROJECT CONTENT
// ============================================================

async function EditProjectContent({ id }: { id: string }) {
  const result = await getProjectByIdAction(id);

  // ==========================================================
  // ERROR
  // ==========================================================

  if (!result.success) {
    return (
      <div className="flex min-h-[400px] items-center justify-center rounded-xl border border-border bg-card p-6">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-destructive/10">
            <FolderKanban className="size-5 text-destructive" />
          </div>

          <h2 className="text-lg font-semibold text-foreground">Unable to load project</h2>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">{result.error}</p>

          <Link
            href="/dashboard/projects"
            className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            <ArrowLeft className="size-4" />
            Back to projects
          </Link>
        </div>
      </div>
    );
  }

  // ==========================================================
  // CONVERT SERVER DATA TO FORM DATA
  // ==========================================================

  const project: ProjectEditData = convertProjectToEditData(result.project);

  // ==========================================================
  // FORM
  // ==========================================================

  return <ProjectEditForm project={project} />;
}

// ============================================================
// LOADING FALLBACK
// ============================================================

function EditProjectFormFallback() {
  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex w-full max-w-md gap-2">
        <div className="h-9 w-24 animate-pulse rounded-md bg-muted" />
        <div className="h-9 w-24 animate-pulse rounded-md bg-muted" />
      </div>

      {/* Basic information */}
      <div className="rounded-xl border border-border bg-card">
        <div className="border-b border-border p-6">
          <div className="h-6 w-44 animate-pulse rounded bg-muted" />
        </div>

        <div className="space-y-6 p-6">
          <div className="space-y-2">
            <div className="h-4 w-28 animate-pulse rounded bg-muted" />
            <div className="h-10 w-full animate-pulse rounded-md bg-muted" />
          </div>

          <div className="space-y-2">
            <div className="h-4 w-36 animate-pulse rounded bg-muted" />
            <div className="h-24 w-full animate-pulse rounded-md bg-muted" />
          </div>

          <div className="space-y-2">
            <div className="h-4 w-16 animate-pulse rounded bg-muted" />
            <div className="h-10 w-full animate-pulse rounded-md bg-muted" />
          </div>
        </div>
      </div>

      {/* Category */}
      <div className="rounded-xl border border-border bg-card">
        <div className="border-b border-border p-6">
          <div className="h-6 w-32 animate-pulse rounded bg-muted" />
        </div>

        <div className="p-6">
          <div className="h-10 w-full max-w-xl animate-pulse rounded-md bg-muted" />
        </div>
      </div>

      {/* Images */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="h-[360px] animate-pulse rounded-xl border border-border bg-card" />
        <div className="h-[360px] animate-pulse rounded-xl border border-border bg-card" />
      </div>

      {/* Links */}
      <div className="h-[300px] animate-pulse rounded-xl border border-border bg-card" />

      {/* Technologies */}
      <div className="h-[220px] animate-pulse rounded-xl border border-border bg-card" />

      {/* Settings */}
      <div className="h-[260px] animate-pulse rounded-xl border border-border bg-card" />

      {/* Content */}
      <div className="h-[500px] animate-pulse rounded-xl border border-border bg-card" />
    </div>
  );
}

// ============================================================
// PAGE
// ============================================================

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const { id } = await params;

  // ==========================================================
  // INVALID ID
  // ==========================================================

  if (!id?.trim()) {
    return (
      <main className="w-full">
        <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="max-w-md text-center">
              <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-destructive/10">
                <FolderKanban className="size-5 text-destructive" />
              </div>

              <h1 className="text-lg font-semibold text-foreground">Invalid project</h1>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                The project ID is missing or invalid.
              </p>

              <Link
                href="/dashboard/projects"
                className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
              >
                <ArrowLeft className="size-4" />
                Back to projects
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ==========================================================
  // PAGE
  // ==========================================================

  return (
    <main className="w-full">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* ====================================================
            BREADCRUMB
        ==================================================== */}

        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator />

            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard/projects">Projects</BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator />

            <BreadcrumbItem>
              <BreadcrumbPage>Edit Project</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* ====================================================
            PAGE HEADER
        ==================================================== */}

        <header className="mb-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <FolderKanban className="size-5 text-muted-foreground" />

                <span className="text-sm font-medium text-muted-foreground">Project</span>
              </div>

              <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Edit Project
              </h1>

              <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                Update your project information, content, links, technologies, SEO settings, and
                publication status.
              </p>
            </div>

            <Link
              href="/dashboard/projects"
              className="inline-flex w-fit items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-4" />
              Back to projects
            </Link>
          </div>
        </header>

        {/* ====================================================
            PROJECT EDITOR
        ==================================================== */}

        <section aria-labelledby="edit-project-heading">
          <h2 id="edit-project-heading" className="sr-only">
            Edit project
          </h2>

          <Suspense fallback={<EditProjectFormFallback />}>
            <EditProjectContent id={id} />
          </Suspense>
        </section>
      </div>
    </main>
  );
}
