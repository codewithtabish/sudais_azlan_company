"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, ChevronRight, Plus, Search, X } from "lucide-react";
import Link from "next/link";
import { useCallback, useId, useMemo, useState } from "react";
import ABOUTCTA from "../about/about-cta";

/* -------------------------------------------------------------------------- */
/*  Types & Data                                                              */
/* -------------------------------------------------------------------------- */

type FAQItem = {
  id: string;
  category: string;
  question: string;
  answer: string;
};

const FAQ_DATA: FAQItem[] = [
  {
    id: "01",
    category: "General",
    question: "What kind of work do you focus on?",
    answer:
      "I design and build software systems — from product architecture and APIs to AI-powered features and thoughtful interfaces. The through-line is clarity: making complex systems feel simple and reliable.",
  },
  {
    id: "02",
    category: "General",
    question: "Are you available for new projects?",
    answer:
      "Selectively. I take on a small number of collaborations each year where the problem space is interesting and the working relationship is mutual. Reach out with context — I respond to thoughtful notes.",
  },
  {
    id: "03",
    category: "Engineering",
    question: "How do you approach building production systems?",
    answer:
      "Start with the constraints. Define the interfaces, data flow, and failure modes first. Then implement the smallest correct version, instrument it, and iterate. I prefer boring, well-understood patterns over clever ones unless the problem demands otherwise.",
  },
  {
    id: "04",
    category: "Engineering",
    question: "What does your typical tech stack look like?",
    answer:
      "TypeScript, Next.js, React, Node, PostgreSQL, and whatever best fits the domain. For AI work I lean on the current generation of models with careful evaluation, retrieval, and guardrails. The stack is a tool, not an identity.",
  },
  {
    id: "05",
    category: "AI & Systems",
    question: "How do you think about shipping AI features?",
    answer:
      "Treat the model as an unreliable but powerful component. Design for partial failure, measure quality continuously, and keep humans in the loop where stakes are high. The goal is useful systems, not demos.",
  },
  {
    id: "06",
    category: "AI & Systems",
    question: "Do you fine-tune models or stay with prompting + RAG?",
    answer:
      "Both, depending on the problem. Most product features start with strong prompting, retrieval, and evaluation. Fine-tuning enters when the distribution is narrow and the cost of latency or quality justifies it.",
  },
  {
    id: "07",
    category: "Projects",
    question: "Can I see more of your recent work?",
    answer:
      "Selected projects live on the work page. Some are public, others are under NDA. If something specific interests you, ask — I’m happy to share more context on process and decisions.",
  },
  {
    id: "08",
    category: "Projects",
    question: "Do you open-source anything?",
    answer:
      "When the work is general-purpose and the maintenance cost is reasonable, yes. I prefer small, focused utilities over large frameworks. Check the repositories linked from this site.",
  },
  {
    id: "09",
    category: "Collaboration",
    question: "What does a good collaboration look like for you?",
    answer:
      "Clear goals, direct communication, and shared ownership of quality. I work best with people who care about the craft and the outcome in equal measure. Process should serve the work, not the other way around.",
  },
  {
    id: "10",
    category: "Collaboration",
    question: "How do you prefer to communicate during a project?",
    answer:
      "Async by default — written updates, clear decisions, and recorded reasoning. Synchronous time is reserved for ambiguity, alignment, and creative work. I keep documentation light but current.",
  },
  {
    id: "11",
    category: "Writing",
    question: "Do you write about engineering and AI?",
    answer:
      "Occasionally. Notes on systems, model behavior, and product decisions appear here and in the newsletter. I write when I have something concrete to say, not on a fixed cadence.",
  },
];

const CATEGORIES = [
  "All",
  "General",
  "Engineering",
  "AI & Systems",
  "Projects",
  "Collaboration",
  "Writing",
] as const;

/* -------------------------------------------------------------------------- */
/*  Animation variants                                                        */
/* -------------------------------------------------------------------------- */

const easeOut = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.45, ease: easeOut },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.35, ease: easeOut } },
};

/* -------------------------------------------------------------------------- */
/*  Local components                                                          */
/* -------------------------------------------------------------------------- */

function SearchInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const id = useId();
  return (
    <div className="relative w-full min-w-0">
      <label htmlFor={id} className="sr-only">
        Search questions
      </label>
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden
      />
      <input
        id={id}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search questions..."
        className="h-11 w-full min-w-0 rounded-md border border-border bg-background pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        autoComplete="off"
      />
    </div>
  );
}

