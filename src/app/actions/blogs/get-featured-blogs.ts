"use server";

export type HomeBlogListItem = {
  id: string;
  title: string;
  slug: string;
  shortDescription: string | null;
  type: string;
  bannerImage: string;
  bannerImageAlt: string | null;
  featured: boolean;
  publishedAt: string | null;
  readingTime: number | null;
  author: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    imageUrl: string | null;
  };
  category: {
    id: string;
    name: string;
    slug: string;
  };
  subcategory: {
    id: string;
    name: string;
    slug: string;
  };
};

type GetFeaturedBlogsResult =
  { success: true; blogs: HomeBlogListItem[] } | { success: false; error: string };

export async function getFeaturedBlogsAction(): Promise<GetFeaturedBlogsResult> {
  try {
    const res = await fetch("https://insider.sudaisazlan.com/api/blogs", {
      next: { revalidate: 86400 }, // cache for 1 day
    });

    if (!res.ok) {
      throw new Error("Failed to fetch blogs");
    }

    const data = await res.json();

    if (!data.success || !Array.isArray(data.blogs)) {
      throw new Error("Invalid response");
    }

    // Get latest 3 featured blogs (or latest 3 if not enough featured)
    const featured = data.blogs.filter((blog: HomeBlogListItem) => blog.featured).slice(0, 3);

    const blogs = featured.length >= 3 ? featured : data.blogs.slice(0, 3);

    return {
      success: true,
      blogs,
    };
  } catch (error) {
    console.error("[getFeaturedBlogsAction]", error);
    return {
      success: false,
      error: "Failed to load featured blogs",
    };
  }
}
