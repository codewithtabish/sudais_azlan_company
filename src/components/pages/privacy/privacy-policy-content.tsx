"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowLeft, ArrowUpRight, ChevronRight, Lock, Mail, Shield } from "lucide-react";
import Link from "next/link";
import * as React from "react";

const CONTACT_HREF = "/contact";
const LAST_UPDATED = "August 2026";

/* -------------------------------------------------------------------------- */
/*  Data                                                                      */
/* -------------------------------------------------------------------------- */

type PolicySection = {
  id: string;
  number: string;
  title: string;
  content: React.ReactNode;
};

const sections: PolicySection[] = [
  {
    id: "introduction",
    number: "01",
    title: "Introduction",
    content: (
      <>
        <p>
          This Privacy Policy explains what information S.AZLAN collects when you use this
          application, how that information is used, where it is stored, and the choices you have
          over it.
        </p>
        <p>
          This policy applies to the S.AZLAN application and the account system it provides. It does
          not apply to third-party services you may separately choose to use.
        </p>
      </>
    ),
  },
  {
    id: "information-we-collect",
    number: "02",
    title: "Information We Collect",
    content: (
      <>
        <p>
          S.AZLAN collects the information necessary to create and maintain your account, and the
          information you provide directly through the application. This includes:
        </p>
        <ul>
          <li>
            Authentication and account information — for example, details provided when you sign in
            with Google or with an email address.
          </li>
          <li>Information you provide through the application while using its features.</li>
          <li>Data that becomes associated with your account as you use the application.</li>
        </ul>
        <p>
          S.AZLAN does not currently collect information beyond what is necessary to provide your
          account and the application&apos;s features.
        </p>
      </>
    ),
  },
  {
    id: "how-we-use-information",
    number: "03",
    title: "How We Use Information",
    content: (
      <>
        <p>Information associated with your account is used to:</p>
        <ul>
          <li>Provide and operate the application</li>
          <li>Authenticate you and maintain your account</li>
          <li>Provide the functionality you request</li>
          <li>Let you access the data associated with your account</li>
          <li>Respond to support or privacy-related requests</li>
          <li>Maintain and protect the service</li>
        </ul>
        <p>Your information is not used for advertising, and it is not sold.</p>
      </>
    ),
  },
  {
    id: "authentication",
    number: "04",
    title: "Authentication",
    content: (
      <>
        <p>S.AZLAN supports two ways to authenticate and access your account:</p>
        <p>
          <strong>Google authentication.</strong> If you choose to sign in with Google,
          authentication may involve information provided by Google that is necessary to verify your
          identity and maintain your account. S.AZLAN does not control, and this policy does not
          describe, how Google itself handles your information — that is governed by Google&apos;s
          own privacy policy.
        </p>
        <p>
          <strong>Email authentication.</strong> If you choose to sign in with an email address,
          that address is used to authenticate and maintain your account. It is not used for
          marketing, newsletters, or promotional messages.
        </p>
      </>
    ),
  },
  {
    id: "data-storage",
    number: "05",
    title: "Data Storage",
    content: (
      <>
        <p>
          Information associated with your account is stored in S.AZLAN&apos;s application database.
          This is the same information you provide during authentication and while using the
          application.
        </p>
        <p>
          S.AZLAN does not publish infrastructure-level details — such as hosting providers or
          server locations — as part of this policy.
        </p>
      </>
    ),
  },
  {
    id: "your-data",
    number: "06",
    title: "Your Data & Rights",
    content: (
      <>
        <p>Your information is not intentionally hidden from you. You can:</p>
        <ul>
          <li>
            Access the data associated with your account through the application, where that
            functionality is available.
          </li>
          <li>Request deletion of your data or your account.</li>
          <li>Contact us with questions about your data at any time.</li>
        </ul>
      </>
    ),
  },
  {
    id: "account-deletion",
    number: "07",
    title: "Account Deletion",
    content: (
      <>
        <p>
          You can permanently delete your account where the application provides that functionality
          directly. Where in-app deletion is not yet available for a particular request, you can
          reach us to request deletion of your data or account instead.
        </p>
        <p>
          We do not publish a fixed deletion timeline in this policy. If you need a specific
          timeframe for a request, ask us directly and we&apos;ll confirm it with you.
        </p>
      </>
    ),
  },
  {
    id: "data-security",
    number: "08",
    title: "Data Security",
    content: (
      <>
        <p>
          S.AZLAN uses reasonable technical and organizational measures intended to protect the
          information in your account against unauthorized access, loss, misuse, or alteration.
        </p>
        <p>
          No system is completely secure, and we cannot guarantee absolute security. If we become
          aware of an issue affecting your account, we will take appropriate steps to address it.
        </p>
      </>
    ),
  },
  {
    id: "changes",
    number: "09",
    title: "Changes to This Policy",
    content: (
      <>
        <p>
          This policy may be updated as the application and its practices change. The date at the
          top of this page reflects when it was last revised. We encourage you to review it
          occasionally.
        </p>
      </>
    ),
  },
  {
    id: "contact",
    number: "10",
    title: "Contact",
    content: (
      <>
        <p>
          Questions about this policy, your data, or a deletion request can be sent to us directly.
        </p>
        <Link
          href={CONTACT_HREF}
          className="group inline-flex items-center gap-1.5 font-medium text-primary underline underline-offset-4 decoration-primary/30 transition hover:decoration-primary"
        >
          Contact us
          <ArrowUpRight
            className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden="true"
          />
        </Link>
      </>
    ),
  },
];