function CategoryNav({ active, onChange }: { active: string; onChange: (c: string) => void }) {
  return (
    <nav
      className="flex gap-1 overflow-x-auto pb-1 [-ms-overflow-style:none] scrollbar-none [&::-webkit-scrollbar]:hidden"
      aria-label="FAQ categories"
    >
      {CATEGORIES.map((cat) => {
        const isActive = active === cat;
        return (
          <button
            key={cat}
            type="button"
            onClick={() => onChange(cat)}
            className={`
              relative shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background
              ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }
            `}
            aria-pressed={isActive}
          >
            {cat}
          </button>
        );
      })}
    </nav>
  );
}

function FAQAccordionItem({
  item,
  isOpen,
  onToggle,
  index,
  reducedMotion,
}: {
  item: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
  reducedMotion: boolean | null;
}) {
  const contentId = `faq-content-${item.id}`;
  const triggerId = `faq-trigger-${item.id}`;

  return (
    <motion.div
      layout={!reducedMotion}
      initial={false}
      className="group border-b border-border last:border-b-0"
    >
      <button
        id={triggerId}
        type="button"
        aria-expanded={isOpen}
        aria-controls={contentId}
        onClick={onToggle}
        className="flex w-full min-w-0 items-start gap-4 py-5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <span
          className={`
            mt-0.5 shrink-0 font-mono text-xs tracking-wider transition-colors
            ${isOpen ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}
          `}
        >
          {item.id}
        </span>

        <span className="min-w-0 flex-1">
          <span
            className={`
              block text-[15px] font-medium leading-snug tracking-tight transition-transform duration-200
              sm:text-base
              ${isOpen ? "text-foreground" : "text-foreground/90 group-hover:translate-x-0.5"}
            `}
          >
            {item.question}
          </span>
        </span>

        <span
          className={`
            mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-all duration-200
            ${
              isOpen
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-muted-foreground group-hover:border-foreground/40 group-hover:text-foreground"
            }
          `}
        >
          {isOpen ? (
            <X className="h-3.5 w-3.5" strokeWidth={2} />
          ) : (
            <Plus className="h-3.5 w-3.5" strokeWidth={2} />
          )}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={contentId}
            role="region"
            aria-labelledby={triggerId}
            initial={reducedMotion ? { opacity: 1, height: "auto" } : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: easeOut }}
            className="overflow-hidden"
          >
            <div className="pb-6 pl-8 pr-2 sm:pl-10">
              <p className="max-w-2xl text-[15px] leading-relaxed text-muted-foreground wrap-break-word">
                {item.answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function ProcessBreak({ reducedMotion }: { reducedMotion: boolean | null }) {
  const steps = ["IDEA", "SYSTEM", "PRODUCT", "IMPACT"];

  return (
    <motion.section
      initial={reducedMotion ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount: 0.35 }}
      variants={fadeIn}
      className="my-16 border-y border-border py-12 sm:my-20 sm:py-16"
    >
      <div className="flex flex-col items-center gap-8">
        <p className="text-center text-sm font-medium tracking-widest text-muted-foreground uppercase">
          How work moves
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          {steps.map((step, i) => (
            <motion.div
              key={step}
              custom={i}
              variants={fadeUp}
              className="flex items-center gap-3 sm:gap-4"
            >
              <span className="font-mono text-sm tracking-widest text-foreground sm:text-base">
                {step}
              </span>
              {i < steps.length - 1 && (
                <ChevronRight className="h-4 w-4 text-muted-foreground/60" aria-hidden />
              )}
            </motion.div>
          ))}
        </div>
        <p className="max-w-md text-center text-sm leading-relaxed text-muted-foreground">
          The best systems make complexity feel simple.
        </p>
      </div>
    </motion.section>
  );
}

function ContactPrompt({ reducedMotion }: { reducedMotion: boolean | null }) {
  return (
    <motion.section
      initial={reducedMotion ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
      variants={fadeUp}
      custom={0}
      className="my-16 sm:my-20"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0 space-y-2">
          <p className="text-sm text-muted-foreground">
            Didn&apos;t find what you were looking for?
          </p>
          <h2 className="text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
            Let&apos;s talk about it.
          </h2>
        </div>
        <Link
          href="/#contact"
          className="group inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          Get in touch
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>
    </motion.section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Placeholder for existing subscription component                           */
/*  Replace this with your real <Subscribe /> / <Newsletter /> import         */
/* -------------------------------------------------------------------------- */

function SubscriptionPlaceholder() {
  return (
    <section className="mt-8 border-t border-border pt-12 pb-4">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0 space-y-2">
          <p className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
            Newsletter
          </p>
          <h2 className="text-xl font-medium tracking-tight text-foreground sm:text-2xl">
            Occasionally, I share what I&apos;m building, learning, and exploring.
          </h2>
        </div>
        {/* 
          REPLACE THIS BLOCK with your existing subscription component, e.g.:
          <Subscribe />
          or
          <NewsletterSignup />
        */}
        <form className="flex w-full max-w-sm min-w-0 gap-2" onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="faq-sub-email" className="sr-only">
            Email address
          </label>
          <input
            id="faq-sub-email"
            type="email"
            placeholder="you@example.com"
            className="h-10 min-w-0 flex-1 rounded-md border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <button
            type="submit"
            className="h-10 shrink-0 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function FAQPageComponent() {
  const reducedMotion = useReducedMotion();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("All");
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return FAQ_DATA.filter((item) => {
      const matchesCategory = category === "All" || item.category === category;
      if (!matchesCategory) return false;
      if (!q) return true;
      return item.question.toLowerCase().includes(q) || item.answer.toLowerCase().includes(q);
    });
  }, [query, category]);

  const handleToggle = useCallback((id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  }, []);

  // Group by category only when "All" is selected and no search
  const showGrouped = category === "All" && !query.trim();

  const grouped = useMemo(() => {
    if (!showGrouped) return null;
    const map = new Map<string, FAQItem[]>();
    for (const item of filtered) {
      const list = map.get(item.category) ?? [];
      list.push(item);
      map.set(item.category, list);
    }
    return Array.from(map.entries());
  }, [filtered, showGrouped]);

  return (
    <main className="min-w-0 w-full max-w-full overflow-x-hidden">
      {/* ---------------------------------------------------------------- */}
      {/*  Hero                                                            */}
      {/* ---------------------------------------------------------------- */}
      <header className="pt-10 pb-10 sm:pt-14 sm:pb-12">
        <motion.p
          custom={0}
          initial={reducedMotion ? false : "hidden"}
          animate="visible"
          variants={fadeUp}
          className="mb-3 text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase"
        >
          FAQ / Questions
        </motion.p>

        <motion.h1
          custom={1}
          initial={reducedMotion ? false : "hidden"}
          animate="visible"
          variants={fadeUp}
          className="max-w-2xl text-3xl font-medium tracking-tight text-foreground sm:text-4xl md:text-5xl"
        >
          Questions, answered.
        </motion.h1>

        <motion.p
          custom={2}
          initial={reducedMotion ? false : "hidden"}
          animate="visible"
          variants={fadeUp}
          className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground sm:text-base"
        >
          Practical answers about engineering, AI systems, projects, and how I work. Clear, direct,
          and without the marketing layer.
        </motion.p>

        {/* subtle accent line */}
        <motion.div
          custom={3}
          initial={reducedMotion ? false : "hidden"}
          animate="visible"
          variants={fadeUp}
          className="mt-8 h-px w-12 bg-primary"
          aria-hidden
        />
      </header>

      {/* ---------------------------------------------------------------- */}
      {/*  Search + Categories                                             */}
      {/* ---------------------------------------------------------------- */}
      <div className="mb-8 space-y-4 sm:mb-10">
        <SearchInput value={query} onChange={setQuery} />
        <CategoryNav active={category} onChange={setCategory} />
      </div>

      {/* ---------------------------------------------------------------- */}
      {/*  FAQ Content                                                     */}
      {/* ---------------------------------------------------------------- */}
      <section aria-label="Frequently asked questions">
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={reducedMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="py-16 text-center"
            >
              <p className="text-base font-medium text-foreground">No questions found.</p>
              <p className="mt-1 text-sm text-muted-foreground">Try another search or category.</p>
            </motion.div>
          ) : showGrouped && grouped ? (
            <motion.div
              key="grouped"
              initial={reducedMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-12"
            >
              {grouped.map(([cat, items], groupIndex) => (
                <div key={cat}>
                  <h2 className="mb-1 text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
                    {cat}
                  </h2>
                  <div className="border-t border-border">
                    {items.map((item, i) => (
                      <FAQAccordionItem
                        key={item.id}
                        item={item}
                        isOpen={openId === item.id}
                        onToggle={() => handleToggle(item.id)}
                        index={i}
                        reducedMotion={reducedMotion}
                      />
                    ))}
                  </div>

                  {/* Mid-page process break after first two groups */}
                  {groupIndex === 1 && <ProcessBreak reducedMotion={reducedMotion} />}
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="flat"
              initial={reducedMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="border-t border-border"
            >
              {filtered.map((item, i) => (
                <FAQAccordionItem
                  key={item.id}
                  item={item}
                  isOpen={openId === item.id}
                  onToggle={() => handleToggle(item.id)}
                  index={i}
                  reducedMotion={reducedMotion}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/*  Contact prompt                                                  */}
      {/* ---------------------------------------------------------------- */}
      <ContactPrompt reducedMotion={reducedMotion} />

      <ABOUTCTA />

      {/* ---------------------------------------------------------------- */}
      {/*  Subscription — replace with your existing component             */}
      {/* ---------------------------------------------------------------- */}
    </main>
  );
}
