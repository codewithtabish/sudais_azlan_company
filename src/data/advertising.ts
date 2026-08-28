export type AdvertisingPlatform = {
  name: string;
  url: string;
  category: string;
  description: string;
};

export type AdFormat = {
  number: string;
  title: string;
  description: string;
};

export type ProcessStep = {
  step: string;
  title: string;
  text: string;
};

export const PLATFORMS: AdvertisingPlatform[] = [
  {
    name: "Alentah",
    url: "https://www.alentah.com/",
    category: "Article / Content Platform",
    description:
      "A publishing destination for articles, ideas, and practical knowledge. Readers come for clarity on technology, products, and the work that shapes digital systems.",
  },
  {
    name: "blogs.sudaisazlan.com",
    url: "https://blogs.sudaisazlan.com",
    category: "Article / Content Platform",
    description:
      "An editorial space focused on engineering notes, product thinking, AI systems, and long-form writing for people who build.",
  },
];

export const AD_FORMATS: AdFormat[] = [
  {
    number: "01",
    title: "Sponsored Content",
    description:
      "Relevant sponsored articles or editorial placements where the message fits the platform’s context.",
  },
  {
    number: "02",
    title: "Display Placements",
    description: "Advertising placements across applicable products and content surfaces.",
  },
  {
    number: "03",
    title: "Product Promotion",
    description:
      "Promotion of relevant products, applications, tools, or services to an engaged audience.",
  },
  {
    number: "04",
    title: "Brand Partnerships",
    description: "Custom collaborations designed around a specific campaign or product story.",
  },
  {
    number: "05",
    title: "Custom Campaigns",
    description:
      "A tailored advertising arrangement based on your goals, audience, and preferred platforms.",
  },
];

export const PROCESS_STEPS: ProcessStep[] = [
  {
    step: "01",
    title: "Tell us about your brand",
    text: "Share what you build and who you want to reach.",
  },
  {
    step: "02",
    title: "Share your campaign goals",
    text: "Clarify the outcome you’re aiming for and any constraints.",
  },
  {
    step: "03",
    title: "We review the opportunity",
    text: "We assess fit with our platforms and audience context.",
  },
  {
    step: "04",
    title: "We discuss available placements",
    text: "We outline realistic options and how they would appear.",
  },
  {
    step: "05",
    title: "We agree on the campaign",
    text: "Scope, placement, and timeline are confirmed together.",
  },
  {
    step: "06",
    title: "Campaign goes live",
    text: "The placement is published and the work begins.",
  },
];

export const AUDIENCE_CATEGORIES = [
  "SaaS",
  "AI Products",
  "Developer Tools",
  "Startups",
  "Technology",
  "Digital Products",
  "Software",
  "Education",
  "Productivity",
  "Services",
] as const;

export const AD_INTERESTS = [
  "Sponsored Content",
  "Display Advertising",
  "Product Promotion",
  "Brand Partnership",
  "Custom Campaign",
  "Other",
] as const;
