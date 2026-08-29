"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath, revalidateTag } from "next/cache";

import { CACHE_TAGS } from "@/lib/cache-key";
import prisma from "@/lib/prisma-client";
import { Prisma } from "@/generated/prisma/client";

// ============================================================
// TYPES
// ============================================================

export type ProjectContent = {
  time?: number;
  blocks: unknown[];
  version?: string;
  [key: string]: unknown;
};

export type UpdateProjectInput = {
  id: string;
  title: string;
  shortDescription: string;
  slug: string;
  categoryId: string;
  content: ProjectContent;
  bannerImage: string;
  ogImage: string;
  liveUrl: string;
  githubUrl: string;
  demoUrl: string;
  caseStudyUrl: string;
  technologies: string[];
  featured: boolean;
  published: boolean;
  sortOrder: number;
  startedAt: string;
  completedAt: string;
};

// ============================================================
// RESULT TYPES
// ============================================================

type UpdateProjectSuccess = {
  success: true;
  data: {
    project: {
      id: string;
      slug: string;
      title: string;
    };
  };
};

type UpdateProjectFailure = {
  success: false;
  error: string;
};

export type UpdateProjectResult = UpdateProjectSuccess | UpdateProjectFailure;

// ============================================================
// CONSTANTS
// ============================================================

const PROJECT_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

const URL_FIELDS = ["liveUrl", "githubUrl", "demoUrl", "caseStudyUrl"] as const;

// ============================================================
// HELPERS
// ============================================================

function cleanString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function cleanOptionalUrl(value: unknown): string | null {
  const cleaned = cleanString(value);

  if (!cleaned) {
    return null;
  }

  try {
    const url = new URL(cleaned);

    if (!["http:", "https:"].includes(url.protocol)) {
      return null;
    }

    return url.toString();
  } catch {
    return null;
  }
}

function cleanTechnologies(values: unknown): string[] {
  if (!Array.isArray(values)) {
    return [];
  }

  const cleaned = values
    .filter((value): value is string => typeof value === "string")
    .map((value) => value.trim())
    .filter(Boolean);

  const seen = new Set<string>();
  const result: string[] = [];

  for (const technology of cleaned) {
    const normalized = technology.toLowerCase();

    if (seen.has(normalized)) {
      continue;
    }

    seen.add(normalized);
    result.push(technology);
  }

  return result;
}

