"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath, revalidateTag } from "next/cache";

import { CACHE_TAGS } from "@/lib/cache-key";
import prisma from "@/lib/prisma-client";

export type DeleteProjectCategoryResult =
  | {
      success: true;
      categoryId: string;
    }
  | {
      success: false;
      error: string;
    };

function isPrismaKnownRequestError(error: unknown): error is {
  code: string;
} {
  if (typeof error !== "object" || error === null) {
    return false;
  }

  return "code" in error;
}

export async function deleteProjectCategoryAction(
  categoryId: string,
): Promise<DeleteProjectCategoryResult> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return {
        success: false,
        error: "You must be signed in to delete a project category.",
      };
    }

    if (!categoryId || typeof categoryId !== "string") {
      return {
        success: false,
        error: "Invalid project category.",
      };
    }

    const dbUser = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
      select: {
        role: true,
      },
    });

    if (!dbUser || dbUser.role !== "ADMIN") {
      return {
        success: false,
        error: "You are not authorized to delete project categories.",
      };
    }

    const category = await prisma.category.findUnique({
      where: {
        id: categoryId,
      },
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            projects: true,
          },
        },
      },
    });

    if (!category) {
      return {
        success: false,
        error: "Project category not found.",
      };
    }

    if (category._count.projects > 0) {
      return {
        success: false,
        error: `Cannot delete "${category.name}" because it is assigned to ${category._count.projects} ${
          category._count.projects === 1 ? "project" : "projects"
        }.`,
      };
    }

    await prisma.category.delete({
      where: {
        id: category.id,
      },
    });

    revalidateTag(CACHE_TAGS.categories, "max");
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/project-categories");
    revalidatePath("/");

    return {
      success: true,
      categoryId: category.id,
    };
  } catch (error) {
    console.error("[deleteProjectCategory] Error:", error);

    if (isPrismaKnownRequestError(error)) {
      if (error.code === "P2025") {
        return {
          success: false,
          error: "Project category not found.",
        };
      }

      if (error.code === "P2003") {
        return {
          success: false,
          error: "This category cannot be deleted because it is being used by a project.",
        };
      }
    }

    return {
      success: false,
      error: "Unable to delete the project category. Please try again.",
    };
  }
}
