"use server";

import { cacheLife, cacheTag } from "next/cache";

import { CACHE_TAGS } from "@/lib/cache-key";
import prisma from "@/lib/prisma-client";

export type ProjectCategoryListItem = {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
  projectCount: number;
};

export type GetAllProjectCategoriesResult =
  | {
      success: true;
      categories: ProjectCategoryListItem[];
    }
  | {
      success: false;
      error: string;
    };

async function getCachedProjectCategories(): Promise<ProjectCategoryListItem[]> {
  "use cache";

  cacheLife("max");
  cacheTag(CACHE_TAGS.categories);

  const categories = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      createdAt: true,
      updatedAt: true,

      _count: {
        select: {
          projects: true,
        },
      },
    },

    orderBy: {
      name: "asc",
    },
  });

  return categories.map((category) => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
    projectCount: category._count.projects,
  }));
}

export async function getAllProjectCategoriesAction(): Promise<GetAllProjectCategoriesResult> {
  try {
    const categories = await getCachedProjectCategories();

    console.log("[getAllProjectCategories] Categories:", categories.length);

    return {
      success: true,
      categories,
    };
  } catch (error) {
    console.error("[getAllProjectCategories] Error:", error);

    return {
      success: false,
      error: "Failed to load project categories.",
    };
  }
}
