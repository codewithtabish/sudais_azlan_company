"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { OpenAI } from "openai";

import { CACHE_TAGS } from "@/lib/cache-key";
import prisma from "@/lib/prisma-client";
import { createProjectCategorySlug } from "@/lib/slug";
import {
  createProjectSchema,
  type CreateProjectInput,
  type CreateProjectResult,
} from "@/schemas/project-schema";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://sudaisazlan.com";

// ============================================================
// HELPERS
// ============================================================

function cleanOptionalString(value?: string | null): string | undefined {
  const cleaned = value?.trim();

  return cleaned ? cleaned : undefined;
}

/**
 * Converts EditorJS content into plain text for:
 *
 * - OpenAI SEO generation
 * - Summary generation
 * - Basic content validation
 */
function extractTextFromContent(content: any): string {
  if (!content?.blocks || !Array.isArray(content.blocks)) {
    return "";
  }

  return content.blocks
    .map((block: any) => {
      switch (block?.type) {
        case "paragraph":
        case "aitext":
        case "text":
          return block.data?.text || "";

        case "header":
          return `${"#".repeat(block.data?.level || 2)} ${block.data?.text || ""}`;

        case "list":
        case "nestedlist":
          return (block.data?.items || [])
            .map((item: any) => {
              if (typeof item === "string") {
                return item;
              }

              return item?.content || item?.text || item?.items?.join(" ") || "";
            })
            .join("\n");

        case "checklist":
          return (block.data?.items || [])
            .map((item: any) => {
              if (typeof item === "string") {
                return item;
              }

              return item?.text || item?.content || "";
            })
            .join("\n");

        case "quote":
          return `> ${block.data?.text || ""}`;

        case "warning":
          return `${block.data?.title || ""}\n${block.data?.message || ""}`;

        case "raw":
          return (block.data?.html || "")
            .replace(/<[^>]*>/g, " ")
            .replace(/\s+/g, " ")
            .trim();

        case "code":
          return block.data?.code || "";

        case "table":
          return (block.data?.content || []).flat().join(" ");

        case "delimiter":
          return "";

        case "image":
          return block.data?.caption || block.data?.file?.url || "";

        default:
          return "";
      }
    })
    .filter(Boolean)
    .join("\n\n")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Converts EditorJS content into a Prisma-compatible JSON value.
 *
 * Prisma's Json fields require InputJsonValue.
 */
function toPrismaJson(value: CreateProjectInput["content"]): any {
  return JSON.parse(JSON.stringify(value)) as any;
}

/**
 * Creates the public canonical project URL.
 *
 * Example:
 *
 * https://example.com/projects/my-awesome-project
 */
function buildProjectUrl(slug: string): string {
  const baseUrl = BASE_URL.replace(/\/+$/, "");

  return `${baseUrl}/projects/${slug}`;
}

/**
 * Generate SEO information from the actual project.
 *
 * The user's shortDescription is preserved and is NOT replaced
 * by AI.
 */
async function generateProjectSEOWithAI(params: {
  title: string;
  shortDescription: string;
  categoryName: string;
  technologies: string[];
  contentText: string;
}) {
  const { title, shortDescription, categoryName, technologies, contentText } = params;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
You are an expert technical SEO specialist.

You are generating SEO metadata for a software development project
showcase / portfolio website.

STRICT RULES:

1. NEVER change the project title.
2. NEVER invent project features that are not present in the supplied information.
3. metaTitle must be under 60 characters.
4. metaDescription must be under 160 characters.
5. Generate up to 10 highly relevant keywords.
6. summary should be 2-3 concise sentences.
7. Focus on the actual technology, purpose, and project value.
8. Return ONLY valid JSON.

JSON format:

{
  "metaTitle": "...",
  "metaDescription": "...",
  "keywords": ["...", "..."],
  "summary": "..."
}
          `.trim(),
        },
        {
          role: "user",
          content: `
Project title:

${title}

Project short description:

${shortDescription}

Category:

${categoryName}

Technologies:

${technologies.join(", ") || "Not specified"}

Project content:

${contentText.slice(0, 6000)}
          `.trim(),
        },
      ],
      temperature: 0.5,
      max_tokens: 1000,
    });

    const aiResponse = response.choices[0]?.message?.content?.trim() || "";

    /**
     * Handle responses wrapped in markdown code fences.
     */
    const cleanedResponse = aiResponse
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    const parsed = JSON.parse(cleanedResponse);

    const metaTitle =
      typeof parsed.metaTitle === "string" && parsed.metaTitle.trim()
        ? parsed.metaTitle.trim().slice(0, 60)
        : title.slice(0, 60);

    const metaDescription =
      typeof parsed.metaDescription === "string" && parsed.metaDescription.trim()
        ? parsed.metaDescription.trim().slice(0, 160)
        : shortDescription.slice(0, 160);

    const keywords = Array.isArray(parsed.keywords)
      ? parsed.keywords
          .filter(
            (keyword: unknown): keyword is string =>
              typeof keyword === "string" && keyword.trim().length > 0,
          )
          .map((keyword: string) => keyword.trim())
          .slice(0, 10)
      : [];

    const summary = typeof parsed.summary === "string" ? parsed.summary.trim() : shortDescription;

    return {
      metaTitle,
      metaDescription,
      keywords,
      summary,
    };
  } catch (error) {
    console.error("[Project SEO] OpenAI generation failed:", error);

    return {
      metaTitle: title.slice(0, 60),
      metaDescription: shortDescription.slice(0, 160),
      keywords: [
        title.toLowerCase(),
        ...technologies.slice(0, 9).map((technology) => technology.toLowerCase()),
      ].slice(0, 10),
      summary: shortDescription,
    };
  }
}

// ============================================================
// CREATE PROJECT ACTION
// ============================================================

export async function createProjectAction(data: CreateProjectInput): Promise<CreateProjectResult> {
  try {
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
    // VALIDATE INPUT
    // ========================================================

    const parsed = createProjectSchema.safeParse(data);

    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;

      return {
        success: false,
        error:
          Object.values(fieldErrors).flat().find(Boolean) ||
          "Please check the project information.",
        fieldErrors,
      };
    }

    const input = parsed.data;

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
        error: "User not found in database.",
      };
    }

    // ========================================================
    // BASIC VALIDATION
    // ========================================================

    const title = input.title.trim();
    const shortDescription = input.shortDescription.trim();

    if (!title) {
      return {
        success: false,
        error: "Project title is required.",
      };
    }

    if (!shortDescription) {
      return {
        success: false,
        error: "Project short description is required.",
      };
    }

    if (!input.categoryId) {
      return {
        success: false,
        error: "Project category is required.",
      };
    }

    if (!input.bannerImage) {
      return {
        success: false,
        error: "Project banner image is required.",
      };
    }

    if (!input.content?.blocks || input.content.blocks.length === 0) {
      return {
        success: false,
        error: "Project content cannot be empty.",
      };
    }

    // ========================================================
    // SLUG
    // ========================================================

    const requestedSlug = input.slug?.trim() || "";

    const slug = createProjectCategorySlug(requestedSlug || title);

    if (!slug) {
      return {
        success: false,
        error: "Unable to generate a valid project slug.",
      };
    }

    // ========================================================
    // CATEGORY
    // ========================================================

    const category = await prisma.category.findUnique({
      where: {
        id: input.categoryId,
      },
      select: {
        id: true,
        name: true,
        slug: true,
      },
    });

    if (!category) {
      return {
        success: false,
        error: "Selected project category does not exist.",
      };
    }

    // ========================================================
    // SLUG DUPLICATE CHECK
    //
    // Prisma schema:
    //
    // @@unique([userId, slug])
    //
    // Therefore uniqueness is per user.
    // ========================================================

    const existingProject = await prisma.project.findUnique({
      where: {
        userId_slug: {
          userId: user.id,
          slug,
        },
      },
      select: {
        id: true,
      },
    });

    if (existingProject) {
      return {
        success: false,
        error: "A project with this slug already exists. Please use a different title or slug.",
      };
    }

    // ========================================================
    // CONTENT
    // ========================================================

    const contentText = extractTextFromContent(input.content);

    if (!contentText.trim()) {
      return {
        success: false,
        error: "Project content cannot be empty.",
      };
    }

    /**
     * Convert the EditorJS object into a Prisma-compatible
     * JSON value.
     *
     * This fixes:
     *
     * Type '{ blocks: any[]; ... }' is not assignable to
     * 'NullableJsonNullValueInput | InputJsonValue'
     */
    const prismaContent = toPrismaJson(input.content);

    // ========================================================
    // TECHNOLOGIES
    // ========================================================

    const technologies = Array.from(
      new Set(input.technologies.map((technology) => technology.trim()).filter(Boolean)),
    );

    // ========================================================
    // AI SEO
    // ========================================================

    const seoData = await generateProjectSEOWithAI({
      title,
      shortDescription,
      categoryName: category.name,
      technologies,
      contentText,
    });

    // ========================================================
    // CANONICAL URL
    // ========================================================

    const canonicalUrl = buildProjectUrl(slug);

    // ========================================================
    // DATES
    // ========================================================

    const startedAt = input.startedAt?.trim() ? new Date(input.startedAt) : undefined;

    const completedAt = input.completedAt?.trim() ? new Date(input.completedAt) : undefined;

    if (startedAt && Number.isNaN(startedAt.getTime())) {
      return {
        success: false,
        error: "Invalid project start date.",
      };
    }

    if (completedAt && Number.isNaN(completedAt.getTime())) {
      return {
        success: false,
        error: "Invalid project completion date.",
      };
    }

    // ========================================================
    // CREATE PROJECT
    // ========================================================

    const project = await prisma.project.create({
      data: {
        userId: user.id,
        categoryId: category.id,

        title,
        slug,
        shortDescription,

        description: contentText || undefined,

        bannerImage: input.bannerImage,

        images: [],

        liveUrl: cleanOptionalString(input.liveUrl),
        githubUrl: cleanOptionalString(input.githubUrl),
        demoUrl: cleanOptionalString(input.demoUrl),
        caseStudyUrl: cleanOptionalString(input.caseStudyUrl),

        technologies,

        // IMPORTANT:
        // Prisma JSON field receives InputJsonValue.
        content: prismaContent,

        featured: input.featured,
        published: input.published,
        sortOrder: input.sortOrder,

        startedAt,
        completedAt,

        metaTitle: seoData.metaTitle,
        metaDescription: seoData.metaDescription,
        canonicalUrl,

        ogImageUrl: cleanOptionalString(input.ogImage) || input.bannerImage,

        keywords: seoData.keywords,
      },

      select: {
        id: true,
        title: true,
        slug: true,
        shortDescription: true,
        featured: true,
        published: true,
        createdAt: true,
      },
    });

    // ========================================================
    // CACHE REVALIDATION
    // ========================================================

    revalidatePath("/dashboard/projects");

    // Project/category related tags.
    //
    // These checks keep this action compatible with projects
    // where CACHE_TAGS has different levels of project caching.

    if ("projects" in CACHE_TAGS && typeof CACHE_TAGS.projects === "string") {
      revalidateTag(CACHE_TAGS.projects, "max");
    }

    // ========================================================
    // PUBLIC PROJECT CACHE
    // ========================================================

    if (project.published) {
      revalidatePath("/projects");
      revalidatePath(`/projects/${project.slug}`);

      // ======================================================
      // INDEXNOW
      // ======================================================

      try {
        // Add IndexNow notification here when required.
      } catch (indexNowError) {
        /**
         * IndexNow failure should NOT make project creation fail.
         */
        console.error("[Project] IndexNow notification failed:", indexNowError);
      }
    }

    // ========================================================
    // RESPONSE
    // ========================================================

    return {
      success: true,

      data: {
        project: {
          id: project.id,
          title: project.title,
          slug: project.slug,
          shortDescription: project.shortDescription || "",
          featured: project.featured,
          published: project.published,
          createdAt: project.createdAt,
        },

        seo: {
          metaTitle: seoData.metaTitle,
          metaDescription: seoData.metaDescription,
          keywords: seoData.keywords,
          summary: seoData.summary,
        },

        aiGenerated: {
          keywords: seoData.keywords,
          summary: seoData.summary,
        },
      },
    };
  } catch (error) {
    console.error("❌ Create project error:", error);

    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create project.",
    };
  }
}
