import { z } from "zod";

export const projectCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Category name must be at least 2 characters.")
    .max(100, "Category name must be 100 characters or fewer.")
    .refine(
      (value) => /[\p{L}\p{N}]/u.test(value),
      "Category name must contain at least one letter or number.",
    ),
});

export type ProjectCategoryInput = z.infer<typeof projectCategorySchema>;
