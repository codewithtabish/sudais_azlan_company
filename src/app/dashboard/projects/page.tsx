import Link from "next/link";
import { Plus } from "lucide-react";
import { Suspense } from "react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";

import ProjectTable from "@/components/pages/dashboard/projects/project-table";
import ProjectTableSkeleton from "@/components/pages/dashboard/projects/project-table-skeleton";

const DashboardProjectsPage = () => {
  return (
    <main className="w-full">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator />

            <BreadcrumbItem>
              <BreadcrumbPage>Projects</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <header className="mb-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Projects
              </h1>

              <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                Create, manage, and showcase your projects from one place. Organize your work and
                keep your project portfolio up to date.
              </p>
            </div>

            <Button asChild className="w-full sm:w-auto">
              <Link href="/dashboard/projects/new">
                <Plus className="size-4" />
                New Project
              </Link>
            </Button>
          </div>
        </header>

        {/* Projects */}
        <section aria-labelledby="projects-heading">
          <h2 id="projects-heading" className="sr-only">
            Your projects
          </h2>

          <Suspense fallback={<ProjectTableSkeleton />}>
            <ProjectTable />
          </Suspense>
        </section>
      </div>
    </main>
  );
};

export default DashboardProjectsPage;
