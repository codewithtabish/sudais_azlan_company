// src/app/actions/project/get-project-by-id-action.ts

"use server";

import { auth } from "@clerk/nextjs/server";
import { cacheLife, cacheTag } from "next/cache";

import { CACHE_TAGS } from "@/lib/cache-key";
import prisma from "@/lib/prisma-client";

// ============================================================
// TYPES
// ============================================================

export type ProjectContent = {
  time?: number;
  blocks: unknown[];
  version?: string;
  [key: string]: unknown;
};

export type ProjectEditorItem = {
  id: string;
  title: string;
  shortDescription: string | null;
  slug: string;

  categoryId: string;

  content: ProjectContent | null;

  bannerImage: string | null;
  ogImageUrl: string | null;

  liveUrl: string | null;
  githubUrl: string | null;
  demoUrl: string | null;
  caseStudyUrl: string | null;

  technologies: string[];

  featured: boolean;
  published: boolean;
  sortOrder: number;

  startedAt: Date | null;
  completedAt: Date | null;

  createdAt: Date;
  updatedAt: Date;
};

export type GetProjectByIdResult =
  | {
      success: true;
      project: ProjectEditorItem;
    }
  | {
      success: false;
      error: string;
    };

// ============================================================
// CONTENT NORMALIZER
// ============================================================

function normalizeProjectContent(value: unknown): ProjectContent | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  const content = value as Record<string, unknown>;

  if (!Array.isArray(content.blocks)) {
    return null;
  }

  return {
    ...content,
    blocks: content.blocks,
  };
}

// ============================================================
// CACHED PROJECT
// ============================================================

async function getCachedProjectById(
  projectId: string,
  userId: string,
): Promise<ProjectEditorItem | null> {
  "use cache";

  cacheLife("max");

  cacheTag(CACHE_TAGS.project(projectId));

  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      userId,
    },

    select: {
      id: true,
      title: true,
      shortDescription: true,
      slug: true,

      categoryId: true,

      bannerImage: true,
      ogImageUrl: true,

      liveUrl: true,
      githubUrl: true,
      demoUrl: true,
      caseStudyUrl: true,

      technologies: true,

      content: true,

      featured: true,
      published: true,
      sortOrder: true,

      startedAt: true,
      completedAt: true,

      createdAt: true,
      updatedAt: true,
    },
  });

  if (!project) {
    return null;
  }

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

    featured: project.featured,
    published: project.published,
    sortOrder: project.sortOrder,

    startedAt: project.startedAt,
    completedAt: project.completedAt,

    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
  };
}

// ============================================================
// GET PROJECT BY ID
// ============================================================

export async function getProjectByIdAction(projectId: string): Promise<GetProjectByIdResult> {
  try {
    // ========================================================
    // VALIDATE PROJECT ID
    // ========================================================

    const id = projectId?.trim();

    if (!id) {
      return {
        success: false,
        error: "Project ID is required.",
      };
    }

    // ========================================================
    // AUTHENTICATION
    // ========================================================

    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return {
        success: false,
        error: "Unauthorized. Please sign in.",
      };
    }

    // ========================================================
    // FIND CURRENT USER
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
        error: "User not found in database.",
      };
    }

    // ========================================================
    // FETCH PROJECT
    // ========================================================

    const project = await getCachedProjectById(id, user.id);

    if (!project) {
      return {
        success: false,
        error: "Project not found.",
      };
    }

    // ========================================================
    // SUCCESS
    // ========================================================

    return {
      success: true,
      project,
    };
  } catch (error) {
    console.error("[getProjectByIdAction] Error:", error);

    return {
      success: false,
      error: "Failed to load project.",
    };
  }
}
