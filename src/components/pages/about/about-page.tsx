"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  BrainCircuit,
  Check,
  Code2,
  Database,
  Lightbulb,
  MapPin,
  Rocket,
  Sparkles,
  Workflow,
  Wrench,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

import ABOUTCTA from "./about-cta";

/* ==========================================================================
   TYPES
   ========================================================================== */

type Stat = {
  label: string;
  value: string;
};

type Capability = {
  title: string;
  description: string;
};

type Principle = {
  number: string;
  title: string;
  description: string;
};

type BuildStep = {
  number: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
};

/* ==========================================================================
   DATA
   ========================================================================== */

const STATS: Stat[] = [
  {
    value: "AI",
    label: "Engineering",
  },
  {
    value: "GenAI",
    label: "Applications",
  },
  {
    value: "Full",
    label: "Stack",
  },
];

const CAPABILITIES: Capability[] = [
  {
    title: "Artificial intelligence & generative AI",
    description:
      "Building practical AI systems, intelligent workflows, and generative AI experiences around real product problems.",
  },
  {
    title: "Backend & scalable systems",
    description:
      "Designing reliable APIs, backend services, databases, integrations, and infrastructure for growing products.",
  },
  {
    title: "Full-stack product engineering",
    description:
      "Taking ideas from interface to backend and turning product requirements into complete, usable software.",
  },
  {
    title: "AI-powered applications",
    description:
      "Combining software engineering with modern AI capabilities to create useful applications and intelligent products.",
  },
  {
    title: "Automation & developer tooling",
    description:
      "Automating repetitive work and creating tools, workflows, and systems that make teams and products more effective.",
  },
];

const PRINCIPLES: Principle[] = [
  {
    number: "01",
    title: "Build for the problem",
    description:
      "Technology should solve a meaningful problem first. I focus on understanding what needs to be built before deciding how to build it.",
  },
  {
    number: "02",
    title: "Make intelligence useful",
    description:
      "AI is most valuable when it becomes part of a useful product, workflow, or experience rather than existing only as a technical demonstration.",
  },
  {
    number: "03",
    title: "Keep engineering practical",
    description:
      "Good engineering balances architecture, performance, maintainability, user experience, and the reality of shipping a product.",
  },
];

const HOW_I_BUILD: BuildStep[] = [
  {
    number: "01",
    title: "Understand",
    description:
      "I start with the problem, the people experiencing it, and the outcome the product actually needs to create.",
    icon: Lightbulb,
  },
  {
    number: "02",
    title: "Design",
    description:
      "I turn the idea into a clear product and technical direction, choosing the simplest architecture that can support the goal.",
    icon: Wrench,
  },
  {
    number: "03",
    title: "Engineer",
    description:
      "I build across the stack — interfaces, APIs, databases, AI systems, integrations, and the infrastructure connecting everything together.",
    icon: Code2,
  },
  {
    number: "04",
    title: "Integrate",
    description:
      "AI is connected to the actual product workflow, data, tools, and user experience instead of being treated as an isolated feature.",
    icon: BrainCircuit,
  },
  {
    number: "05",
    title: "Refine",
    description:
      "I test, measure, simplify, and improve the system until the experience feels reliable, useful, and ready for real users.",
    icon: Workflow,
  },
  {
    number: "06",
    title: "Ship",
    description:
      "The goal is not a perfect prototype. It is a dependable product that can be deployed, used, learned from, and improved.",
    icon: Rocket,
  },
];

/* ==========================================================================
   CUSTOM SVG — BACK / RETURN ICON
   ========================================================================== */

function BackIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="size-4"
    >
      <path
        d="M9.5 5.5L4 12L9.5 18.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path d="M5 12H20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />

      <path
        d="M15.5 7.5L20 12L15.5 16.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.22"
      />
    </svg>
  );
}

/* ==========================================================================
   CUSTOM SVG — INTELLIGENT SYSTEM
   ========================================================================== */

