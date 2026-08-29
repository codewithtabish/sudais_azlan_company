import { z } from "zod";

/**
 * EditorJS content validation.
 *
 * We intentionally keep this flexible because EditorJS blocks can come
 * from many different tools/plugins.
 */
const projectContentSchema = z
  .object({
    time: z.number().optional(),
    blocks: z.array(z.any()).default([]),
    version: z.string().optional(),
  })
  .passthrough();

const optionalUrlSchema = z
  .string()
  .trim()
  .url("Please enter a valid URL.")
  .or(z.literal(""))
  .optional();

const optionalStringArraySchema = z.array(z.string().trim().min(1)).default([]);

export const createProjectSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Project title is required.")
    .max(200, "Project title must be 200 characters or less."),

  shortDescription: z
    .string()
    .trim()
    .min(1, "Short description is required.")
    .max(500, "Short description must be 500 characters or less."),

  /**
   * Optional from the client because the server can safely generate it
   * from the title.
   */
  slug: z.string().trim().max(200).optional().or(z.literal("")),

  categoryId: z.string().trim().min(1, "Project category is required."),

  content: projectContentSchema,

  bannerImage: z.string().trim().url("Banner image must be a valid URL."),

  ogImage: z.string().trim().url("OG image must be a valid URL.").optional().or(z.literal("")),

  liveUrl: optionalUrlSchema,

  githubUrl: optionalUrlSchema,

  demoUrl: optionalUrlSchema,

  caseStudyUrl: optionalUrlSchema,

  technologies: optionalStringArraySchema,

  featured: z.boolean().default(false),

  published: z.boolean().default(false),

  sortOrder: z.number().int().min(0).default(0),

  startedAt: z.string().trim().optional().or(z.literal("")),

  completedAt: z.string().trim().optional().or(z.literal("")),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;

export type ProjectSeoData = {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  summary: string;
};

export type CreateProjectSuccess = {
  success: true;
  data: {
    project: {
      id: string;
      title: string;
      slug: string;
      shortDescription: string;
      featured: boolean;
      published: boolean;
      createdAt: Date;
    };
    seo: ProjectSeoData;
    aiGenerated: {
      keywords: string[];
      summary: string;
    };
  };
};

export type CreateProjectError = {
  success: false;
  error: string;
  fieldErrors?: Record<string, string[]>;
};

export type CreateProjectResult = CreateProjectSuccess | CreateProjectError;
