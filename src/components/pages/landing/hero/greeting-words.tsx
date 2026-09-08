"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const GREETINGS = [""];
const INTERVAL_MS = 2200;

const GreetingWord = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % GREETINGS.length);
    }, INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <span
      className="mr-1.5 inline-grid overflow-hidden align-baseline text-[0.72em] font-medium tracking-tight text-muted-foreground sm:text-[0.72em]"
      aria-live="polite"
    >
      {GREETINGS.map((word) => (
        <span
          key={word}
          className="invisible col-start-1 row-start-1 whitespace-nowrap"
          aria-hidden="true"
        >
          {word}
        </span>
      ))}

      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={GREETINGS[index]}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{
            duration: 0.45,
            ease: "easeInOut",
          }}
          className="col-start-1 row-start-1 inline-block whitespace-nowrap"
        >
          {GREETINGS[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

export default GreetingWord;
