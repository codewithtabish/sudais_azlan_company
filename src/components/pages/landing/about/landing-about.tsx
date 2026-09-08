"use client";

import { useEffect, useState } from "react";
import { AnimatedSpan, Terminal, TypingAnimation } from "@/components/ui/terminal";

export function LandingPageTerminal() {
  const [key, setKey] = useState(0);

  // Restart the whole terminal animation after it finishes
  useEffect(() => {
    const timer = setTimeout(() => {
      setKey((prev) => prev + 1);
    }, 22000); // Adjust this time based on how long the full sequence takes

    return () => clearTimeout(timer);
  }, [key]);

  return (
    <Terminal key={key} className="max-h-[420px] overflow-hidden">
      <TypingAnimation>&gt; whoami</TypingAnimation>

      <AnimatedSpan className="text-primary">✔ Sudais Azlan — AI & Software Engineer</AnimatedSpan>

      <TypingAnimation className="text-muted-foreground">Loading profile...</TypingAnimation>

      <AnimatedSpan className="text-primary/90">✔ Intelligent systems</AnimatedSpan>
      <AnimatedSpan className="text-primary/90">✔ Generative AI products</AnimatedSpan>
      <AnimatedSpan className="text-primary/90">✔ High-performance APIs</AnimatedSpan>
      <AnimatedSpan className="text-primary/90">✔ Scalable applications</AnimatedSpan>

      <TypingAnimation className="text-primary">
        Focus → Practical AI that solves real problems
      </TypingAnimation>

      <AnimatedSpan className="text-primary/90">
        ✔ Artificial Intelligence & Generative AI
      </AnimatedSpan>
      <AnimatedSpan className="text-primary/90">✔ Backend & Scalable Systems</AnimatedSpan>
      <AnimatedSpan className="text-primary/90">✔ Full-stack Product Engineering</AnimatedSpan>
      <AnimatedSpan className="text-primary/90">✔ AI-powered Applications</AnimatedSpan>
      <AnimatedSpan className="text-primary/90">✔ Automation & Developer Tooling</AnimatedSpan>

      <TypingAnimation className="text-muted-foreground">
        Philosophy: Build technology close to the actual problem.
      </TypingAnimation>

      <AnimatedSpan className="text-primary">✔ From intelligent ideas → real software</AnimatedSpan>

      <TypingAnimation className="text-primary font-medium">
        Status: Available for opportunities
      </TypingAnimation>

      <TypingAnimation className="text-muted-foreground">
        Ready to turn complex problems into production-ready solutions.
      </TypingAnimation>
    </Terminal>
  );
}
