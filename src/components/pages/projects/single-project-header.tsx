import { KineticText } from "@/components/ui/kinetic-text";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, ExternalLink, GitGraphIcon, Link2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export type ProjectHeaderProps = {
  title: string;
  shortDescription: string | null;
  bannerImage: string | null;
  technologies: string[];
  featured: boolean;
  startedAt: Date | null;
  completedAt: Date | null;
  liveUrl: string | null;
  githubUrl: string | null;
  demoUrl: string | null;
  caseStudyUrl: string | null;
  category: {
    id: string;
    name: string;
    slug: string;
  };
};

function formatProjectDate(date: Date | null) {
  if (!date) return null;

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

function formatProjectDateRange(startedAt: Date | null, completedAt: Date | null) {
  const start = formatProjectDate(startedAt);
  const end = formatProjectDate(completedAt);

  if (start && end) return `${start} – ${end}`;
  if (start) return `Started ${start}`;
  if (end) return `Completed ${end}`;
  return null;
}

export default function ProjectHeader({
  title,
  shortDescription,
  bannerImage,
  technologies,
  featured,
  startedAt,
  completedAt,
  liveUrl,
  githubUrl,
  demoUrl,
  caseStudyUrl,
  category,
}: ProjectHeaderProps) {
  const dateRange = formatProjectDateRange(startedAt, completedAt);

  const links = [
    liveUrl ? { href: liveUrl, label: "Live site", icon: ExternalLink } : null,
    githubUrl ? { href: githubUrl, label: "GitHub", icon: GitGraphIcon } : null,
    demoUrl ? { href: demoUrl, label: "Demo", icon: Link2 } : null,
    caseStudyUrl ? { href: caseStudyUrl, label: "Case study", icon: Link2 } : null,
  ].filter(Boolean) as {
    href: string;
    label: string;
    icon: typeof ExternalLink;
  }[];

  return (
    <header className="pb-10 pt-8 sm:pb-12 lg:pb-16">
      {/* =====================================================
          CATEGORY + FEATURED
      ====================================================== */}
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
          {category.name}
        </span>

        {featured && (
          <span className="inline-flex items-center rounded-full border border-border bg-muted px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
            Featured
          </span>
        )}
      </div>

      {/* =====================================================
          TITLE
      ====================================================== */}
      <KineticText
        text={title}
        as="h1"
        className="max-w-5xl text-4xl font-bold leading-[1.05] tracking-[-0.035em] text-foreground sm:text-5xl lg:text-6xl xl:text-[4.25rem]"
      />

      {/* =====================================================
          DESCRIPTION
      ====================================================== */}
      {shortDescription && (
        <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground sm:text-xl sm:leading-9">
          {shortDescription}
        </p>
      )}

      {/* =====================================================
          META + LINKS
      ====================================================== */}
      <div className="mt-8 flex flex-col gap-5 border-t border-dashed border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          {dateRange && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarDays className="size-4" aria-hidden="true" />
              <span>{dateRange}</span>
            </div>
          )}

          {technologies.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              {technologies.slice(0, 6).map((tech) => (
                <Badge
                  key={tech}
                  variant="secondary"
                  className="rounded-full px-2.5 py-0.5 text-[11px] font-medium"
                >
                  {tech}
                </Badge>
              ))}
              {technologies.length > 6 && (
                <Badge
                  variant="outline"
                  className="rounded-full px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground"
                >
                  +{technologies.length - 6}
                </Badge>
              )}
            </div>
          )}
        </div>

        {links.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {links.map((link) => {
              const Icon = link.icon;

              return (
                <Button key={link.href} asChild variant="outline" size="sm" className="gap-1.5">
                  <Link href={link.href} target="_blank" rel="noopener noreferrer">
                    <Icon className="size-3.5" aria-hidden="true" />
                    {link.label}
                  </Link>
                </Button>
              );
            })}
          </div>
        )}
      </div>

      {/* =====================================================
          HERO BANNER (same treatment as BlogHeader)
      ====================================================== */}
      {bannerImage && (
        <div className="mt-10 sm:mt-12 lg:mt-14">
          <div className="group relative overflow-hidden rounded-2xl border border-border bg-muted shadow-sm sm:rounded-3xl">
            <div className="relative aspect-video w-full">
              <Image
                src={bannerImage}
                alt={title}
                fill
                priority
                sizes="(max-width: 640px) 100vw, (max-width: 1280px) 100vw, 1600px"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.015]"
              />

              {/* Image readability overlay — same as blog */}
              <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/25 via-transparent to-black/5" />

              {/* Bottom subtle vignette — same as blog */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-black/15 to-transparent" />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
