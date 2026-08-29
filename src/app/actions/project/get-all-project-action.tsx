// src/app/actions/(project)/get-all-projects-action.ts

"use server";

import { cacheLife, cacheTag } from "next/cache";

import { CACHE_TAGS } from "@/lib/cache-key";

import prisma from "@/lib/prisma-client";

// ============================================================
// TYPES
// ============================================================

export type ProjectCategoryListItem = {
  id: string;
  name: string;
  slug: string;
};

export type ProjectListItem = {
  id: string;
  title: string;
  slug: string;
  shortDescription: string | null;
  bannerImage: string | null;
  technologies: string[];
  featured: boolean;
  published: boolean;
  sortOrder: number;
  startedAt: Date | null;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;

  category: ProjectCategoryListItem;
};

type GetAllProjectsResult =
  | {
      success: true;
      projects: ProjectListItem[];
    }
  | {
      success: false;
      error: string;
    };

// ============================================================
// CACHED PROJECT QUERY
// ============================================================

async function getCachedProjects(): Promise<ProjectListItem[]> {
  "use cache";

  cacheLife("max");
  cacheTag(CACHE_TAGS.projects);

  const projects = await prisma.project.findMany({
    select: {
      id: true,
      title: true,
      slug: true,
      shortDescription: true,
      bannerImage: true,
      technologies: true,
      featured: true,
      published: true,
      sortOrder: true,
      startedAt: true,
      completedAt: true,
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

    orderBy: [
      {
        sortOrder: "asc",
      },
      {
        createdAt: "desc",
      },
    ],
  });

  return projects;
}

// ============================================================
// GET ALL PROJECTS ACTION
// ============================================================

export async function getAllProjectsAction(): Promise<GetAllProjectsResult> {
  try {
    const projects = await getCachedProjects();

    return {
      success: true,
      projects,
    };
  } catch (error) {
    console.error("[getAllProjects] Error:", error);

    return {
      success: false,
      error: "Failed to load projects.",
    };
  }
}
