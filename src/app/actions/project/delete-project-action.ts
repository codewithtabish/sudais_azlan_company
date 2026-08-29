"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath, revalidateTag } from "next/cache";

import { CACHE_TAGS } from "@/lib/cache-key";
import prisma from "@/lib/prisma-client";

// ============================================================
// TYPES
// ============================================================

export type DeleteProjectResult =
  | {
      success: true;
      projectId: string;
      slug: string;
    }
  | {
      success: false;
      error: string;
    };

// ============================================================
// DELETE PROJECT
// ============================================================

export async function deleteProjectAction(projectId: string): Promise<DeleteProjectResult> {
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
    // FIND PROJECT
    // ========================================================
    //
    // We intentionally check userId here.
    //
    // This ensures that an authenticated user can only delete
    // their own project.
    //
    // ========================================================

    const project = await prisma.project.findFirst({
      where: {
        id,
        userId: user.id,
      },
      select: {
        id: true,
        slug: true,
      },
    });

    if (!project) {
      return {
        success: false,
        error: "Project not found.",
      };
    }

    // ========================================================
    // DELETE PROJECT
    // ========================================================

    await prisma.project.delete({
      where: {
        id: project.id,
      },
    });

    // ========================================================
    // INVALIDATE PROJECT CACHE
    // ========================================================
    //
    // Use the EXISTING project cache tag.
    //
    // We do NOT create a projectSlug cache tag.
    //
    // ========================================================

    revalidateTag(CACHE_TAGS.project(project.id), "max");

    // ========================================================
    // INVALIDATE PROJECT LIST CACHE
    // ========================================================

    revalidateTag(CACHE_TAGS.projects, "max");

    // ========================================================
    // INVALIDATE ROUTES
    // ========================================================

    /**
     * Dashboard project listing.
     */
    revalidatePath("/dashboard/projects");
    revalidatePath("/projects");

    /**
     * Deleted project's edit page.
     */
    revalidatePath(`/dashboard/projects/${project.id}/edit`);

    /**
     * Public project page.
     *
     * Assuming your public project route is:
     *
     * /projects/[slug]
     */
    revalidatePath(`/projects/${project.slug}`);

    // ========================================================
    // SUCCESS
    // ========================================================

    return {
      success: true,
      projectId: project.id,
      slug: project.slug,
    };
  } catch (error) {
    console.error("[deleteProjectAction] Error:", error);

    return {
      success: false,
      error: "Failed to delete project. Please try again.",
    };
  }
}
