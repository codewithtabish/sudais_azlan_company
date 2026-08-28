import React from "react";
import Link from "next/link";
import { ChevronRight, FolderPlus } from "lucide-react";

import { CreateProjectCategoryForm } from "@/components/pages/dashboard/project-category/create-project-category-form";
import { ProjectCategoriesTable } from "@/components/pages/dashboard/project-category/project-categories-table";

const ProjectCategories = () => {
  return (
    <main className="min-h-full w-full">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-sm">
          <Link
            href="/dashboard"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Dashboard
          </Link>

          <ChevronRight className="size-4 text-muted-foreground/60" aria-hidden="true" />

          <span aria-current="page" className="font-medium text-foreground">
            Project Categories
          </span>
        </nav>

        {/* Page Header */}
        <header className="mb-8">
          <div className="flex items-start gap-4">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/50">
              <FolderPlus className="size-5 text-primary" aria-hidden="true" />
            </div>

            <div className="min-w-0">
              <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Project Categories
              </h1>

              <p className="mt-1.5 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                Create and manage categories for organizing your portfolio projects.
              </p>
            </div>
          </div>
        </header>

        {/* Content */}
        <section aria-labelledby="create-category-heading" className="w-full">
          <div className="mx-auto w-full max-w-2xl">
            <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
              <ProjectCategoriesTable />
              {/* Card Header */}
              <div className="border-b border-border px-5 py-5 sm:px-6">
                <h2
                  id="create-category-heading"
                  className="text-base font-semibold text-foreground"
                >
                  Create project category
                </h2>

                <p className="mt-1 text-sm leading-5 text-muted-foreground">
                  Add a category to help organize and filter your portfolio projects.
                </p>
              </div>

              {/* Form */}
              <div className="px-5 py-6 sm:px-6 sm:py-7">
                <CreateProjectCategoryForm />
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default ProjectCategories;