function IntelligenceSVG() {
  return (
    <svg
      viewBox="0 0 520 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-auto w-full"
    >
      <defs>
        <radialGradient
          id="aiCoreGlow"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(260 150) rotate(90) scale(110)"
        >
          <stop offset="0" stopColor="currentColor" stopOpacity="0.14" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>

        <linearGradient
          id="aiCoreLine"
          x1="180"
          y1="80"
          x2="340"
          y2="230"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="currentColor" stopOpacity="0.75" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0.2" />
        </linearGradient>
      </defs>

      {/* Glow */}

      <circle cx="260" cy="150" r="110" fill="url(#aiCoreGlow)" />

      {/* Outer orbital rings */}

      <ellipse cx="260" cy="150" rx="154" ry="92" stroke="currentColor" strokeOpacity="0.09" />

      <ellipse
        cx="260"
        cy="150"
        rx="118"
        ry="70"
        stroke="currentColor"
        strokeOpacity="0.13"
        strokeDasharray="4 8"
      />

      {/* Network */}

      <path
        d="M142 150L191 94L260 72L329 94L378 150L329 206L260 228L191 206L142 150Z"
        stroke="currentColor"
        strokeOpacity="0.15"
        strokeWidth="1"
      />

      <path
        d="M191 94L329 94M142 150H378M191 206H329"
        stroke="currentColor"
        strokeOpacity="0.12"
        strokeWidth="1"
      />

      {/* Central AI hexagon */}

      <path
        d="M260 91L299 113.5V158.5L260 181L221 158.5V113.5L260 91Z"
        fill="currentColor"
        fillOpacity="0.035"
        stroke="url(#aiCoreLine)"
        strokeWidth="1.5"
      />

      {/* Inner neural connections */}

      <path
        d="M260 136V91M260 136L299 113.5M260 136L299 158.5M260 136V181M260 136L221 158.5M260 136L221 113.5"
        stroke="currentColor"
        strokeOpacity="0.3"
        strokeWidth="1"
      />

      {/* Core */}

      <circle
        cx="260"
        cy="136"
        r="15"
        fill="currentColor"
        fillOpacity="0.055"
        stroke="currentColor"
        strokeOpacity="0.55"
        strokeWidth="1.5"
      />

      <circle cx="260" cy="136" r="5" fill="currentColor" fillOpacity="0.75" />

      {/* Main nodes */}

      <circle cx="191" cy="94" r="6" fill="currentColor" fillOpacity="0.65" />

      <circle cx="329" cy="94" r="6" fill="currentColor" fillOpacity="0.65" />

      <circle cx="142" cy="150" r="5" fill="currentColor" fillOpacity="0.5" />

      <circle cx="378" cy="150" r="5" fill="currentColor" fillOpacity="0.5" />

      <circle cx="191" cy="206" r="6" fill="currentColor" fillOpacity="0.65" />

      <circle cx="329" cy="206" r="6" fill="currentColor" fillOpacity="0.65" />

      {/* Small satellite nodes */}

      <circle cx="92" cy="150" r="3" fill="currentColor" fillOpacity="0.3" />

      <circle cx="428" cy="150" r="3" fill="currentColor" fillOpacity="0.3" />

      <circle cx="260" cy="45" r="3" fill="currentColor" fillOpacity="0.3" />

      <circle cx="260" cy="255" r="3" fill="currentColor" fillOpacity="0.3" />

      {/* Satellite lines */}

      <path
        d="M92 150H142M378 150H428M260 45V72M260 228V255"
        stroke="currentColor"
        strokeOpacity="0.13"
        strokeDasharray="3 6"
      />
    </svg>
  );
}

/* ==========================================================================
   PROFILE CARD
   ========================================================================== */

