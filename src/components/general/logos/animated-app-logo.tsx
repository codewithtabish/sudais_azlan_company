"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { useState } from "react";

/**
 * AnimatedLogo — "S.AZLAN"
 *
 * A wordmark built from your shadcn/ui theme tokens (bg-background,
 * text-foreground, bg-primary, etc.) so it adapts automatically to
 * light/dark mode — no hard-coded colors anywhere.
 *
 * Signature move: the period between "S" and "AZLAN" is a live
 * "pulse" dot in your primary color — it breathes on load and flares
 * into a short comet trail on hover, like a cursor/status indicator
 * signing the name. Letters rise in with a tight stagger on mount.
 *
 * Usage:
 *   import { AnimatedLogo } from "@/components/animated-logo";
 *   <AnimatedLogo />
 */

const NAME = "AZLAN";

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

const container: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.045,
      delayChildren: 0.15,
    },
  },
};

const letter: Variants = {
  hidden: { y: 14, opacity: 0, filter: "blur(4px)" },
  show: {
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: EASE_OUT_EXPO },
  },
};

export function AnimatedLogo({ className = "" }: { className?: string }) {
  const [hovered, setHovered] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      role="img"
      aria-label="S.AZLAN logo"
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      initial="hidden"
      animate="show"
      variants={container}
      className={`group relative inline-flex select-none items-center gap-[0.06em] font-sans ${className}`}
    >
      {/* S */}
      <motion.span
        variants={letter}
        className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
      >
        S
      </motion.span>

      {/* Pulsing period — the signature element */}
      <span className="relative mx-[0.02em] flex h-[1.6em] w-[0.5em] items-end justify-center pb-[0.14em]">
        {/* ambient breathing glow */}
        {!prefersReducedMotion && (
          <motion.span
            aria-hidden
            className="absolute h-2.5 w-2.5 rounded-full bg-primary/40 blur-md"
            animate={{
              scale: hovered ? [1, 1.8, 1] : [1, 1.35, 1],
              opacity: hovered ? [0.5, 0.9, 0.5] : [0.35, 0.6, 0.35],
            }}
            transition={{
              duration: hovered ? 0.9 : 2.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}
        {/* comet trail on hover */}
        {!prefersReducedMotion && (
          <motion.span
            aria-hidden
            className="absolute h-[2px] rounded-full bg-linear-to-r from-transparent via-primary to-transparent"
            animate={
              hovered
                ? { width: ["0%", "180%", "0%"], opacity: [0, 1, 0] }
                : { width: "0%", opacity: 0 }
            }
            transition={{ duration: 0.85, ease: "easeInOut" }}
          />
        )}
        {/* the dot itself */}
        <motion.span
          className="relative z-10 h-[6px] w-[6px] rounded-full bg-primary shadow-[0_0_10px_hsl(var(--primary)/0.7)]"
          animate={{ scale: hovered ? 1.35 : 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
        />
      </span>

      {/* AZLAN */}
      <span className="flex overflow-hidden">
        {NAME.split("").map((char, i) => (
          <motion.span
            key={i}
            variants={letter}
            className="relative text-3xl font-bold tracking-tight sm:text-4xl"
          >
            <span
              className="bg-clip-text text-transparent transition-[background-position] duration-700 ease-out"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, hsl(var(--foreground)) 0%, hsl(var(--foreground)) 40%, hsl(var(--primary)) 50%, hsl(var(--foreground)) 60%, hsl(var(--foreground)) 100%)",
                backgroundSize: "250% 100%",
                backgroundPosition: hovered ? "0% 0%" : "100% 0%",
              }}
            >
              {char}
            </span>
          </motion.span>
        ))}
      </span>

      {/* underline sweep on hover */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute -bottom-1 left-0 h-[2px] rounded-full bg-primary"
        style={{ transformOrigin: "left" }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: hovered ? 1 : 0 }}
        transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
      />
    </motion.div>
  );
}

export default AnimatedLogo;
