"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { LayoutGrid, List, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { HomeBlogListItem } from "@/app/actions/blogs/get-featured-blogs";

interface Props {
  blogs: HomeBlogListItem[];
}

export default function LandingArticlesList({ blogs }: Props) {
  const [view, setView] = useState<"grid" | "list">("grid");

  if (!blogs || blogs.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Latest Articles</h2>
            <p className="mt-3 text-muted-foreground max-w-xl">
              Insights on AI, software engineering, and building products that matter.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* View Toggle */}
            <div className="flex items-center border border-border rounded-lg p-1 bg-background">
              <button
                onClick={() => setView("grid")}
                className={cn(
                  "p-2 rounded-md transition-colors",
                  view === "grid"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <LayoutGrid className="size-4" />
              </button>
              <button
                onClick={() => setView("list")}
                className={cn(
                  "p-2 rounded-md transition-colors",
                  view === "list"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <List className="size-4" />
              </button>
            </div>

            {/* All Blogs CTA */}
            <Link
              href="https://insider.sudaisazlan.com"
              target="_blank"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              All Blogs
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>

        {/* ========== GRID VIEW ========== */}
        {view === "grid" && (
          <div className="space-y-8">
            {/* First Row - 2 items */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {blogs.slice(0, 2).map((blog) => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </div>

            {/* Second Row - 1 centered item */}
            {blogs[2] && (
              <div className="flex justify-center">
                <div className="w-full max-w-2xl">
                  <BlogCard blog={blogs[2]} />
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========== LIST VIEW ========== */}
        {view === "list" && (
          <div className="space-y-6">
            {blogs.map((blog) => (
              <BlogListItem key={blog.id} blog={blog} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Blog Card (Grid)                                                   */
/* ------------------------------------------------------------------ */

function BlogCard({ blog }: { blog: HomeBlogListItem }) {
  const href = `https://insider.sudaisazlan.com/${blog.category.slug}/${blog.subcategory.slug}/${blog.slug}`;

  return (
    <Link
      href={href}
      target="_blank"
      className="group block overflow-hidden rounded-2xl border border-border bg-card hover:shadow-xl transition-all duration-300"
    >
      <div className="relative aspect-16/10 overflow-hidden">
        <Image
          src={blog.bannerImage}
          alt={blog.bannerImageAlt || blog.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      <div className="p-5 sm:p-6 space-y-3">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="font-medium text-primary">{blog.category.name}</span>
          <span>•</span>
          <span>{blog.subcategory.name}</span>
        </div>

        <h3 className="text-lg sm:text-xl font-semibold leading-snug group-hover:text-primary transition-colors line-clamp-2">
          {blog.title}
        </h3>

        {blog.shortDescription && (
          <p className="text-sm text-muted-foreground line-clamp-2">{blog.shortDescription}</p>
        )}

        <div className="flex items-center justify-between pt-2 text-xs text-muted-foreground">
          <span>
            {blog.author.firstName} {blog.author.lastName}
          </span>
          {blog.readingTime && <span>{blog.readingTime} min read</span>}
        </div>
      </div>
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/*  Blog List Item                                                     */
/* ------------------------------------------------------------------ */

function BlogListItem({ blog }: { blog: HomeBlogListItem }) {
  const href = `https://insider.sudaisazlan.com/${blog.category.slug}/${blog.subcategory.slug}/${blog.slug}`;

  return (
    <Link
      href={href}
      target="_blank"
      className="group flex flex-col sm:flex-row gap-5 p-4 rounded-xl border border-border hover:bg-muted/40 transition-colors"
    >
      <div className="relative w-full sm:w-48 h-36 sm:h-32 shrink-0 overflow-hidden rounded-lg">
        <Image
          src={blog.bannerImage}
          alt={blog.bannerImageAlt || blog.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="200px"
        />
      </div>

      <div className="flex flex-col justify-center space-y-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="font-medium text-primary">{blog.category.name}</span>
          <span>•</span>
          <span>{blog.subcategory.name}</span>
        </div>

        <h3 className="text-lg font-semibold group-hover:text-primary transition-colors line-clamp-2">
          {blog.title}
        </h3>

        {blog.shortDescription && (
          <p className="text-sm text-muted-foreground line-clamp-2">{blog.shortDescription}</p>
        )}
      </div>
    </Link>
  );
}
