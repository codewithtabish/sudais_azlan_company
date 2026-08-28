"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";

import { projectCategorySchema } from "@/schemas/project-category-schema";
import { createProjectCategoryAction } from "@/app/actions/project/project-category";

interface CreateProjectCategoryFormProps {
  onSuccess?: () => void;
}

export function CreateProjectCategoryForm({ onSuccess }: CreateProjectCategoryFormProps) {
  const router = useRouter();

  const [name, setName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isCreating) {
      return;
    }

    const parsed = projectCategorySchema.safeParse({
      name,
    });

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message;

      toast.error("Invalid category", {
        description: firstError ?? "Please enter a valid category name.",
      });

      return;
    }

    setIsCreating(true);

    try {
      const result = await createProjectCategoryAction({
        name: parsed.data.name,
      });

      if (!result.success) {
        toast.error("Unable to create category", {
          description: result.error,
        });

        return;
      }

      const createdCategoryName = parsed.data.name;

      setName("");

      toast.success("Category created", {
        description: `"${createdCategoryName}" was added successfully.`,
      });

      /*
       * Refresh the current Next.js route so that the Server Component
       * fetches the newly-created category.
       *
       * This is NOT a full browser/F5 reload.
       * It refreshes the server-rendered data for the current route.
       */
      router.refresh();

      /*
       * Keep the existing success callback so the parent can still
       * close a dialog/modal or perform any other UI work.
       */
      onSuccess?.();
    } catch (error) {
      console.error("[CreateProjectCategoryForm]", error);

      toast.error("Something went wrong", {
        description: "Unable to create the category. Please try again.",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6" noValidate>
      <div className="space-y-2">
        <label
          htmlFor="project-category-name"
          className="text-sm font-medium leading-none text-foreground"
        >
          Category name
        </label>

        <input
          id="project-category-name"
          name="name"
          type="text"
          value={name}
          onChange={(event) => {
            setName(event.target.value);
          }}
          placeholder="e.g. Artificial Intelligence"
          autoComplete="off"
          disabled={isCreating}
          className="flex h-11 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        />

        <p className="text-sm text-muted-foreground">
          Create a category for organizing your portfolio projects.
        </p>
      </div>

      <button
        type="submit"
        disabled={isCreating}
        className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
      >
        {isCreating ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            Creating...
          </>
        ) : (
          <>
            <Plus className="size-4" aria-hidden="true" />
            Create category
          </>
        )}
      </button>
    </form>
  );
}
