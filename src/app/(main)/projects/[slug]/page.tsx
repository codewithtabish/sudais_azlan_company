import { notFound } from "next/navigation";

import { getProjectBySlugAction } from "@/app/actions/project/project-slug-action";
import { ProjectContentContainer } from "@/components/general/layouts/project-content-container";
import { ProjectPreviewContent } from "@/components/pages/dashboard/projects/project-previewer";
import ProjectHeader from "@/components/pages/projects/single-project-header";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function SingleProjectPage({ params }: PageProps) {
  const { slug } = await params;

  const result = await getProjectBySlugAction(slug);

  if (!result.success) {
    notFound();
  }

  const { project } = result;

  // Category is required by ProjectHeader; guard if null
  if (!project.category) {
    notFound();
  }

  return (
    <main>
      <ProjectHeader
        title={project.title}
        shortDescription={project.shortDescription}
        bannerImage={project.bannerImage}
        technologies={project.technologies}
        featured={project.featured}
        startedAt={project.startedAt}
        completedAt={project.completedAt}
        liveUrl={project.liveUrl}
        githubUrl={project.githubUrl}
        demoUrl={project.demoUrl}
        caseStudyUrl={project.caseStudyUrl}
        category={project.category}
      />

      <ProjectContentContainer>
        <ProjectPreviewContent content={project.content} />
      </ProjectContentContainer>
    </main>
  );
}