function ProfileCard({ className }: { className?: string }) {
  const [isFlipped, setIsFlipped] = useState(false);

  const toggleFlip = () => {
    setIsFlipped((previous) => !previous);
  };

  return (
    <div className={cn("relative h-[620px] w-full [perspective:1600px] sm:h-[650px]", className)}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{
          duration: 0.7,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="relative h-full w-full"
      >
        <div
          role="button"
          tabIndex={0}
          aria-label={isFlipped ? "Show Sudais Azlan profile" : "Show more about Sudais Azlan"}
          aria-pressed={isFlipped}
          onClick={toggleFlip}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              toggleFlip();
            }
          }}
          className={cn(
            "relative h-full w-full cursor-pointer",
            "[transform-style:preserve-3d]",
            "transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            isFlipped && "[transform:rotateY(180deg)]",
          )}
        >
          {/* ================================================================
             FRONT
             ================================================================ */}

          <Card
            className={cn(
              "absolute inset-0 h-full w-full overflow-hidden",
              "rounded-[28px] border-border/70",
              "bg-card/80 shadow-sm",
              "[backface-visibility:hidden]",
            )}
          >
            <CardContent className="flex h-full flex-col p-5 sm:p-6 lg:p-7">
              <div className="relative overflow-hidden rounded-[22px] border border-border/70 bg-muted/30">
                <div className="relative aspect-[4/4.4] w-full">
                  <Image
                    src="/images/about.png"
                    alt="Sudais Azlan — AI Engineer and Software Engineer"
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 520px"
                    className="object-cover object-top"
                  />
                </div>

                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background/85 via-background/25 to-transparent" />

                <Badge
                  variant="secondary"
                  className={cn(
                    "absolute bottom-4 left-4",
                    "rounded-full border border-border/70",
                    "bg-background/90 px-3 py-1.5",
                    "text-xs font-medium shadow-sm backdrop-blur",
                  )}
                >
                  <span className="mr-1.5 inline-flex size-1.5 rounded-full bg-emerald-500" />
                  Building & experimenting
                </Badge>
              </div>

              <div className="pt-6 text-center">
                <h3 className="text-2xl font-semibold tracking-tight sm:text-3xl">Sudais Azlan</h3>

                <p className="mt-2 flex items-center justify-center gap-1.5 text-sm font-medium text-muted-foreground sm:text-base">
                  <MapPin className="size-4 shrink-0" />
                  AI Engineer · Software Engineer
                </p>
              </div>

              <Separator className="my-6" />

              <div className="grid grid-cols-3 divide-x divide-border overflow-hidden rounded-xl border border-border/70">
                {STATS.map((stat) => (
                  <div key={stat.label} className="min-w-0 px-2 py-4 text-center sm:px-4">
                    <p className="truncate text-lg font-semibold tracking-tight sm:text-xl">
                      {stat.value}
                    </p>

                    <p className="mt-1 truncate text-[11px] font-medium text-muted-foreground sm:text-xs">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-auto flex items-center justify-between gap-3 pt-5">
                <p className="text-xs text-muted-foreground">AI · Software · Products</p>

                <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
                  More
                  <ArrowUpRight className="size-3.5" />
                </span>
              </div>
            </CardContent>
          </Card>

          {/* ================================================================
             BACK
             ================================================================ */}

          <Card
            className={cn(
              "absolute inset-0 h-full w-full overflow-hidden",
              "rounded-[28px] border-border/70 bg-card",
              "[transform:rotateY(180deg)]",
              "[backface-visibility:hidden]",
            )}
          >
            <CardContent className="flex h-full flex-col p-5 sm:p-7">
              {/* BACK BUTTON */}

              <div className="flex items-center justify-between">
                <Badge variant="outline" className="rounded-full px-3 py-1">
                  <Sparkles className="mr-1.5 size-3.5" />
                  AI Engineer
                </Badge>

                <button
                  type="button"
                  aria-label="Flip back to profile"
                  onClick={(event) => {
                    event.stopPropagation();
                    toggleFlip();
                  }}
                  className={cn(
                    "group flex size-10 items-center justify-center",
                    "rounded-full border border-border/70",
                    "bg-background/70 backdrop-blur",
                    "transition-all duration-300",
                    "hover:-translate-x-0.5 hover:bg-muted",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  )}
                >
                  <BackIcon />

                  <span className="sr-only">Back to profile</span>
                </button>
              </div>

              {/* SVG */}

              <div className="relative mt-5 overflow-hidden rounded-[24px] border border-border/70 bg-muted/20">
                <div className="absolute inset-0 bg-gradient-to-br from-muted/30 via-transparent to-muted/20" />

                <motion.div
                  animate={{
                    scale: [1, 1.018, 1],
                    opacity: [0.82, 1, 0.82],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="relative px-3 py-2 text-foreground sm:px-5"
                >
                  <IntelligenceSVG />
                </motion.div>
              </div>

              {/* CONTENT */}

              <div className="mt-6">
                <h3 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                  Building intelligent software with purpose.
                </h3>

                <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-[15px]">
                  I work across artificial intelligence, generative AI, backend engineering,
                  full-stack development, APIs, automation, and product engineering.
                </p>
              </div>

              {/* SKILLS */}

              <div className="mt-auto space-y-3 pt-5">
                <Separator />

                <div className="grid gap-2">
                  {[
                    "Artificial intelligence",
                    "Generative AI",
                    "Backend engineering",
                    "Full-stack development",
                    "Automation & APIs",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3 text-sm font-medium">
                      <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-muted">
                        <Check className="size-3" />
                      </span>

                      {item}
                    </div>
                  ))}
                </div>

                <p className="pt-1 text-[11px] text-muted-foreground">
                  Use the arrow above to return.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}

/* ==========================================================================
   WHAT I DO
   ========================================================================== */

function WhatIDo() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.7,
        delay: 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="h-full"
    >
      <Card className="h-full rounded-[28px] border-border/70 bg-card/80 shadow-sm">
        <CardContent className="flex h-full flex-col p-6 sm:p-8 lg:p-10">
          <div className="flex items-start justify-between gap-6">
            <Badge variant="secondary" className="rounded-full px-3 py-1.5 font-medium">
              <Code2 className="mr-1.5 size-3.5" />
              What I do
            </Badge>

            <div className="flex size-11 shrink-0 items-center justify-center rounded-full border border-border/70">
              <ArrowUpRight className="size-5" />
            </div>
          </div>

          <div className="mt-8">
            <h2 className="max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl lg:text-[42px] lg:leading-[1.1]">
              From intelligent ideas to real software.
            </h2>

            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              My work spans artificial intelligence, generative AI, backend engineering, full-stack
              development, APIs, automation, and product engineering. I like working close to the
              actual problem instead of building technology just for the sake of technology.
            </p>
          </div>

          <Separator className="my-7" />

          <div className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
            {CAPABILITIES.map((capability) => (
              <div key={capability.title} className="group flex items-start gap-3">
                <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-foreground transition-transform duration-300 group-hover:scale-105">
                  <Check className="size-3.5" />
                </span>

                <div>
                  <p className="text-sm font-semibold leading-6 sm:text-[15px]">
                    {capability.title}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-auto pt-8">
            <Button asChild className="group h-11 rounded-full px-5">
              <Link href="/projects">
                Explore my work
                <span className="ml-2 flex size-6 items-center justify-center rounded-full bg-background/15 transition-transform duration-300 group-hover:translate-x-0.5">
                  <ArrowRight className="size-3.5" />
                </span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

/* ==========================================================================
   VISION
   ========================================================================== */

function VisionSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <Card className="overflow-hidden rounded-[28px] border-border/70 bg-card/80 shadow-sm">
        <CardContent className="p-6 sm:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
            <div>
              <Badge variant="outline" className="rounded-full px-3 py-1.5">
                <BrainCircuit className="mr-1.5 size-3.5" />
                Vision
              </Badge>

              <h2 className="mt-5 text-2xl font-semibold tracking-tight sm:text-3xl">
                Build technology that makes people more capable.
              </h2>
            </div>

            <div className="space-y-5">
              <p className="text-lg leading-8 text-foreground sm:text-xl sm:leading-9">
                My vision is to help shape software where intelligent systems are not just
                impressive, but genuinely useful — technology that helps people create, learn, work,
                and solve difficult problems better.
              </p>

              <p className="text-base leading-7 text-muted-foreground">
                I believe the next generation of products will bring together strong software
                engineering, thoughtful product design, and intelligent systems. I want to build in
                that space and turn emerging technology into experiences people can actually use.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

/* ==========================================================================
   HOW I BUILD
   ========================================================================== */

function HowIBuildSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <Card className="overflow-hidden rounded-[28px] border-border/70 bg-card/80 shadow-sm">
        <CardContent className="p-6 sm:p-8 lg:p-10">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div className="max-w-3xl">
              <Badge variant="outline" className="rounded-full px-3 py-1.5">
                <Wrench className="mr-1.5 size-3.5" />
                How I build
              </Badge>

              <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-[42px] lg:leading-[1.1]">
                From problem to product, one thoughtful step at a time.
              </h2>
            </div>

            <p className="max-w-md text-sm leading-6 text-muted-foreground sm:text-base">
              I combine product thinking, software engineering, and AI to move from an initial idea
              to something people can actually use.
            </p>
          </div>

          <Separator className="my-8 lg:my-10" />

          <div className="grid gap-px overflow-hidden rounded-2xl border border-border/70 bg-border sm:grid-cols-2 lg:grid-cols-3">
            {HOW_I_BUILD.map((step) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.number}
                  className="group relative bg-card p-6 transition-colors duration-300 hover:bg-muted/40 sm:p-7"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex size-11 items-center justify-center rounded-xl border border-border/70 bg-muted/50 transition-transform duration-300 group-hover:scale-105">
                      <Icon className="size-5" />
                    </div>

                    <span className="text-xs font-semibold tracking-[0.18em] text-muted-foreground">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="mt-7 text-lg font-semibold tracking-tight">{step.title}</h3>

                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{step.description}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex flex-col gap-5 rounded-2xl border border-border/70 bg-muted/30 p-6 sm:p-7 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-background">
                <Database className="size-4" />
              </div>

              <div>
                <p className="text-sm font-semibold">Technology follows the problem.</p>

                <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
                  The stack can change. The goal stays the same: build something useful, reliable,
                  understandable, and ready for the real world.
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2 text-xs font-medium text-muted-foreground">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              Think · Build · Learn · Improve
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

/* ==========================================================================
   MISSION
   ========================================================================== */

function MissionSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <Card className="overflow-hidden rounded-[28px] border-border/70 bg-card/80 shadow-sm">
        <CardContent className="p-6 sm:p-8 lg:p-10">
          <div className="mb-9 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <Badge variant="outline" className="rounded-full px-3 py-1.5">
                <Workflow className="mr-1.5 size-3.5" />
                Mission
              </Badge>

              <h2 className="mt-5 text-2xl font-semibold tracking-tight sm:text-3xl">
                Turn complexity into useful, dependable software.
              </h2>
            </div>

            <p className="max-w-md text-sm leading-6 text-muted-foreground">
              A practical approach to AI and engineering: understand the problem, build the right
              system, and make it useful in the real world.
            </p>
          </div>

          <div className="grid gap-px overflow-hidden rounded-2xl border border-border/70 bg-border md:grid-cols-3">
            {PRINCIPLES.map((principle) => (
              <div key={principle.number} className="bg-card p-6 sm:p-7">
                <span className="text-xs font-semibold tracking-[0.18em] text-muted-foreground">
                  {principle.number}
                </span>

                <h3 className="mt-6 text-lg font-semibold">{principle.title}</h3>

                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {principle.description}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

/* ==========================================================================
   MAIN ABOUT PAGE CONTENT
   ========================================================================== */

const AboutPageContentSection = () => {
  return (
    <main className="overflow-hidden">
      <section id="about" className="relative py-16 sm:py-20 lg:py-28">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* HEADER */}

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.65,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mb-10 max-w-3xl sm:mb-14"
          >
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-8 bg-border" />

              <span className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                About Sudais
              </span>
            </div>

            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              Engineering intelligent software for the problems that matter.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              I&apos;m Sudais Azlan, an AI Engineer and Software Engineer focused on artificial
              intelligence, generative AI, software systems, and building products from idea to
              reality.
            </p>
          </motion.div>

          {/* MAIN ABOUT GRID */}

          <div className="grid items-stretch gap-6 lg:grid-cols-[minmax(320px,0.82fr)_minmax(0,1.18fr)]">
            <ProfileCard />

            <WhatIDo />
          </div>

          {/* VISION */}

          <div className="mt-6">
            <VisionSection />
          </div>

          {/* HOW I BUILD */}

          <div className="mt-6">
            <HowIBuildSection />
          </div>

          {/* MISSION */}

          <div className="mt-6">
            <MissionSection />
          </div>
        </div>
      </section>

      {/* CTA */}

      <ABOUTCTA />
    </main>
  );
};

export default AboutPageContentSection;
