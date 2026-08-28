import type { ComponentType } from "react";

export function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      className={className}
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M14.5 21v-7.2h2.4l.4-2.8h-2.8V9.2c0-.8.2-1.4 1.4-1.4h1.5V5.3c-.3 0-1.1-.1-2.1-.1-2.1 0-3.5 1.3-3.5 3.6v2.1H9.4v2.8h2.4V21" />
    </svg>
  );
}

export function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="2.5" y="6" width="19" height="12" rx="3.5" />
      <path d="M10.7 9.6v4.8l4.3-2.4-4.3-2.4Z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.53 2.5h3.2l-7 8 8.24 11h-6.45l-5.05-6.63L4.6 21.5H1.4l7.49-8.56L1 2.5h6.61l4.56 6.06 5.36-6.06Zm-1.12 17.02h1.77L7.66 4.38H5.76l10.65 15.14Z" />
    </svg>
  );
}

export type SocialLink = {
  label: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
};

export const SOCIAL_LINKS: SocialLink[] = [
  {
    label: "Instagram",
    href: "https://instagram.com/atative",
    icon: InstagramIcon,
  },
  {
    label: "Facebook",
    href: "https://facebook.com/atative",
    icon: FacebookIcon,
  },
  {
    label: "YouTube",
    href: "https://youtube.com/@atative",
    icon: YoutubeIcon,
  },
  {
    label: "X",
    href: "https://x.com/atative",
    icon: XIcon,
  },
];