/* -------------------------------------------------------------------------- */
/*  Motion                                                                    */
/* -------------------------------------------------------------------------- */

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease },
  },
};

const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.055 },
  },
};

/* -------------------------------------------------------------------------- */
/*  Scrollspy                                                                 */
/* -------------------------------------------------------------------------- */

function useActiveSection(ids: string[]) {
  const [activeId, setActiveId] = React.useState(ids[0] ?? "");

  React.useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible[0]) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "-12% 0px -65% 0px",
        threshold: 0,
      },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids]);

  return activeId;
}

/* -------------------------------------------------------------------------- */
/*  Subcomponents                                                             */
/* -------------------------------------------------------------------------- */

function BackButton() {
  return (
    <Link
      href="/"
      className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <ArrowLeft
        className="size-4 transition-transform duration-200 group-hover:-translate-x-0.5"
        strokeWidth={1.75}
        aria-hidden="true"
      />
      <span>Back</span>
    </Link>
  );
}

function PrivacyHero({ onJump }: { onJump: () => void }) {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden border-b border-border pb-12 pt-6 sm:pb-16 sm:pt-8 lg:pb-20">
      {/* Decorative shield */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-12 top-1/2 hidden -translate-y-1/2 opacity-[0.04] sm:block lg:-right-4"
      >
        <Shield strokeWidth={0.7} className="size-[240px] text-foreground lg:size-[300px]" />
      </div>

      <div className="mb-8">
        <BackButton />
      </div>

      <motion.div
        initial={reduceMotion ? undefined : "hidden"}
        animate={reduceMotion ? undefined : "show"}
        variants={staggerContainer}
        className="relative min-w-0 max-w-3xl"
      >
        <motion.div
          variants={fadeUp}
          className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3.5 py-1.5 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground backdrop-blur-sm"
        >
          <Lock className="size-3.5 text-primary" aria-hidden="true" />
          Privacy
        </motion.div>

        <motion.h1
          variants={fadeUp}
          className="text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-[3.25rem] lg:leading-[1.1]"
        >
          Privacy Policy
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg"
        >
          Your privacy matters. This page explains what information S.AZLAN collects, why it&apos;s
          used, how it&apos;s stored, and the choices available to you.
        </motion.p>

        <motion.div variants={fadeUp} className="mt-9 flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={onJump}
            className="group inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Read policy
            <ChevronRight
              className="size-4 rotate-90 transition-transform group-hover:translate-y-0.5"
              aria-hidden="true"
            />
          </button>

          <span className="text-sm text-muted-foreground">
            Last updated <span className="font-medium text-foreground">{LAST_UPDATED}</span>
          </span>
        </motion.div>
      </motion.div>
    </section>
  );
}

