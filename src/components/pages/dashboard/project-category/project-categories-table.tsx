"use client";

import { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from "react";

import { Edit, FolderOpen, Loader2, MoreHorizontal, Plus, RefreshCw, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { deleteProjectCategoryAction } from "@/app/actions/project/delete-project-category-action";
import {
  getAllProjectCategoriesAction,
  type ProjectCategoryListItem,
} from "@/app/actions/project/get-all-category-action";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export interface ProjectCategoriesTableRef {
  refresh: () => Promise<void>;
}

interface ProjectCategoriesTableProps {
  initialCategories?: ProjectCategoryListItem[];
  onCreateCategory?: () => void;
  onEditCategory?: (category: ProjectCategoryListItem) => void;
}

export const ProjectCategoriesTable = forwardRef<
  ProjectCategoriesTableRef,
  ProjectCategoriesTableProps
>(function ProjectCategoriesTable({ initialCategories, onCreateCategory, onEditCategory }, ref) {
  /*
   * IMPORTANT:
   *
   * Do not default initialCategories to [] and then assume
   * the server provided data.
   *
   * If initialCategories is missing/empty, we explicitly load
   * the current database data from the server action.
   */
  const [categories, setCategories] = useState<ProjectCategoryListItem[]>(initialCategories ?? []);

  const [isLoading, setIsLoading] = useState(!initialCategories);

  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(null);

  const [categoryToDelete, setCategoryToDelete] = useState<ProjectCategoryListItem | null>(null);

  /*
   * Load categories from the database.
   */
  const loadCategories = useCallback(async () => {
    try {
      setIsLoading(true);

      console.log("[ProjectCategoriesTable] Loading categories...");

      const result = await getAllProjectCategoriesAction();

      console.log("[ProjectCategoriesTable] Server action result:", result);

      if (!result.success) {
        toast.error("Unable to load categories", {
          description: result.error,
        });

        return;
      }

      console.log("[ProjectCategoriesTable] Categories received:", result.categories.length);

      setCategories(result.categories);
    } catch (error) {
      console.error("[ProjectCategoriesTable] Load error:", error);

      toast.error("Something went wrong", {
        description: "Unable to load project categories.",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  /*
   * Expose refresh() to the parent.
   */
  useImperativeHandle(
    ref,
    () => ({
      refresh: loadCategories,
    }),
    [loadCategories],
  );

  /*
   * IMPORTANT:
   *
   * If the Server Component did not provide categories,
   * fetch them automatically when this Client Component mounts.
   *
   * This fixes the situation where:
   *
   * initialCategories = []
   *
   * while the database actually contains categories.
   */
  useEffect(() => {
    if (initialCategories === undefined || initialCategories.length === 0) {
      void loadCategories();
    }
  }, [initialCategories, loadCategories]);

  /*
   * Delete category.
   */
  const handleDelete = async () => {
    if (!categoryToDelete || deletingCategoryId) {
      return;
    }

    const category = categoryToDelete;

    try {
      setDeletingCategoryId(category.id);

      const result = await deleteProjectCategoryAction(category.id);

      if (!result.success) {
        toast.error("Unable to delete category", {
          description: result.error,
        });

        return;
      }

      /*
       * Remove immediately from the UI.
       */
      setCategories((currentCategories) =>
        currentCategories.filter((item) => item.id !== category.id),
      );

      setCategoryToDelete(null);

      toast.success("Category deleted", {
        description: `"${category.name}" was deleted successfully.`,
      });

      /*
       * Fetch again so the client is guaranteed to match
       * the database.
       */
      await loadCategories();
    } catch (error) {
      console.error("[ProjectCategoriesTable] Delete error:", error);

      toast.error("Something went wrong", {
        description: "Unable to delete the project category.",
      });
    } finally {
      setDeletingCategoryId(null);
    }
  };

  /*
   * Format created date.
   */
  const formatDate = (date: Date | string) => {
    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "—";
    }

    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(parsedDate);
  };

  /*
   * Initial loading state.
   */
  if (isLoading && categories.length === 0) {
    return (
      <div className="rounded-xl border bg-background shadow-sm">
        <div className="flex min-h-[320px] items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-sm text-muted-foreground">
            <Loader2 className="size-5 animate-spin" aria-hidden="true" />

            <span>Loading categories...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-xl border bg-background shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 border-b px-6 py-5">
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-foreground">Project categories</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Manage the categories used to organize your portfolio projects.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {/* Refresh */}
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => void loadCategories()}
              disabled={isLoading}
              aria-label="Refresh categories"
              title="Refresh categories"
            >
              <RefreshCw
                className={isLoading ? "size-4 animate-spin" : "size-4"}
                aria-hidden="true"
              />
            </Button>

            {/* Create */}
            {onCreateCategory && (
              <Button type="button" onClick={onCreateCategory}>
                <Plus className="size-4" aria-hidden="true" />
                Add category
              </Button>
            )}
          </div>
        </div>

        {/* Refresh indicator */}
        {isLoading && categories.length > 0 && (
          <div className="flex items-center gap-2 border-b bg-muted/20 px-6 py-2.5 text-xs text-muted-foreground">
            <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
            Refreshing categories...
          </div>
        )}

        {/* Empty state */}
        {!isLoading && categories.length === 0 ? (
          <div className="flex min-h-[320px] flex-col items-center justify-center px-6 text-center">
            <div className="mb-4 flex size-12 items-center justify-center rounded-full border bg-muted/40">
              <FolderOpen className="size-5 text-muted-foreground" aria-hidden="true" />
            </div>

            <h3 className="text-sm font-semibold text-foreground">No categories yet</h3>

            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              Create your first project category to start organizing your portfolio projects.
            </p>

            <div className="mt-5 flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => void loadCategories()}
                disabled={isLoading}
              >
                <RefreshCw className="size-4" aria-hidden="true" />
                Refresh
              </Button>

              {onCreateCategory && (
                <Button type="button" onClick={onCreateCategory}>
                  <Plus className="size-4" aria-hidden="true" />
                  Create category
                </Button>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Table */}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="px-6">Category</TableHead>

                    <TableHead>Slug</TableHead>

                    <TableHead>Projects</TableHead>

                    <TableHead>Created</TableHead>

                    <TableHead className="w-[140px] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {categories.map((category) => {
                    const isDeleting = deletingCategoryId === category.id;

                    return (
                      <TableRow key={category.id}>
                        {/* Category */}
                        <TableCell className="px-6">
                          <div className="flex items-center gap-3">
                            <div className="flex size-9 shrink-0 items-center justify-center rounded-md border bg-muted/30">
                              <FolderOpen
                                className="size-4 text-muted-foreground"
                                aria-hidden="true"
                              />
                            </div>

                            <div className="min-w-0">
                              <p className="truncate font-medium text-foreground">
                                {category.name}
                              </p>

                              <p className="truncate text-xs text-muted-foreground">
                                {category.id}
                              </p>
                            </div>
                          </div>
                        </TableCell>

                        {/* Slug */}
                        <TableCell>
                          <code className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
                            {category.slug}
                          </code>
                        </TableCell>

                        {/* Projects */}
                        <TableCell>
                          <Badge variant="secondary">
                            {category.projectCount}{" "}
                            {category.projectCount === 1 ? "project" : "projects"}
                          </Badge>
                        </TableCell>

                        {/* Created */}
                        <TableCell className="whitespace-nowrap text-muted-foreground">
                          {formatDate(category.createdAt)}
                        </TableCell>

                        {/* Actions */}
                        <TableCell>
                          <div className="flex items-center justify-end gap-1">
                            {/* Edit */}
                            {onEditCategory && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                disabled={isDeleting}
                                aria-label={`Edit ${category.name}`}
                                title="Edit category"
                                onClick={() => onEditCategory(category)}
                              >
                                <Edit className="size-4" aria-hidden="true" />
                              </Button>
                            )}

                            {/* Delete */}
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              disabled={isDeleting}
                              aria-label={`Delete ${category.name}`}
                              title="Delete category"
                              onClick={() => setCategoryToDelete(category)}
                            >
                              {isDeleting ? (
                                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                              ) : (
                                <Trash2 className="size-4" aria-hidden="true" />
                              )}
                            </Button>

                            {/* More */}
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              disabled
                              aria-label="More actions"
                              title="More actions"
                            >
                              <MoreHorizontal className="size-4" aria-hidden="true" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t px-6 py-4">
              <p className="text-xs text-muted-foreground">
                {categories.length} {categories.length === 1 ? "category" : "categories"} total
              </p>

              {isLoading && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Loader2 className="size-3 animate-spin" aria-hidden="true" />
                  Updating...
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Delete confirmation */}
      <AlertDialog
        open={Boolean(categoryToDelete)}
        onOpenChange={(open) => {
          if (!open && !deletingCategoryId) {
            setCategoryToDelete(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete project category?</AlertDialogTitle>

            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-medium text-foreground">
                &quot;{categoryToDelete?.name}&quot;
              </span>
              ?<span className="mt-2 block">This action cannot be undone.</span>
              {categoryToDelete && categoryToDelete.projectCount > 0 && (
                <span className="mt-2 block">
                  This category currently has{" "}
                  <span className="font-medium text-foreground">
                    {categoryToDelete.projectCount}
                  </span>{" "}
                  associated {categoryToDelete.projectCount === 1 ? "project" : "projects"} and
                  cannot be deleted.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={Boolean(deletingCategoryId)}>Cancel</AlertDialogCancel>

            <AlertDialogAction
              disabled={
                Boolean(deletingCategoryId) ||
                Boolean(categoryToDelete && categoryToDelete.projectCount > 0)
              }
              onClick={(event) => {
                event.preventDefault();
                void handleDelete();
              }}
            >
              {deletingCategoryId ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="size-4" aria-hidden="true" />
                  Delete category
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
});

ProjectCategoriesTable.displayName = "ProjectCategoriesTable";
