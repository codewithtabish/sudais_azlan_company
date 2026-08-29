"use client";

import { Grid3X3, List, Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type SortOption = "featured" | "newest" | "oldest" | "a-z" | "z-a";
export type FeaturedFilter = "all" | "featured" | "standard";
export type ViewMode = "grid" | "list";

type CategoryOption = {
  id: string;
  name: string;
};

type ProjectsToolbarProps = {
  search: string;
  onSearchChange: (value: string) => void;
  categoryId: string;
  onCategoryChange: (value: string) => void;
  categories: CategoryOption[];
  featuredFilter: FeaturedFilter;
  onFeaturedFilterChange: (value: FeaturedFilter) => void;
  sort: SortOption;
  onSortChange: (value: SortOption) => void;
  view: ViewMode;
  onViewChange: (value: ViewMode) => void;
  resultCount: number;
};

export default function ProjectsToolbar({
  search,
  onSearchChange,
  categoryId,
  onCategoryChange,
  categories,
  featuredFilter,
  onFeaturedFilterChange,
  sort,
  onSortChange,
  view,
  onViewChange,
  resultCount,
}: ProjectsToolbarProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {/* Search */}
        <div className="relative w-full max-w-md">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search projects..."
            className="pl-9"
            aria-label="Search projects"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <Select value={categoryId} onValueChange={onCategoryChange}>
            <SelectTrigger className="w-[160px]" aria-label="Filter by category">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={featuredFilter}
            onValueChange={(v) => onFeaturedFilterChange(v as FeaturedFilter)}
          >
            <SelectTrigger className="w-[140px]" aria-label="Filter by featured">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All projects</SelectItem>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="standard">Standard</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sort} onValueChange={(v) => onSortChange(v as SortOption)}>
            <SelectTrigger className="w-[150px]" aria-label="Sort projects">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured first</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="a-z">A – Z</SelectItem>
              <SelectItem value="z-a">Z – A</SelectItem>
            </SelectContent>
          </Select>

          {/* View toggle */}
          <div className="hidden items-center rounded-lg border border-border p-1 sm:flex">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={cn("h-8 w-8", view === "grid" && "bg-muted text-foreground")}
              onClick={() => onViewChange("grid")}
              aria-label="Grid view"
              aria-pressed={view === "grid"}
            >
              <Grid3X3 className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={cn("h-8 w-8", view === "list" && "bg-muted text-foreground")}
              onClick={() => onViewChange("list")}
              aria-label="List view"
              aria-pressed={view === "list"}
            >
              <List className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        {resultCount} {resultCount === 1 ? "project" : "projects"}
      </p>
    </div>
  );
}
