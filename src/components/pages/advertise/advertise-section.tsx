"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowDown, ArrowUpRight, ExternalLink, Mail, MessageSquare } from "lucide-react";
import Link from "next/link";

import { SOCIAL_LINKS } from "@/components/general/links/social-links";
import { AD_FORMATS, AUDIENCE_CATEGORIES, PLATFORMS, PROCESS_STEPS } from "@/data/advertising";

/* -------------------------------------------------------------------------- */
/*  Motion                                                                    */
/* -------------------------------------------------------------------------- */

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease },
  },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function AdvertisePageComponent() {
  const reduceMotion = useReducedMotion();

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });
  };

  return (
    <main className="min-w-0 w-full max-w-full">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-border pb-16 pt-10 sm:pb-20 sm:pt-14">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <motion.div
          initial={reduceMotion ? false : "hidden"}
          animate="show"
          variants={stagger}
          className="relative min-w-0 max-w-3xl"
        >
          <motion.p
            variants={fadeUp}
            className="mb-4 text-[11px] font-medium tracking-[0.2em] uppercase text-muted-foreground"
          >
            Advertising · Partnerships · Media
          </motion.p>

          <motion.h1
            variants={fadeUp}
            className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-[3.25rem] lg:leading-[1.1]"
          >
            Put your product in front of
            <span className="text-muted-foreground"> people who are already discovering.</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            Reach audiences across our growing ecosystem of content platforms, applications, and
            digital products. Relevant brands. Thoughtful placements. Real conversations.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-9 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => scrollTo("platforms")}
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Explore our platforms
              <ArrowDown className="size-4 transition-transform group-hover:translate-y-0.5" />
            </button>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-5 py-2.5 text-sm font-medium text-foreground transition hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Start an advertising conversation
              <ArrowUpRight className="size-4" />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Platforms ────────────────────────────────────────────────────── */}
      <section id="platforms" className="scroll-mt-24 py-16 sm:py-20">
        <motion.div
          initial={reduceMotion ? false : "hidden"}
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger}
        >
          <motion.p
            variants={fadeUp}
            className="text-[11px] font-medium tracking-[0.2em] uppercase text-muted-foreground"
          >
            Our platforms
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
          >
            Where audiences discover
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground"
          >
            S.AZLAN operates content platforms where readers come for articles, ideas, and practical
            knowledge. These are the primary surfaces for advertising conversations.
          </motion.p>
        </motion.div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {PLATFORMS.map((platform, i) => (
            <motion.a
              key={platform.url}
              href={platform.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4, ease }}
              whileHover={reduceMotion ? {} : { y: -4 }}
              className="group relative flex flex-col justify-between overflow-hidden border border-border bg-card/40 p-7 transition-colors hover:border-primary/30 sm:p-8"
            >
              <div>
                <p className="text-[11px] font-medium tracking-[0.16em] uppercase text-muted-foreground">
                  {platform.category}
                </p>
                <h3 className="mt-3 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                  {platform.name}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {platform.description}
                </p>
              </div>
              <div className="mt-8 flex items-center gap-1.5 text-sm font-medium text-primary">
                Visit {platform.name}
                <ExternalLink className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
              <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-primary transition-all duration-300 group-hover:w-full" />
            </motion.a>
          ))}
        </div>
      </section>

      {/* ── Ways to work with us ─────────────────────────────────────────── */}
      <section className="py-16 sm:py-20">
        <motion.div
          initial={reduceMotion ? false : "hidden"}
          whileInView="show"
          viewport={{ once: true }}
          variants={stagger}
        >
          <motion.p
            variants={fadeUp}
            className="text-[11px] font-medium tracking-[0.2em] uppercase text-muted-foreground"
          >
            Opportunities
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
          >
            Ways to work with us
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground"
          >
            Advertising opportunities may include the following formats, depending on fit, timing,
            and platform availability.
          </motion.p>
        </motion.div>

        <div className="mt-12 grid gap-0 border-t border-border">
          {AD_FORMATS.map((format, i) => (
            <motion.div
              key={format.number}
              initial={reduceMotion ? false : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04, duration: 0.4 }}
              className="group grid grid-cols-12 gap-4 border-b border-border py-6 transition-colors hover:bg-muted/25 sm:py-7"
            >
              <div className="col-span-2 flex items-start pt-0.5 sm:col-span-1">
                <span className="font-mono text-xs text-muted-foreground/70">{format.number}</span>
              </div>
              <div className="col-span-10 flex flex-col gap-1 sm:col-span-11 sm:flex-row sm:items-baseline sm:gap-8">
                <h3 className="min-w-[180px] text-base font-medium tracking-tight text-foreground transition-transform duration-200 group-hover:translate-x-1 sm:text-lg">
                  {format.title}
                </h3>
                <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
                  {format.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Who we work with ─────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20">
        <motion.div
          initial={reduceMotion ? false : "hidden"}
          whileInView="show"
          viewport={{ once: true }}
          variants={stagger}
        >
          <motion.p
            variants={fadeUp}
            className="text-[11px] font-medium tracking-[0.2em] uppercase text-muted-foreground"
          >
            Fit
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
          >
            Who we work with
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground"
          >
            We are particularly interested in advertisers whose products and services are relevant
            to technology, builders, and digital product audiences.
          </motion.p>
        </motion.div>

        <div className="mt-10 flex flex-wrap gap-3">
          {AUDIENCE_CATEGORIES.map((cat, i) => (
            <motion.span
              key={cat}
              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.03, duration: 0.35 }}
              className="inline-flex items-center rounded-full border border-border bg-background px-4 py-2 text-sm text-muted-foreground"
            >
              {cat}
            </motion.span>
          ))}
        </div>
      </section>

      {/* ── Why S.AZLAN ──────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20">
        <motion.div
          initial={reduceMotion ? false : "hidden"}
          whileInView="show"
          viewport={{ once: true }}
          variants={stagger}
        >
          <motion.p
            variants={fadeUp}
            className="text-[11px] font-medium tracking-[0.2em] uppercase text-muted-foreground"
          >
            Why advertise here
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
          >
            A product-focused environment
          </motion.h2>
        </motion.div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {[
            {
              title: "Product-focused environment",
              text: "Advertisers can appear alongside useful content and technology products rather than generic media noise.",
            },
            {
              title: "Relevant context",
              text: "Technology and digital-product advertising can be presented in an environment aligned with the category.",
            },
            {
              title: "Flexible partnerships",
              text: "Campaigns can be discussed based on the advertiser’s actual goals and preferred platforms.",
            },
            {
              title: "Growing ecosystem",
              text: "S.AZLAN is building a collection of applications and digital products rather than a single isolated website.",
            },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={reduceMotion ? false : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              className="border-l-2 border-primary/40 pl-5"
            >
              <h3 className="text-base font-medium tracking-tight text-foreground">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Process ──────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20">
        <motion.div
          initial={reduceMotion ? false : "hidden"}
          whileInView="show"
          viewport={{ once: true }}
          variants={stagger}
        >
          <motion.p
            variants={fadeUp}
            className="text-[11px] font-medium tracking-[0.2em] uppercase text-muted-foreground"
          >
            Process
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
          >
            How it works
          </motion.h2>
        </motion.div>

        <div className="relative mt-12">
          <div className="absolute bottom-2 left-[18px] top-2 hidden w-px bg-border sm:block" />
          <div className="space-y-0">
            {PROCESS_STEPS.map((item, i) => (
              <motion.div
                key={item.step}
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04, duration: 0.4 }}
                className="group relative flex gap-6 py-5 sm:gap-10 sm:py-6"
              >
                <div className="relative z-10 flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-background font-mono text-[11px] text-muted-foreground transition-colors group-hover:border-primary group-hover:text-primary">
                  {item.step}
                </div>
                <div className="pt-1">
                  <h3 className="text-base font-medium tracking-tight text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-1 max-w-md text-sm leading-relaxed text-muted-foreground">
                    {item.text}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact CTA ──────────────────────────────────────────────────── */}
      <section id="inquiry" className="scroll-mt-24 border-t border-border py-16 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_280px] lg:gap-16 lg:items-start">
          <div className="min-w-0">
            <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-muted-foreground">
              Let’s talk advertising
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Ready to start a conversation?
            </h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
              Share your brand, product, goals, and preferred platform through our contact form.
              We’ll review the opportunity and get back to you.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                Go to contact form
                <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-5 py-2.5 text-sm font-medium text-foreground transition hover:bg-muted/60"
              >
                <Mail className="size-4 text-primary" />
                Prefer email?
              </Link>
            </div>
          </div>

          <aside className="min-w-0 space-y-6 lg:pt-2">
            <div className="rounded-lg border border-border bg-card/40 p-5">
              <div className="flex items-start gap-3">
                <MessageSquare className="mt-0.5 size-4 shrink-0 text-primary" />
                <div>
                  <p className="text-sm font-medium text-foreground">Response time</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    Advertising inquiries are reviewed carefully. Expect a thoughtful reply rather
                    than an automated one.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <p className="text-[11px] font-medium tracking-[0.18em] uppercase text-muted-foreground">
                Follow along
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {SOCIAL_LINKS.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="inline-flex size-9 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-foreground hover:bg-foreground hover:text-background"
                    >
                      <Icon className="size-4" />
                    </a>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────────────────── */}
      <section className="border-t border-border py-16 sm:py-20">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl"
        >
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Have a campaign in mind?
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Let’s find the right place for your brand across the S.AZLAN ecosystem.
          </p>
          <Link
            href="/contact"
            className="mt-6 group inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline underline-offset-4"
          >
            Talk to us about advertising
            <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </motion.div>
      </section>
    </main>
  );
}
