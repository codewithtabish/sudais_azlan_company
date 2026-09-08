import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { SOCIAL_LINKS } from "../links/social-links";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";

/* ------------------------------------------------------------------ */
/*  Copyright                                                         */
/* ------------------------------------------------------------------ */

const COPYRIGHT_YEAR = new Date().getFullYear().toString();

/* ------------------------------------------------------------------ */
/*  Footer links                                                       */
/* ------------------------------------------------------------------ */

const COMPANY_LINKS = [
  {
    label: "About",
    href: "/about",
  },
  {
    label: "Contact",
    href: "/contact",
  },
];

const LEGAL_LINKS = [
  {
    label: "Privacy Policy",
    href: "/privacy",
  },
  {
    label: "Terms of Use",
    href: "/terms",
  },
  {
    label: "Advertise",
    href: "/advertise",
  },
];

const EXPLORE_LINKS = [
  { label: "About", href: "/about" },
  { label: "Projects", href: "/projects" },
  { label: "Services", href: "/services" },
  { label: "Blog", href: "/blog" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

/* ------------------------------------------------------------------ */
/*  Footer link                                                        */
/* ------------------------------------------------------------------ */

function FooterLink({
  href,
  children,
  external = false,
}: {
  href: string;
  children: ReactNode;
  external?: boolean;
}) {
  const className = cn(
    "group inline-flex items-center gap-1",
    "text-sm text-foreground/75",
    "transition-colors duration-200",
    "hover:text-foreground",
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
        <ArrowUpRight
          className="size-3.5 opacity-0 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
          aria-hidden="true"
        />
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
      <ArrowUpRight
        className="size-3.5 opacity-0 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
        aria-hidden="true"
      />
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/*  Social button                                                      */
/* ------------------------------------------------------------------ */

function SocialButton({ social }: { social: (typeof SOCIAL_LINKS)[number] }) {
  const Icon = social.icon;

  return (
    <a
      href={social.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={social.label}
      className={cn(
        "inline-flex size-10 items-center justify-center",
        "rounded-md border border-border",
        "text-foreground/70",
        "transition-all duration-200",
        "hover:border-foreground",
        "hover:bg-foreground",
        "hover:text-background",
        "focus-visible:outline-none",
        "focus-visible:ring-2",
        "focus-visible:ring-ring",
        "focus-visible:ring-offset-2",
        "focus-visible:ring-offset-background",
      )}
    >
      <Icon className="size-[18px]" />
    </a>
  );
}

/* ------------------------------------------------------------------ */
/*  Footer                                                             */
/* ------------------------------------------------------------------ */

export default function AtativeFooter() {
  return (
    <footer className="border-t border-border bg-background/15">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-6 lg:px-8">
        {/* ========================================================== */}
        {/* Main footer                                                 */}
        {/* ========================================================== */}

        <div className="grid gap-12 py-14 md:grid-cols-2 lg:grid-cols-[1.45fr_1fr_0.9fr] lg:gap-16 lg:py-16">
          {/* -------------------------------------------------------- */}
          {/* Brand                                                     */}
          {/* -------------------------------------------------------- */}

          <div className="max-w-[560px]">
            <Link href="/" className="inline-block" aria-label="Sudais Azlan – Home">
              <Image
                src="/images/brandlogo/logo.png"
                alt="Sudais Azlan"
                width={1840}
                height={560}
                className="h-10 sm:h-11 md:h-12 lg:h-14 w-auto object-contain"
                priority
              />
            </Link>

            <p className="mt-7 max-w-[540px] text-[15px] leading-7 text-muted-foreground">
              Sudais Azlan is an AI engineer building intelligent systems, generative AI products,
              high-performance APIs, and scalable applications. Focused on practical AI services
              that turn complex problems into reliable, production-ready solutions.
            </p>

            {/* Company links */}
            <nav aria-label="Company" className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              {COMPANY_LINKS.map((link) => (
                <FooterLink key={link.href} href={link.href}>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.13em]">
                    {link.label}
                  </span>
                </FooterLink>
              ))}
            </nav>

            {/* Socials */}
            <div className="mt-7 flex items-center gap-2">
              {SOCIAL_LINKS.map((social) => (
                <SocialButton key={social.label} social={social} />
              ))}
            </div>
          </div>

          {/* -------------------------------------------------------- */}
          {/* Explore                                                   */}
          {/* -------------------------------------------------------- */}

          <div>
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Explore
            </h2>

            <nav aria-label="Explore" className="mt-6 space-y-3">
              {EXPLORE_LINKS.map((link) => (
                <div key={link.href}>
                  <FooterLink href={link.href}>{link.label}</FooterLink>
                </div>
              ))}
            </nav>
          </div>

          {/* -------------------------------------------------------- */}
          {/* Information / Legal                                       */}
          {/* -------------------------------------------------------- */}

          <div>
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Information
            </h2>

            <nav aria-label="Legal and information" className="mt-6 space-y-4">
              {LEGAL_LINKS.map((link) => (
                <FooterLink key={link.href} href={link.href}>
                  {link.label}
                </FooterLink>
              ))}
              <AnimatedThemeToggler />
            </nav>
          </div>
        </div>

        {/* ========================================================== */}
        {/* Divider                                                      */}
        {/* ========================================================== */}

        <div className="border-t border-dashed border-border" />

        {/* ========================================================== */}
        {/* Bottom footer                                                */}
        {/* ========================================================== */}

        <div className="flex flex-col gap-5 py-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-foreground">
              © {COPYRIGHT_YEAR} Sudais Azlan. All rights reserved.
            </p>

            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              AI engineering, systems design, and digital products. All content and trademarks
              remain the property of their respective owners where applicable.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
