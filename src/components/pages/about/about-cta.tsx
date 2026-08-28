"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

const ABOUTCTA = () => {
  const [email, setEmail] = useState("");
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="py-16 sm:py-20 lg:py-28">
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="overflow-hidden rounded-2xl border border-border/50 bg-card text-card-foreground shadow-sm"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left — Image */}
          <div className="relative min-h-[260px] sm:min-h-[320px] lg:min-h-full">
            <Image
              src="/images/about.png"
              alt="Workspace — writing, systems, and product thinking"
              fill
              className="object-contain"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/25 via-transparent to-transparent lg:bg-linear-to-r" />
          </div>

          {/* Right — Content */}
          <div className="flex flex-col justify-center gap-6 p-6 sm:p-8 lg:p-10 xl:p-12">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold leading-tight tracking-tight text-foreground sm:text-3xl">
                Explore insights, systems, and ideas that help you build better products.
              </h2>

              <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                Occasionally I write about the things I’m building, learning, and thinking through —
                no fixed cadence, just notes when something feels worth sharing.
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                // hook up to your real subscription logic
              }}
              className="flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <Input
                type="email"
                placeholder="Type your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={cn(
                  "h-11 flex-1 rounded-full border-border/60 bg-background",
                  "placeholder:text-muted-foreground/70",
                )}
                required
              />

              <Button type="submit" size="lg" className="h-11 shrink-0 rounded-full px-6">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default ABOUTCTA;
