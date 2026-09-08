import { Suspense } from "react";
import LandingArticlesList from "./landing-articles-list";
import { getFeaturedBlogsAction } from "@/app/actions/blogs/get-featured-blogs";

async function FeaturedBlogsContent() {
  const result = await getFeaturedBlogsAction();

  if (!result.success || !result.blogs.length) {
    return null;
  }

  return <LandingArticlesList blogs={result.blogs} />;
}

function ArticlesFallback() {
  return (
    <section className="w-full py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="h-10 w-64 bg-muted animate-pulse rounded mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-80 bg-muted animate-pulse rounded-2xl" />
          <div className="h-80 bg-muted animate-pulse rounded-2xl" />
        </div>
        <div className="mt-8 flex justify-center">
          <div className="h-80 w-full max-w-2xl bg-muted animate-pulse rounded-2xl" />
        </div>
      </div>
    </section>
  );
}

export default function FeaturedBlogs() {
  return (
    <Suspense fallback={<ArticlesFallback />}>
      <FeaturedBlogsContent />
    </Suspense>
  );
}
