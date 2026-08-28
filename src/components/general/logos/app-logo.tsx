"use client";

import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "framer-motion";

type CVStackedLogoProps = {
  className?: string;
  iconOnly?: boolean;
  showWordmark?: boolean;
  size?: "sm" | "md" | "lg";
};

const sizes = {
  sm: { icon: "size-7", wordmark: "text-base", lines: "w-13" },
  md: { icon: "size-8", wordmark: "text-lg", lines: "w-15" },
  lg: { icon: "size-10", wordmark: "text-xl", lines: "w-17" },
};

export function CVStackedLogo({
  className,
  iconOnly = false,
  showWordmark = true,
  size = "md",
}: CVStackedLogoProps) {
  const reduce = useReducedMotion();
  const shouldShowWordmark = showWordmark && !iconOnly;
  const dimensions = sizes[size];

  return (
    <motion.span
      initial={reduce ? false : { opacity: 0, y: 2 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      whileHover={reduce ? undefined : "hover"}
      className={cn("inline-flex items-center gap-2.5", className)}
    >
      <motion.span
        variants={{ hover: { y: -1 } }}
        transition={{ type: "spring", stiffness: 420, damping: 28 }}
        className={cn("relative inline-flex shrink-0 items-center justify-center", dimensions.icon)}
        aria-hidden="true"
      >
        <svg viewBox="0 0 32 32" fill="none" className="size-full overflow-visible">
          <motion.path
            d="M8 8.5A2.5 2.5 0 0 1 10.5 6H22l4 4v13.5A2.5 2.5 0 0 1 23.5 26h-13A2.5 2.5 0 0 1 8 23.5v-15Z"
            variants={{ hover: { x: 1, y: -1 } }}
            transition={{ type: "spring", stiffness: 420, damping: 28 }}
            className="fill-background stroke-foreground"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path d="M22 6v4h4" className="stroke-primary" strokeWidth="1.8" strokeLinejoin="round" />
          <motion.path
            d="M12 14h10M12 18h8"
            className="stroke-primary"
            strokeWidth="1.8"
            strokeLinecap="round"
            variants={{ hover: { x: 0.5 } }}
          />
          <motion.path
            d="M5.5 11.5v12A2.5 2.5 0 0 0 8 26h12"
            className="stroke-muted-foreground/55"
            strokeWidth="1.5"
            strokeLinecap="round"
            variants={{ hover: { x: -1, y: 1 } }}
          />
        </svg>
      </motion.span>

      {shouldShowWordmark && (
        <span className="relative flex flex-col leading-none">
          <motion.span
            initial={reduce ? false : { opacity: 0, x: -3 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.32, delay: 0.07, ease: "easeOut" }}
            className={cn("font-semibold tracking-tight text-foreground", dimensions.wordmark)}
          >
            <span className="font-bold">CV</span>Stacked
          </motion.span>
          <span className={cn("mt-1 flex flex-col gap-0.5", dimensions.lines)} aria-hidden="true">
            <motion.span
              initial={reduce ? false : { scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.36, delay: 0.14, ease: "easeOut" }}
              className="h-px w-full origin-left rounded-full bg-primary"
            />
            <motion.span
              initial={reduce ? false : { scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.3, delay: 0.2, ease: "easeOut" }}
              className="h-px w-[68%] origin-left rounded-full bg-primary/55"
            />
          </span>
        </span>
      )}
    </motion.span>
  );
}