function isValidDate(value: string): boolean {
  if (!PROJECT_DATE_REGEX.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00.000Z`);

  return !Number.isNaN(date.getTime());
}

/**
 * Converts our editor content into a Prisma-compatible JSON value.
 *
 * JSON.stringify/parse removes unsupported values such as:
 * - undefined
 * - functions
 * - symbols
 *
 * It also guarantees that the final value is JSON-compatible.
 */
function toPrismaJson(value: ProjectContent): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}

// ============================================================
// ACTION
// ============================================================

export async function updateProjectAction(input: UpdateProjectInput): Promise<UpdateProjectResult> {
  try {
    // ========================================================
    // AUTH
    // ========================================================

    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return {
        success: false,
        error: "You must be signed in to update a project.",
      };
    }

    // ========================================================
    // BASIC INPUT
    // ========================================================

    const projectId = cleanString(input?.id);
    const title = cleanString(input?.title);
    const shortDescription = cleanString(input?.shortDescription);
    const slug = cleanString(input?.slug);
    const categoryId = cleanString(input?.categoryId);

    const bannerImage = cleanString(input?.bannerImage);
    const ogImage = cleanString(input?.ogImage);

    const liveUrl = cleanString(input?.liveUrl);
    const githubUrl = cleanString(input?.githubUrl);
    const demoUrl = cleanString(input?.demoUrl);
    const caseStudyUrl = cleanString(input?.caseStudyUrl);

    const startedAt = cleanString(input?.startedAt);
    const completedAt = cleanString(input?.completedAt);

    // ========================================================
    // REQUIRED VALIDATION
    // ========================================================

    if (!projectId) {
      return {
        success: false,
        error: "Project ID is required.",
      };
    }

    if (!title) {
      return {
        success: false,
        error: "Project title is required.",
      };
    }

    if (title.length > 200) {
      return {
        success: false,
        error: "Project title is too long.",
      };
    }

    if (!shortDescription) {
      return {
        success: false,
        error: "Project short description is required.",
      };
    }

    if (shortDescription.length > 500) {
      return {
        success: false,
        error: "Project short description cannot exceed 500 characters.",
      };
    }

    if (!slug) {
      return {
        success: false,
        error: "Project slug is required.",
      };
    }

    if (!categoryId) {
      return {
        success: false,
        error: "Project category is required.",
      };
    }

    if (!bannerImage) {
      return {
        success: false,
        error: "Project banner image is required.",
      };
    }

    // ========================================================
    // CONTENT VALIDATION
    // ========================================================

    const content = input?.content;

    if (
      !content ||
      typeof content !== "object" ||
      Array.isArray(content) ||
      !Array.isArray(content.blocks) ||
      content.blocks.length === 0
    ) {
      return {
        success: false,
        error: "Project content cannot be empty.",
      };
    }

    // ========================================================
    // DATE VALIDATION
    // ========================================================

    if (startedAt && !isValidDate(startedAt)) {
      return {
        success: false,
        error: "Please enter a valid start date.",
      };
    }

    if (completedAt && !isValidDate(completedAt)) {
      return {
        success: false,
        error: "Please enter a valid completion date.",
      };
    }

    if (startedAt && completedAt && startedAt > completedAt) {
      return {
        success: false,
        error: "Completion date cannot be before the start date.",
      };
    }

    // ========================================================
    // URL VALIDATION
    // ========================================================

    const urls = {
      liveUrl,
      githubUrl,
      demoUrl,
      caseStudyUrl,
    };

    for (const field of URL_FIELDS) {
      const value = urls[field];

      if (!value) {
        continue;
      }

      if (!cleanOptionalUrl(value)) {
        return {
          success: false,
          error: `Please enter a valid ${field.replace("Url", "")} URL.`,
        };
      }
    }

    // ========================================================
    // SORT ORDER
    // ========================================================

    const sortOrder =
      Number.isFinite(input?.sortOrder) && input.sortOrder >= 0 ? Math.floor(input.sortOrder) : 0;

    // ========================================================
    // TECHNOLOGIES
    //
    // IMPORTANT:
    // Your Prisma schema has:
    //
    // technologies String[]
    //
    // It is NOT a relation.
    // ========================================================

    const technologies = cleanTechnologies(input?.technologies);

    // ========================================================
    // FIND USER
    // ========================================================

    const user = await prisma.user.findUnique({
      where: {
        clerkId,
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      return {
        success: false,
        error: "Your user account could not be found.",
      };
    }

    // ========================================================
    // FIND EXISTING PROJECT
    //
    // This also verifies ownership.
    // ========================================================

    const existingProject = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: user.id,
      },
      select: {
        id: true,
        slug: true,
      },
    });

    if (!existingProject) {
      return {
        success: false,
        error: "Project not found or you do not have permission to edit it.",
      };
    }

    // ========================================================
    // CHECK CATEGORY
    //
    // IMPORTANT:
    // Your schema has model Category.
    //
    // There is NO:
    // prisma.projectCategory
    // ========================================================

    const category = await prisma.category.findUnique({
      where: {
        id: categoryId,
      },
      select: {
        id: true,
      },
    });

    if (!category) {
      return {
        success: false,
        error: "Selected project category was not found.",
      };
    }

    // ========================================================
    // CHECK SLUG
    //
    // Your schema has:
    //
    // @@unique([userId, slug])
    //
    // Therefore the duplicate check should be scoped
    // to the current user.
    // ========================================================

    const projectWithSameSlug = await prisma.project.findFirst({
      where: {
        userId: user.id,
        slug,
        NOT: {
          id: projectId,
        },
      },
      select: {
        id: true,
      },
    });

    if (projectWithSameSlug) {
      return {
        success: false,
        error: "A project with this slug already exists.",
      };
    }

    // ========================================================
    // PREPARE JSON
    // ========================================================

    const prismaContent = toPrismaJson(content);

    // ========================================================
    // UPDATE PROJECT
    // ========================================================

    const updatedProject = await prisma.project.update({
      where: {
        id: projectId,
      },

      data: {
        title,
        shortDescription,
        slug,

        categoryId,

        content: prismaContent,

        bannerImage,

        liveUrl: cleanOptionalUrl(liveUrl),
        githubUrl: cleanOptionalUrl(githubUrl),
        demoUrl: cleanOptionalUrl(demoUrl),
        caseStudyUrl: cleanOptionalUrl(caseStudyUrl),

        technologies,

        featured: Boolean(input?.featured),
        published: Boolean(input?.published),

        sortOrder,

        startedAt: startedAt ? new Date(`${startedAt}T00:00:00.000Z`) : null,

        completedAt: completedAt ? new Date(`${completedAt}T00:00:00.000Z`) : null,

        ogImageUrl: cleanOptionalUrl(ogImage),
      },

      select: {
        id: true,
        slug: true,
        title: true,
      },
    });

    // ========================================================
    // CACHE INVALIDATION
    // ========================================================

    // Project collection.
    revalidateTag(CACHE_TAGS.projects, "max");

    // Individual project.
    revalidateTag(CACHE_TAGS.project(projectId), "max");

    // Old public slug.
    if (existingProject.slug) {
      revalidatePath(`/projects/${existingProject.slug}`);
    }

    // New public slug.
    revalidatePath(`/projects/${updatedProject.slug}`);

    // Public projects listing.
    revalidatePath("/projects");

    // Dashboard project listing.
    revalidatePath("/dashboard/projects");

    // Dashboard project page.
    // revalidatePath(`/dashboard/projects/${projectId}`);

    // Edit page.
    revalidatePath(`/dashboard/projects/${projectId}/edit`);

    // Category pages can contain project listings.
    revalidateTag(CACHE_TAGS.categories, "max");

    // ========================================================
    // SUCCESS
    // ========================================================

    return {
      success: true,
      data: {
        project: updatedProject,
      },
    };
  } catch (error) {
    console.error("[updateProjectAction] Failed to update project:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Unique constraint.
      if (error.code === "P2002") {
        return {
          success: false,
          error: "A project with this slug already exists for your account.",
        };
      }

      // Record not found.
      if (error.code === "P2025") {
        return {
          success: false,
          error: "Project could not be found.",
        };
      }
    }

    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Something went wrong while updating the project.",
    };
  }
}
