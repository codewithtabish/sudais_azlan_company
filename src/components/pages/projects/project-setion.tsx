import { getAllProjectsAction } from "@/app/actions/project/get-all-project-action";
import ProjectsErrorState from "./projects-error-state";
import ProjectsBrowser from "./projects-browser";

export default async function ProjectsSection() {
  const result = await getAllProjectsAction();

  if (!result.success) {
    return <ProjectsErrorState message={result.error} />;
  }

  if (result.projects.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-muted/30 px-6 py-20 text-center">
        <h3 className="text-lg font-semibold text-foreground">No projects yet</h3>
        <p className="mt-2 text-sm text-muted-foreground">New work will appear here soon.</p>
      </div>
    );
  }

  return <ProjectsBrowser projects={result.projects} />;
}
