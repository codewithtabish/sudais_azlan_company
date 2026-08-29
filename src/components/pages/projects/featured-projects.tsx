import { ProjectListItem } from "@/app/actions/project/get-all-project-action";
import ProjectCard from "./project-card";

type Props = {
  projects: ProjectListItem[];
};

export default function FeaturedProjects({ projects }: Props) {
  if (projects.length === 0) return null;

  const [primary, secondary] = projects;

  return (
    <section aria-labelledby="featured-projects-heading" className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Highlighted
          </p>
          <h2
            id="featured-projects-heading"
            className="mt-1 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
          >
            Featured Projects
          </h2>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {primary && <ProjectCard project={primary} featured large index={0} />}
        {secondary && <ProjectCard project={secondary} featured index={1} />}
      </div>
    </section>
  );
}
