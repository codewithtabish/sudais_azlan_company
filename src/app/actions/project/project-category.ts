"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath, revalidateTag } from "next/cache";

import { projectCategorySchema } from "@/schemas/project-category-schema";
import prisma from "@/lib/prisma-client";
import { createProjectCategorySlug } from "@/lib/slug";
import { CACHE_TAGS } from "@/lib/cache-key";

export type CreateProjectCategoryResult =
  | {
      success: true;
      categoryId: string;
    }
  | {
      success: false;
      error: string;
    };

function isPrismaUniqueConstraintError(error: unknown): error is { code: "P2002" } {
  if (typeof error !== "object" || error === null) {
    return false;
  }

  if (!("code" in error)) {
    return false;
  }

  return error.code === "P2002";
}

export async function createProjectCategoryAction(
  formData: unknown,
): Promise<CreateProjectCategoryResult> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return {
        success: false,
        error: "You must be signed in to create a project category.",
      };
    }

    const dbUser = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });

    if (!dbUser || dbUser.role !== "ADMIN") {
      return {
        success: false,
        error: "You are not authorized to create project categories.",
      };
    }

    const parsed = projectCategorySchema.safeParse(formData);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message;

      return {
        success: false,
        error: firstError ?? "Please provide a valid category name.",
      };
    }

    const { name } = parsed.data;

    const slug = createProjectCategorySlug(name);

    if (!slug) {
      return {
        success: false,
        error: "The category name could not be converted into a valid slug.",
      };
    }

    const existingCategory = await prisma.category.findUnique({
      where: {
        slug,
      },
    });

    if (existingCategory) {
      return {
        success: false,
        error: "A project category with this name already exists.",
      };
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
      },
    });
    revalidateTag(CACHE_TAGS.categories, "max");
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/project-categories");

    return {
      success: true,
      categoryId: category.id,
    };
  } catch (error) {
    if (isPrismaUniqueConstraintError(error)) {
      return {
        success: false,
        error: "A project category with this name already exists.",
      };
    }

    console.error("[createProjectCategory]", error);

    return {
      success: false,
      error: "Unable to create the project category. Please try again.",
    };
  }
}