function PrivacyContentsList({
  activeId,
  onSelect,
  variant,
}: {
  activeId: string;
  onSelect: (id: string) => void;
  variant: "sidebar" | "mobile";
}) {
  return (
    <nav aria-label="Privacy Policy sections">
      <motion.ol
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-10% 0px" }}
        variants={staggerContainer}
        className={
          variant === "sidebar"
            ? "flex flex-col gap-0.5"
            : "grid grid-cols-1 gap-0.5 sm:grid-cols-2"
        }
      >
        {sections.map((section) => {
          const isActive = activeId === section.id;
          return (
            <motion.li key={section.id} variants={fadeUp}>
              <a
                href={`#${section.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  onSelect(section.id);
                }}
                aria-current={isActive ? "true" : undefined}
                className={[
                  "group flex items-baseline gap-3 rounded-md px-2.5 py-2 text-sm transition-colors",
                  "hover:bg-muted/60",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  isActive ? "bg-muted/40 text-foreground" : "text-muted-foreground",
                ].join(" ")}
              >
                <span
                  className={[
                    "font-mono text-[11px] tabular-nums transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground/50",
                  ].join(" ")}
                >
                  {section.number}
                </span>
                <span className="min-w-0 truncate font-medium">{section.title}</span>
              </a>
            </motion.li>
          );
        })}
      </motion.ol>
    </nav>
  );
}

function PrivacySection({ section }: { section: PolicySection }) {
  return (
    <motion.section
      id={section.id}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-12% 0px" }}
      variants={fadeUp}
      className="scroll-mt-28 border-b border-border py-9 first:pt-0 last:border-b-0 sm:py-11"
    >
      <div className="mb-4 flex items-baseline gap-3.5">
        <span className="font-mono text-xs tracking-wider text-primary">{section.number}</span>
        <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          {section.title}
        </h2>
      </div>

      <div
        className={[
          "min-w-0 max-w-3xl space-y-4 text-[15.5px] leading-[1.7] text-muted-foreground sm:text-base sm:leading-[1.75]",
          "[&_strong]:font-medium [&_strong]:text-foreground",
          "[&_ul]:list-disc [&_ul]:space-y-2.5 [&_ul]:pl-5 [&_ul]:marker:text-primary/50",
        ].join(" ")}
      >
        {section.content}
      </div>
    </motion.section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Main                                                                      */
/* -------------------------------------------------------------------------- */

export default function PrivacyPolicyContent() {
  const ids = React.useMemo(() => sections.map((s) => s.id), []);
  const activeId = useActiveSection(ids);
  const reduceMotion = useReducedMotion();

  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });
    el.setAttribute("tabindex", "-1");
    el.focus({ preventScroll: true });
  };

  return (
    <main className="min-w-0 w-full max-w-full">
      <article>
        <PrivacyHero onJump={() => scrollToId(sections[0].id)} />

        <div className="py-12 sm:py-16 lg:py-20">
          <div className="grid min-w-0 grid-cols-1 gap-12 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-20 xl:grid-cols-[260px_minmax(0,1fr)]">
            {/* Desktop sticky sidebar */}
            <aside className="hidden min-w-0 lg:block">
              <div className="sticky top-28">
                <p className="mb-3.5 px-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Contents
                </p>
                <PrivacyContentsList activeId={activeId} onSelect={scrollToId} variant="sidebar" />
              </div>
            </aside>

            {/* Mobile contents */}
            <div className="min-w-0 lg:hidden">
              <p className="mb-3.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Contents
              </p>
              <PrivacyContentsList activeId={activeId} onSelect={scrollToId} variant="mobile" />
            </div>

            {/* Policy content */}
            <div className="min-w-0">
              {sections.map((section) => (
                <PrivacySection key={section.id} section={section} />
              ))}

              {/* Contact card */}
              <motion.div
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={fadeUp}
                className="mt-12 flex items-start gap-3.5 rounded-xl border border-border bg-card/60 px-5 py-5 text-sm text-muted-foreground backdrop-blur-sm"
              >
                <Mail className="mt-0.5 size-4.5 shrink-0 text-primary" aria-hidden="true" />
                <p className="leading-relaxed">
                  Questions about privacy or your data? Reach us through{" "}
                  <Link
                    href={CONTACT_HREF}
                    className="font-medium text-foreground underline underline-offset-4 decoration-primary/30 transition hover:decoration-primary"
                  >
                    our contact page
                  </Link>
                  .
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </article>
    </main>
  );
}
