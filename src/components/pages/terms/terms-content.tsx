"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowLeft } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function SectionLabel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground",
        className,
      )}
    >
      {children}
    </span>
  );
}

function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const prefersReducedMotion = useReducedMotion();

  const ref = useRef<HTMLDivElement>(null);

  const isInView = useInView(ref, {
    once: true,
    margin: "-60px",
  });

  return (
    <motion.div
      ref={ref}
      initial={
        prefersReducedMotion
          ? false
          : {
              opacity: 0,
              y: 24,
            }
      }
      animate={
        isInView || prefersReducedMotion
          ? {
              opacity: 1,
              y: 0,
            }
          : {
              opacity: 0,
              y: 24,
            }
      }
      transition={{
        duration: 0.65,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const sections = [
  { id: "introduction", number: "01", title: "Introduction" },
  { id: "accounts", number: "02", title: "Accounts" },
  { id: "services", number: "03", title: "Services" },
  { id: "digital-products", number: "04", title: "Digital Products" },
  { id: "purchases", number: "05", title: "Purchases & Payments" },
  { id: "ai-software", number: "06", title: "AI & Software" },
  { id: "acceptable-use", number: "07", title: "Acceptable Use" },
  {
    id: "intellectual-property",
    number: "08",
    title: "Intellectual Property",
  },
  { id: "third-party", number: "09", title: "Third-Party Services" },
  { id: "termination", number: "10", title: "Termination" },
  { id: "disclaimers", number: "11", title: "Disclaimers" },
  { id: "liability", number: "12", title: "Limitation of Liability" },
  { id: "changes", number: "13", title: "Changes" },
  { id: "contact", number: "14", title: "Contact" },
] as const;

export default function TermsPageContent() {
  const prefersReducedMotion = useReducedMotion();

  const [activeId, setActiveId] = useState<string>(sections[0].id);

  const contentRef = useRef<HTMLElement>(null);

  /*
   * IMPORTANT:
   * Do not use new Date() inside this Client Component.
   *
   * Next.js 16 can evaluate Client Components during prerendering.
   * Using new Date() here causes:
   *
   * "Next.js encountered the unstable value new Date() in a Client Component."
   *
   * Keep the displayed legal-update year static.
   */
  const currentYear = 2026;

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    sections.forEach(({ id }) => {
      const element = document.getElementById(id);

      if (!element) {
        return;
      }

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry?.isIntersecting) {
            setActiveId(id);
          }
        },
        {
          rootMargin: "-20% 0px -60% 0px",
          threshold: 0,
        },
      );

      observer.observe(element);
      observers.push(observer);
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, []);

  const scrollToSection = useCallback(
    (id: string) => {
      const element = document.getElementById(id);

      if (!element) {
        return;
      }

      element.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start",
      });
    },
    [prefersReducedMotion],
  );

  return (
    <main className="w-full">
      <div className="pb-2 pt-6">
        <Link href="/">
          <motion.div
            initial={
              prefersReducedMotion
                ? false
                : {
                    opacity: 0,
                    x: -10,
                  }
            }
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.45,
              ease: [0.16, 1, 0.3, 1],
            }}
            whileHover={prefersReducedMotion ? {} : { x: -3 }}
            className="inline-flex"
          >
            <Button
              variant="ghost"
              size="sm"
              className="group h-9 rounded-full px-3 text-muted-foreground hover:bg-muted/60 hover:text-foreground"
            >
              <ArrowLeft className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
              Back
            </Button>
          </motion.div>
        </Link>
      </div>

      <header className="pb-16 pt-10 md:pb-20 md:pt-14">
        <Reveal>
          <SectionLabel>Terms · Conditions</SectionLabel>
        </Reveal>

        <Reveal delay={0.06}>
          <h1 className="mt-5 text-3xl font-semibold leading-[1.1] tracking-tight text-foreground sm:text-4xl md:text-5xl">
            Terms of Service
          </h1>
        </Reveal>

        <Reveal delay={0.12}>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            A clear framework for using S.AZLAN applications, engineering services, AI work, and
            digital products.
          </p>
        </Reveal>

        <Reveal delay={0.18}>
          <p className="mt-3 text-sm text-muted-foreground/80">Last updated: {currentYear}</p>
        </Reveal>

        <Reveal delay={0.24}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => scrollToSection("introduction")}
            className="group mt-8 h-10 rounded-full px-5"
          >
            Read the terms
            <ArrowDown className="ml-2 h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-y-0.5" />
          </Button>
        </Reveal>
      </header>

      <div className="grid gap-12 pb-28 md:pb-36 lg:grid-cols-12 lg:gap-16">
        <aside className="hidden lg:col-span-3 lg:block">
          <nav aria-label="Table of contents" className="sticky top-28 space-y-1">
            <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Contents
            </p>

            {sections.map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() => scrollToSection(section.id)}
                className={cn(
                  "flex w-full items-baseline gap-3 rounded-md px-2 py-1.5 text-left text-sm transition-colors duration-200",
                  activeId === section.id
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <span
                  className={cn(
                    "text-[11px] tabular-nums tracking-wider",
                    activeId === section.id ? "text-primary" : "text-muted-foreground/60",
                  )}
                >
                  {section.number}
                </span>

                <span className="leading-snug">{section.title}</span>

                {activeId === section.id && (
                  <motion.span
                    layoutId="toc-indicator"
                    className="ml-auto h-1 w-1 rounded-full bg-primary"
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 30,
                    }}
                  />
                )}
              </button>
            ))}
          </nav>
        </aside>

        <div className="lg:hidden">
          <Reveal>
            <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Contents
            </p>

            <div className="flex flex-wrap gap-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => scrollToSection(section.id)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/50 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                >
                  <span className="tabular-nums text-muted-foreground/70">{section.number}</span>
                  {section.title}
                </button>
              ))}
            </div>
          </Reveal>
        </div>

        <article ref={contentRef} className="space-y-16 lg:col-span-9 md:space-y-20">
          <section id="introduction" className="scroll-mt-28">
            <Reveal>
              <div className="mb-5 flex items-baseline gap-3">
                <span className="text-xs font-medium tracking-widest text-muted-foreground/70">
                  01
                </span>

                <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                  Introduction
                </h2>
              </div>

              <div className="space-y-4 text-[15px] leading-relaxed text-muted-foreground">
                <p>
                  These Terms of Service (“Terms”) govern your access to and use of websites,
                  applications, services, and digital products provided under the S.AZLAN brand
                  (collectively, the “Services”).
                </p>

                <p>
                  By accessing or using the Services, you agree to these Terms. If you do not agree,
                  please do not use the Services.
                </p>

                <p>
                  S.AZLAN provides software engineering, AI engineering, application and backend
                  development, technical resources, and digital products such as templates, prompts,
                  workflows, and related assets. The specific offerings available may change over
                  time.
                </p>
              </div>
            </Reveal>
          </section>

          <section id="accounts" className="scroll-mt-28">
            <Reveal>
              <div className="mb-5 flex items-baseline gap-3">
                <span className="text-xs font-medium tracking-widest text-muted-foreground/70">
                  02
                </span>

                <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                  Accounts
                </h2>
              </div>

              <div className="space-y-4 text-[15px] leading-relaxed text-muted-foreground">
                <p>
                  Certain features of the Services may require an account. Authentication and
                  account management are handled through Clerk.
                </p>

                <p>You are responsible for:</p>

                <ul className="list-disc space-y-2 pl-5">
                  <li>Providing accurate information where required</li>
                  <li>Maintaining the security of your account credentials and sessions</li>
                  <li>All activity that occurs under your account</li>
                  <li>Using the Services only for lawful purposes</li>
                </ul>

                <p>
                  You must not attempt to access another person’s account or interfere with account
                  security. If you believe your account has been compromised, contact us promptly
                  through the available channels.
                </p>
              </div>
            </Reveal>
          </section>

          <section id="services" className="scroll-mt-28">
            <Reveal>
              <div className="mb-5 flex items-baseline gap-3">
                <span className="text-xs font-medium tracking-widest text-muted-foreground/70">
                  03
                </span>

                <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                  Services
                </h2>
              </div>

              <div className="space-y-4 text-[15px] leading-relaxed text-muted-foreground">
                <p>
                  S.AZLAN may offer professional services including software engineering, AI
                  engineering, application development, backend and REST API development, technical
                  consulting, and related work.
                </p>

                <p>
                  The scope, deliverables, timeline, and commercial terms of any service engagement
                  may be defined separately through a proposal, statement of work, written
                  agreement, invoice, order, or other written communication between the parties.
                </p>

                <p>
                  Unless otherwise agreed in writing, descriptions of services on the website are
                  general and do not constitute a binding offer for a specific engagement.
                </p>
              </div>
            </Reveal>
          </section>

          <section id="digital-products" className="scroll-mt-28">
            <Reveal>
              <div className="mb-5 flex items-baseline gap-3">
                <span className="text-xs font-medium tracking-widest text-muted-foreground/70">
                  04
                </span>

                <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                  Digital Products
                </h2>
              </div>

              <div className="space-y-4 text-[15px] leading-relaxed text-muted-foreground">
                <p>
                  The Services may include digital products such as templates, prompts, AI
                  resources, skills, workflows, API-related resources, software-related assets, and
                  other digitally delivered materials.
                </p>

                <p>
                  The catalog of digital products may change. Product descriptions, formats, and
                  delivery methods are as presented at the time of purchase.
                </p>

                <p>
                  Purchasing a digital product grants you the right to use that product according to
                  the applicable license terms shown for that product (or these Terms if no specific
                  license is stated). You do not acquire ownership of the underlying intellectual
                  property merely by completing a purchase.
                </p>

                <p>
                  Unless a product’s license expressly permits it, you may not resell, redistribute,
                  sublicense, publish, or claim as your own the digital products or materials
                  obtained through the Services.
                </p>
              </div>
            </Reveal>
          </section>

          <section id="purchases" className="scroll-mt-28">
            <Reveal>
              <div className="mb-5 flex items-baseline gap-3">
                <span className="text-xs font-medium tracking-widest text-muted-foreground/70">
                  05
                </span>

                <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                  Purchases & Payments
                </h2>
              </div>

              <div className="space-y-4 text-[15px] leading-relaxed text-muted-foreground">
                <p>
                  Prices for products and services are as presented at the time of purchase or
                  engagement. Applicable taxes or fees, if any, will be shown where required.
                </p>

                <p>
                  Payment processing may be handled by a third-party payment provider. S.AZLAN does
                  not claim to store full payment card details on its own systems.
                </p>

                <p>
                  Completed purchases are subject to the terms applicable to the specific product or
                  service. Refund eligibility depends on the nature of the product or service, the
                  terms presented at purchase, and applicable law. If you have a question about a
                  particular transaction, contact us through the available channels.
                </p>

                <p>
                  Optional support-style payments (if offered) are voluntary and are not treated as
                  charitable donations unless explicitly stated.
                </p>
              </div>
            </Reveal>
          </section>

          <section id="ai-software" className="scroll-mt-28">
            <Reveal>
              <div className="mb-5 flex items-baseline gap-3">
                <span className="text-xs font-medium tracking-widest text-muted-foreground/70">
                  06
                </span>

                <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                  AI & Software
                </h2>
              </div>

              <div className="space-y-4 text-[15px] leading-relaxed text-muted-foreground">
                <p>
                  Some Services and products involve generative AI, AI-assisted workflows, automated
                  systems, or third-party AI services.
                </p>

                <p>
                  AI-generated or AI-assisted output may contain errors, inaccuracies, or unexpected
                  results. You are responsible for reviewing such output before relying on it for
                  important decisions, production systems, or legal, medical, financial, or other
                  high-stakes use.
                </p>

                <p>
                  Where software, APIs, or technical resources are provided, you agree to use them
                  lawfully and in accordance with any stated usage guidelines. You must not attempt
                  to disrupt systems, bypass access controls, or engage in abusive or malicious
                  activity.
                </p>

                <p>
                  No specific uptime, rate limit, or service-level commitment is promised unless set
                  out in a separate written agreement.
                </p>
              </div>
            </Reveal>
          </section>

          <section id="acceptable-use" className="scroll-mt-28">
            <Reveal>
              <div className="mb-5 flex items-baseline gap-3">
                <span className="text-xs font-medium tracking-widest text-muted-foreground/70">
                  07
                </span>

                <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                  Acceptable Use
                </h2>
              </div>

              <div className="space-y-4 text-[15px] leading-relaxed text-muted-foreground">
                <p>You agree not to use the Services to:</p>

                <ul className="list-disc space-y-2 pl-5">
                  <li>Violate applicable laws or regulations</li>
                  <li>Compromise the security or integrity of systems</li>
                  <li>Gain unauthorized access to accounts, data, or infrastructure</li>
                  <li>Distribute malware or harmful code</li>
                  <li>Abuse APIs or interfere with service availability</li>
                  <li>Impersonate others or misrepresent your identity</li>
                  <li>Infringe intellectual property or other rights</li>
                  <li>Commit fraud or abuse payment systems</li>
                  <li>Misuse authentication mechanisms</li>
                  <li>Facilitate harmful or illegal activity</li>
                </ul>

                <p>
                  We may investigate and take appropriate action in response to suspected
                  violations, including restricting access where necessary.
                </p>
              </div>
            </Reveal>
          </section>

          <section id="intellectual-property" className="scroll-mt-28">
            <Reveal>
              <div className="mb-5 flex items-baseline gap-3">
                <span className="text-xs font-medium tracking-widest text-muted-foreground/70">
                  08
                </span>

                <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                  Intellectual Property
                </h2>
              </div>

              <div className="space-y-4 text-[15px] leading-relaxed text-muted-foreground">
                <p>
                  S.AZLAN and its licensors retain all rights in the website, branding, logos,
                  software, code, design, documentation, templates, prompts, original resources,
                  digital products, and other materials made available through the Services, except
                  for rights expressly granted to you.
                </p>

                <p>
                  You receive only the limited rights granted under these Terms or under a specific
                  product license. No other rights are conferred by implication or otherwise.
                </p>

                <p>
                  If you submit feedback or suggestions, you grant S.AZLAN a non-exclusive,
                  royalty-free right to use that feedback to improve the Services. This does not
                  transfer ownership of your pre-existing intellectual property.
                </p>
              </div>
            </Reveal>
          </section>

          <section id="third-party" className="scroll-mt-28">
            <Reveal>
              <div className="mb-5 flex items-baseline gap-3">
                <span className="text-xs font-medium tracking-widest text-muted-foreground/70">
                  09
                </span>

                <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                  Third-Party Services
                </h2>
              </div>

              <div className="space-y-4 text-[15px] leading-relaxed text-muted-foreground">
                <p>
                  The Services rely on third-party providers. Authentication and account management
                  are provided by Clerk. Other infrastructure or payment providers may be used as
                  needed.
                </p>

                <p>
                  Third-party services are subject to their own terms and privacy policies. S.AZLAN
                  is not responsible for the practices of third-party providers beyond what is
                  required by applicable law.
                </p>
              </div>
            </Reveal>
          </section>

          <section id="termination" className="scroll-mt-28">
            <Reveal>
              <div className="mb-5 flex items-baseline gap-3">
                <span className="text-xs font-medium tracking-widest text-muted-foreground/70">
                  10
                </span>

                <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                  Termination
                </h2>
              </div>

              <div className="space-y-4 text-[15px] leading-relaxed text-muted-foreground">
                <p>
                  You may stop using the Services at any time. Where account deletion controls are
                  available, you may use them according to the interface provided.
                </p>

                <p>
                  We may restrict or terminate access to the Services if you violate these Terms,
                  abuse the platform, engage in unlawful activity, or threaten the security or
                  integrity of the Services or other users.
                </p>

                <p>
                  Provisions that by their nature should survive termination (including intellectual
                  property, disclaimers, and limitation of liability) will continue to apply.
                </p>
              </div>
            </Reveal>
          </section>

          <section id="disclaimers" className="scroll-mt-28">
            <Reveal>
              <div className="mb-5 flex items-baseline gap-3">
                <span className="text-xs font-medium tracking-widest text-muted-foreground/70">
                  11
                </span>

                <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                  Disclaimers
                </h2>
              </div>

              <div className="space-y-4 text-[15px] leading-relaxed text-muted-foreground">
                <p>
                  The Services are provided on an “as is” and “as available” basis to the fullest
                  extent permitted by law.
                </p>

                <p>
                  We do not warrant that the Services will be uninterrupted, error-free, or suitable
                  for every purpose. Technical resources and AI-generated or AI-assisted output
                  should be reviewed and tested before use in production or other critical contexts.
                </p>

                <p>
                  Nothing in these Terms is intended to exclude rights that cannot be excluded under
                  applicable law.
                </p>
              </div>
            </Reveal>
          </section>

          <section id="liability" className="scroll-mt-28">
            <Reveal>
              <div className="mb-5 flex items-baseline gap-3">
                <span className="text-xs font-medium tracking-widest text-muted-foreground/70">
                  12
                </span>

                <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                  Limitation of Liability
                </h2>
              </div>

              <div className="space-y-4 text-[15px] leading-relaxed text-muted-foreground">
                <p>
                  To the maximum extent permitted by applicable law, S.AZLAN and its operators will
                  not be liable for indirect, incidental, special, consequential, or punitive
                  damages, or for loss of profits, data, or business opportunities, arising from or
                  related to your use of the Services.
                </p>

                <p>
                  Where liability cannot be fully excluded, it will be limited to the extent
                  permitted by applicable law. These Terms do not override mandatory consumer rights
                  that may apply in your jurisdiction.
                </p>

                <p className="border-l-2 border-border pl-4 text-sm text-muted-foreground/90">
                  <strong className="text-foreground/80">Note for legal review:</strong> Governing
                  law, dispute resolution, and any specific liability caps should be confirmed with
                  qualified counsel before finalizing for production use in a particular
                  jurisdiction.
                </p>
              </div>
            </Reveal>
          </section>

          <section id="changes" className="scroll-mt-28">
            <Reveal>
              <div className="mb-5 flex items-baseline gap-3">
                <span className="text-xs font-medium tracking-widest text-muted-foreground/70">
                  13
                </span>

                <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                  Changes
                </h2>
              </div>

              <div className="space-y-4 text-[15px] leading-relaxed text-muted-foreground">
                <p>
                  These Terms may be updated as the Services, products, or business evolve. The
                  current version will be posted on this page with an updated date.
                </p>

                <p>
                  Continued use of the Services after changes take effect constitutes acceptance of
                  the revised Terms. We encourage you to review this page periodically.
                </p>

                <p>
                  Features, products, and availability may change over time. We do not guarantee
                  that any particular product or feature will remain available indefinitely.
                </p>
              </div>
            </Reveal>
          </section>

          <section id="contact" className="scroll-mt-28">
            <Reveal>
              <div className="mb-5 flex items-baseline gap-3">
                <span className="text-xs font-medium tracking-widest text-muted-foreground/70">
                  14
                </span>

                <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                  Contact
                </h2>
              </div>

              <div className="space-y-4 text-[15px] leading-relaxed text-muted-foreground">
                <p>
                  For questions about these Terms, or about a product, service, or account matter,
                  please use the contact options available on the site.
                </p>

                <p>
                  <Link
                    href="/contact"
                    className="text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-primary"
                  >
                    Go to Contact
                  </Link>
                </p>

                <p>
                  Personal information is handled according to our{" "}
                  <Link
                    href="/privacy"
                    className="text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-primary"
                  >
                    Privacy Policy
                  </Link>
                  .
                </p>
              </div>
            </Reveal>
          </section>

          <Reveal>
            <div className="border-t border-border/50 pt-10">
              <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
                These Terms are intended to set clear expectations for using S.AZLAN applications,
                services, and digital products. They are not a substitute for professional legal
                advice. If you need terms tailored to a specific engagement or jurisdiction, seek
                appropriate counsel.
              </p>
            </div>
          </Reveal>
        </article>
      </div>
    </main>
  );
}
