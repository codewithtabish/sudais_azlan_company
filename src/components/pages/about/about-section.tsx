"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, useInView, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, Brain, Code2, Database, Layers, Workflow, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import ABOUTCTA from "./about-cta";

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */

function SectionLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "text-[11px] font-medium tracking-[0.22em] uppercase text-muted-foreground",
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
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={prefersReducedMotion ? false : { opacity: 0, y: 32 }}
      animate={
        isInView
          ? { opacity: 1, y: 0 }
          : prefersReducedMotion
            ? { opacity: 1, y: 0 }
            : { opacity: 0, y: 32 }
      }
      transition={{
        duration: 0.75,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   Data
───────────────────────────────────────────── */

const focusAreas = [
  {
    number: "01",
    title: "Generative AI",
    description:
      "LLM-powered products, agents, retrieval systems, and evaluation loops that actually ship.",
    icon: Brain,
  },
  {
    number: "02",
    title: "Application Engineering",
    description:
      "End-to-end systems — from interface to data layer — built for clarity and longevity.",
    icon: Code2,
  },
  {
    number: "03",
    title: "High-Performance APIs",
    description:
      "Interfaces that stay fast under load and remain pleasant for the people who consume them.",
    icon: Zap,
  },
  {
    number: "04",
    title: "Scalable Systems",
    description: "Architecture that absorbs growth without becoming a liability.",
    icon: Layers,
  },
  {
    number: "05",
    title: "Data-Intensive Work",
    description:
      "Pipelines, storage, and query patterns designed for real volume and real latency budgets.",
    icon: Database,
  },
  {
    number: "06",
    title: "Product Engineering",
    description:
      "Turning ambiguous problems into shipped surfaces that users can actually rely on.",
    icon: Workflow,
  },
];

const journey = [
  {
    step: "01",
    label: "Learn",
    text: "Study systems, constraints, and the tools that actually matter.",
  },
  { step: "02", label: "Build", text: "Turn understanding into working software." },
  {
    step: "03",
    label: "Experiment",
    text: "Test ideas in public and private until the useful ones survive.",
  },
  {
    step: "04",
    label: "Ship",
    text: "Release things that other people can use without friction.",
  },
  {
    step: "05",
    label: "Contribute",
    text: "Share code, writing, and patterns that compound beyond one project.",
  },
];

const exploring = [
  "Agentic systems",
  "Retrieval & evaluation",
  "High-performance APIs",
  "Developer experience",
  "Intelligent interfaces",
  "Distributed patterns",
  "Product experiments",
];

const personalNotes = [
  {
    label: "Reading",
    value: "Systems papers, product essays, long-form technical writing",
  },
  {
    label: "Building",
    value: "Small tools and experiments that teach more than they ship",
  },
  {
    label: "Thinking about",
    value: "Interfaces that feel intelligent without becoming opaque",
  },
  {
    label: "Outside the stack",
    value: "Quiet focus, long walks, and good design wherever it appears",
  },
];

/* ─────────────────────────────────────────────
   Page
───────────────────────────────────────────── */

export default function AboutPage() {
  const prefersReducedMotion = useReducedMotion();
  const heroRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroY = useTransform(scrollYProgress, [0, 1], [0, prefersReducedMotion ? 0 : 60]);
  const heroOpacity = useTransform(
    scrollYProgress,
    [0, 0.85],
    [1, prefersReducedMotion ? 1 : 0.35],
  );

  return (
    <div className="w-full">
      {/* ═══════════════════════════════════════
          BACK BUTTON
      ═══════════════════════════════════════ */}
      <div className="pt-6 pb-2">
        <Link href="/">
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            whileHover={prefersReducedMotion ? {} : { x: -4 }}
            className="inline-flex"
          >
            <Button
              variant="ghost"
              size="sm"
              className="group rounded-full px-3 h-9 text-muted-foreground hover:text-foreground hover:bg-muted/60"
            >
              <ArrowLeft className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
              Back
            </Button>
          </motion.div>
        </Link>
      </div>

      {/* ═══════════════════════════════════════
          1. HERO
      ═══════════════════════════════════════ */}
      <section ref={heroRef} className="relative pt-10 pb-24 md:pt-16 md:pb-32">
        <motion.div style={{ y: heroY, opacity: heroOpacity }}>
          <Reveal>
            <SectionLabel>About · Engineer · Builder</SectionLabel>
          </Reveal>

          <Reveal delay={0.08}>
            <h1 className="mt-6 max-w-4xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-[3.75rem] leading-[1.08]">
              Building intelligent systems
              <span className="text-muted-foreground"> for the next generation of the web.</span>
            </h1>
          </Reveal>

          <Reveal delay={0.16}>
            <p className="mt-8 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              I work at the intersection of software engineering, generative AI, and product
              systems. Most of my time goes into designing APIs that stay fast, applications that
              remain coherent under complexity, and interfaces that make intelligence feel useful
              rather than theatrical.
            </p>
          </Reveal>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════
          2 + 3. PROFILE IMAGE + METADATA
      ═══════════════════════════════════════ */}
      <section className="pb-28 md:pb-36">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16 items-start">
          <Reveal className="lg:col-span-7 relative">
            <motion.div
              whileHover={prefersReducedMotion ? {} : { scale: 1.01 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative aspect-4/5 w-full overflow-hidden border border-border/60 bg-muted/20"
            >
              <Image
                src="/images/about.png"
                alt="Portrait of Sudais Azlan"
                fill
                priority
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 58vw"
              />
              {/* <div className="pointer-events-none absolute inset-3 border border-white/10 dark:border-white/5" /> */}
            </motion.div>

            <div className="mt-5 flex flex-wrap gap-x-8 gap-y-2 text-[11px] tracking-[0.18em] uppercase text-muted-foreground">
              <span>Engineer</span>
              <span>AI · Systems · Product</span>
              <span>Building from Pakistan</span>
            </div>
          </Reveal>

          <div className="lg:col-span-5 lg:pt-8 space-y-10">
            <Reveal delay={0.1}>
              <div className="space-y-3">
                <SectionLabel>Currently</SectionLabel>
                <p className="text-xl font-medium tracking-tight text-foreground leading-snug">
                  Designing systems where performance, clarity, and intelligence are treated as the
                  same problem.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.18}>
              <div className="space-y-3 border-t border-border/50 pt-8">
                <SectionLabel>Focus</SectionLabel>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {[
                    "Generative AI & agent workflows",
                    "High-performance application layers",
                    "Product engineering under real constraints",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span className="h-px w-4 bg-primary/60" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          4. PHILOSOPHY
      ═══════════════════════════════════════ */}
      <section className="pb-28 md:pb-36">
        <div className="grid gap-8 md:grid-cols-12 md:gap-12 items-start">
          <Reveal className="md:col-span-3">
            <SectionLabel>Philosophy</SectionLabel>
          </Reveal>
          <Reveal delay={0.08} className="md:col-span-9">
            <blockquote className="text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight text-foreground leading-tight">
              Good software isn’t measured by how much code it contains.
              <span className="text-muted-foreground">
                {" "}
                It’s measured by how much complexity it removes from the people who depend on it.
              </span>
            </blockquote>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          5. ENGINEERING FOCUS
      ═══════════════════════════════════════ */}
      <section className="pb-28 md:pb-36">
        <Reveal>
          <SectionLabel>Engineering Focus</SectionLabel>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            What the work actually looks like
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-0 border-t border-border/50">
          {focusAreas.map((item, i) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.number} delay={i * 0.04}>
                <div className="group relative grid grid-cols-12 gap-4 border-b border-border/40 py-7 transition-colors duration-300 hover:bg-muted/30">
                  <div className="col-span-2 sm:col-span-1 flex items-start pt-1">
                    <span className="text-xs font-medium tracking-widest text-muted-foreground/70">
                      {item.number}
                    </span>
                  </div>

                  <div className="col-span-8 sm:col-span-9 flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-6">
                    <h3 className="text-lg font-medium tracking-tight text-foreground transition-transform duration-300 group-hover:translate-x-1 min-w-[180px]">
                      {item.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground max-w-xl transition-opacity duration-300 group-hover:text-foreground/80">
                      {item.description}
                    </p>
                  </div>

                  <div className="col-span-2 flex justify-end items-start pt-1">
                    <Icon className="h-4 w-4 text-muted-foreground/50 transition-all duration-300 group-hover:text-primary group-hover:scale-110" />
                  </div>

                  <span className="absolute left-0 top-0 h-full w-[2px] origin-top scale-y-0 bg-primary transition-transform duration-300 group-hover:scale-y-100" />
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ═══════════════════════════════════════
          6. GENERATIVE AI
      ═══════════════════════════════════════ */}
      <section className="pb-28 md:pb-36">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Reveal>
              <SectionLabel>Generative AI</SectionLabel>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Intelligence as infrastructure
              </h2>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="mt-6 text-muted-foreground leading-relaxed">
                I treat language models as components inside larger systems — not as the product
                itself. The interesting work lives in orchestration, retrieval, evaluation, and the
                interfaces that make model output trustworthy.
              </p>
            </Reveal>

            <Reveal delay={0.16}>
              <ul className="mt-8 space-y-3 text-sm text-muted-foreground">
                {[
                  "LLM-powered application surfaces",
                  "Agent workflows & tool use",
                  "Retrieval and grounding systems",
                  "Evaluation & feedback loops",
                  "Model orchestration patterns",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-2 h-1 w-1 rounded-full bg-primary shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <Reveal delay={0.12} className="lg:col-span-7">
            <div className="relative h-full min-h-[280px] border border-border/50 bg-muted/10 p-8 flex flex-col justify-between">
              <div className="flex items-center justify-between text-[11px] tracking-[0.2em] uppercase text-muted-foreground">
                <span>Input</span>
                <span className="hidden sm:inline">Reasoning</span>
                <span>Output</span>
              </div>

              <div className="flex items-center gap-3 py-10">
                {["Context", "Retrieve", "Reason", "Act", "Verify"].map((label, i) => (
                  <div key={label} className="flex items-center gap-3 flex-1">
                    <div className="flex flex-col items-center gap-2 flex-1">
                      <div
                        className={cn(
                          "h-10 w-full border border-border/60 bg-background/60 flex items-center justify-center text-[10px] tracking-wider uppercase text-muted-foreground",
                          i === 2 && "border-primary/40 text-primary",
                        )}
                      >
                        {label}
                      </div>
                    </div>
                    {i < 4 && <div className="h-px w-4 bg-border shrink-0 hidden sm:block" />}
                  </div>
                ))}
              </div>

              <p className="text-xs text-muted-foreground/70 leading-relaxed max-w-md">
                A simplified view of how I think about intelligent systems: context enters,
                structure is recovered, decisions are made, actions are taken, and results are
                checked before they leave.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          7. PERFORMANCE
      ═══════════════════════════════════════ */}
      <section className="pb-28 md:pb-36">
        <Reveal>
          <SectionLabel>Performance</SectionLabel>
          <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Fast isn’t a feature.
            <span className="text-muted-foreground"> It’s a foundation.</span>
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mt-6 max-w-xl text-muted-foreground leading-relaxed">
            Latency, throughput, and reliability are not afterthoughts. They shape how people
            experience the product and how far the system can be pushed later.
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-px bg-border/40 border border-border/40">
          {["Request", "Process", "Data", "Response"].map((stage, i) => (
            <Reveal key={stage} delay={0.08 + i * 0.06}>
              <div className="bg-background p-6 sm:p-8 flex flex-col gap-4 min-h-[140px] justify-between group">
                <span className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground">
                  0{i + 1}
                </span>
                <div>
                  <p className="text-lg font-medium tracking-tight text-foreground transition-colors group-hover:text-primary">
                    {stage}
                  </p>
                  <div className="mt-3 h-px w-8 bg-border transition-all duration-300 group-hover:w-12 group-hover:bg-primary" />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════
          8. JOURNEY
      ═══════════════════════════════════════ */}
      <section className="pb-28 md:pb-36">
        <Reveal>
          <SectionLabel>Journey</SectionLabel>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            How the work compounds
          </h2>
        </Reveal>

        <div className="mt-14 relative">
          <div className="absolute left-[18px] top-2 bottom-2 w-px bg-border/60 hidden sm:block" />
          <div className="space-y-0">
            {journey.map((item, i) => (
              <Reveal key={item.step} delay={i * 0.05}>
                <div className="relative flex gap-8 sm:gap-12 py-6 sm:py-8 group">
                  <div className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-background text-[11px] font-medium tracking-wider text-muted-foreground transition-colors group-hover:border-primary group-hover:text-primary">
                    {item.step}
                  </div>
                  <div className="pt-1.5">
                    <h3 className="text-lg font-medium tracking-tight text-foreground">
                      {item.label}
                    </h3>
                    <p className="mt-1.5 text-sm text-muted-foreground max-w-md leading-relaxed">
                      {item.text}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          9. VISION + MISSION (more attractive)
      ═══════════════════════════════════════ */}
      <section className="pb-28 md:pb-36">
        <div className="grid gap-6 md:grid-cols-2">
          <Reveal>
            <motion.div
              whileHover={prefersReducedMotion ? {} : { y: -6 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative h-full overflow-hidden border border-border/50 bg-background p-8 sm:p-10 flex flex-col justify-between min-h-[320px] group"
            >
              <div className="absolute inset-0 bg-linear-to-br from-primary/8 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <SectionLabel>Vision</SectionLabel>
                <h3 className="mt-8 text-2xl sm:text-3xl font-semibold tracking-tight text-foreground leading-snug">
                  Software that absorbs complexity
                  <span className="text-muted-foreground"> instead of reflecting it.</span>
                </h3>
              </div>
              <p className="relative mt-8 text-sm text-muted-foreground leading-relaxed max-w-sm">
                The systems worth building are the ones that make hard problems feel simpler for the
                people who use them — without hiding the important details from the people who
                maintain them.
              </p>
            </motion.div>
          </Reveal>

          <Reveal delay={0.1}>
            <motion.div
              whileHover={prefersReducedMotion ? {} : { y: -6 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative h-full overflow-hidden border border-border/50 bg-muted/30 p-8 sm:p-10 flex flex-col justify-between min-h-[320px] group"
            >
              <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <SectionLabel>Mission</SectionLabel>
                <h3 className="mt-8 text-2xl sm:text-3xl font-semibold tracking-tight text-foreground leading-snug">
                  Keep shipping work that earns its place.
                </h3>
              </div>
              <p className="relative mt-8 text-sm text-muted-foreground leading-relaxed max-w-sm">
                I want to contribute tools, interfaces, and patterns that other engineers can trust
                — and that product teams can build on without constantly renegotiating the
                foundation.
              </p>
            </motion.div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          10. CURRENTLY EXPLORING
      ═══════════════════════════════════════ */}
      <section className="pb-28 md:pb-36">
        <Reveal>
          <SectionLabel>Currently Exploring</SectionLabel>
        </Reveal>

        <div className="mt-8 flex flex-wrap gap-3">
          {exploring.map((item, i) => (
            <Reveal key={item} delay={i * 0.03}>
              <motion.span
                whileHover={prefersReducedMotion ? {} : { y: -3, scale: 1.03 }}
                transition={{ duration: 0.25 }}
                className="inline-flex items-center border border-border/60 bg-background/50 px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground cursor-default"
              >
                {item}
              </motion.span>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════
          11. PERSONAL SIDE
      ═══════════════════════════════════════ */}
      <section className="pb-28 md:pb-36">
        <Reveal>
          <SectionLabel>Outside the stack</SectionLabel>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            A few things that keep the work human
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-8 sm:grid-cols-2">
          {personalNotes.map((note, i) => (
            <Reveal key={note.label} delay={i * 0.05}>
              <div className="space-y-2">
                <p className="text-[11px] tracking-[0.18em] uppercase text-muted-foreground">
                  {note.label}
                </p>
                <p className="text-base text-foreground leading-relaxed">{note.value}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════
          12 + 13. CTA (your ABOUTCTA)
      ═══════════════════════════════════════ */}
      <section className="pb-24 md:pb-32">
        <ABOUTCTA />
      </section>
    </div>
  );
}
