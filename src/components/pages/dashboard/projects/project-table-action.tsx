"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { deleteProjectAction } from "@/app/actions/project/delete-project-action";

import { Button } from "@/components/ui/button";

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

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// ============================================================
// TYPES
// ============================================================

type ProjectTableActionsProps = {
  projectId: string;
  projectSlug: string;
  projectTitle: string;
};

// ============================================================
// COMPONENT
// ============================================================

export default function ProjectTableActions({
  projectId,

  projectTitle,
}: ProjectTableActionsProps) {
  const router = useRouter();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  // ==========================================================
  // DELETE
  // ==========================================================

  const handleDelete = () => {
    if (!projectId) {
      toast.error("Project ID is missing.");
      return;
    }

    startTransition(async () => {
      try {
        const result = await deleteProjectAction(projectId);

        if (!result.success) {
          toast.error(result.error || "Failed to delete project.");
          return;
        }

        toast.success("Project deleted successfully.");

        setIsDeleteDialogOpen(false);

        router.refresh();
      } catch (error) {
        console.error("[ProjectTableActions] Delete project error:", error);

        toast.error("Something went wrong while deleting the project.");
      }
    });
  };

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <>
      {/* ======================================================
          ACTION MENU
      ====================================================== */}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8"
            aria-label={`Actions for ${projectTitle}`}
            disabled={isPending}
          >
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-44">
          {/* UPDATE */}

          <DropdownMenuItem asChild>
            <Link href={`/dashboard/projects/${projectId}/edit`}>
              <Pencil className="size-4" />
              Update
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* DELETE */}

          <DropdownMenuItem
            variant="destructive"
            onSelect={(event) => {
              event.preventDefault();
              setIsDeleteDialogOpen(true);
            }}
            disabled={isPending}
          >
            <Trash2 className="size-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* ======================================================
          DELETE CONFIRMATION DIALOG
      ====================================================== */}

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={(open) => {
          if (!isPending) {
            setIsDeleteDialogOpen(open);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete project?</AlertDialogTitle>

            <AlertDialogDescription>
              This will permanently delete{" "}
              <span className="font-medium text-foreground">{projectTitle}</span>
              .
              <br />
              <span className="mt-2 block">This action cannot be undone.</span>
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>

            <AlertDialogAction
              variant="destructive"
              onClick={(event) => {
                event.preventDefault();
                handleDelete();
              }}
              disabled={isPending}
            >
              {isPending ? "Deleting..." : "Delete Project"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
