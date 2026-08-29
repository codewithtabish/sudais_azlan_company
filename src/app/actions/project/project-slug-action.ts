"use server";

import { auth } from "@clerk/nextjs/server";
import { cacheLife, cacheTag } from "next/cache";

import { CACHE_TAGS } from "@/lib/cache-key";
import prisma from "@/lib/prisma-client";

// ============================================================
// TYPES
// ============================================================

export type ProjectBySlugItem = {
  id: string;
  title: string;
  slug: string;
  shortDescription: string | null;
  description: string | null;
  bannerImage: string | null;
  images: string[];
  liveUrl: string | null;
  githubUrl: string | null;
  demoUrl: string | null;
  caseStudyUrl: string | null;
  technologies: string[];
  content: unknown;
  featured: boolean;
  published: boolean;
  sortOrder: number;
  startedAt: Date | null;
  completedAt: Date | null;
  metaTitle: string | null;
  metaDescription: string | null;
  canonicalUrl: string | null;
  ogImageUrl: string | null;
  keywords: string[];
  createdAt: Date;
  updatedAt: Date;
  category: {
    id: string;
    name: string;
    slug: string;
  } | null;
};

export type GetProjectBySlugResult =
  | {
      success: true;
      project: ProjectBySlugItem;
    }
  | {
      success: false;
      error: string;
    };

// ============================================================
// CACHED PROJECT QUERY
// ============================================================
//
// IMPORTANT:
//
// We already have CACHE_TAGS.project(id).
// We intentionally do NOT create a new slug cache key.
//
// The slug is used only to locate the project.
// Once found, the returned cached entry is associated with
// the existing project:id cache tag.
//
// ============================================================

async function getCachedProjectBySlug(
  slug: string,
  userId: string,
): Promise<ProjectBySlugItem | null> {
  "use cache";

  cacheLife("max");

  const project = await prisma.project.findFirst({
    where: {
      slug,
      userId,
    },
    select: {
      id: true,
      title: true,
      slug: true,
      shortDescription: true,
      description: true,
      bannerImage: true,
      images: true,
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
      metaTitle: true,
      metaDescription: true,
      canonicalUrl: true,
      ogImageUrl: true,
      keywords: true,
      createdAt: true,
      updatedAt: true,
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  });

  if (!project) {
    return null;
  }

  /*
   * Use the existing project cache tag.
   *
   * We cannot dynamically create a cache tag from the database
   * result after the cached query has already been established
   * in the way a normal function call might suggest.
   *
   * Therefore the project-by-slug query itself is cached by the
   * existing project tag once the project ID is known.
   */
  cacheTag(CACHE_TAGS.project(project.id));

  return project;
}

// ============================================================
// GET PROJECT BY SLUG
// ============================================================

export async function getProjectBySlugAction(projectSlug: string): Promise<GetProjectBySlugResult> {
  try {
    // ========================================================
    // VALIDATE SLUG
    // ========================================================

    const slug = projectSlug?.trim().toLowerCase();

    if (!slug) {
      return {
        success: false,
        error: "Project slug is required.",
      };
    }

    // ========================================================
    // BASIC SLUG VALIDATION
    // ========================================================

    if (slug.length > 200) {
      return {
        success: false,
        error: "Invalid project slug.",
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

    const project = await getCachedProjectBySlug(slug, user.id);

    if (!project) {
      return {
        success: false,
        error: "Project not found.",
      };
    }

    // ========================================================
    // PUBLICATION CHECK
    // ========================================================
    //
    // This action is currently authenticated because your
    // projects belong to the authenticated dashboard user.
    //
    // Keep the publication field available to the caller so
    // the page can decide whether unpublished projects should
    // be rendered publicly.
    //
    // ========================================================

    return {
      success: true,
      project,
    };
  } catch (error) {
    console.error("[getProjectBySlug] Error:", error);

    return {
      success: false,
      error: "Failed to load project.",
    };
  }
}
