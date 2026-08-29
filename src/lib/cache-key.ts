// Central place for cache tags used with `use cache` + `revalidateTag`.

export const CACHE_TAGS = {
  projects: "projects",
  categories: "categories",

  newsletterSubscribers: "newsletter:subscribers",

  project: (id: string) => `project:${id}`,
  category: (id: string) => `category:${id}`,
} as const;
