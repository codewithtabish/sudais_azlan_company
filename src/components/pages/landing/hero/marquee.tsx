"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface MarqueeProps extends React.ComponentPropsWithoutRef<"div"> {
  children: React.ReactNode;
  className?: string;
  duration?: number;
  delay?: number;
  gap?: number;
  pauseOnHover?: boolean;
  repeat?: number;
  reverse?: boolean;
  vertical?: boolean;
}

function Marquee({
  children,
  className,
  duration = 40,
  delay = 0,
  gap = 1,
  pauseOnHover = false,
  repeat = 2,
  reverse = false,
  vertical = false,
  ...rest
}: MarqueeProps) {
  const items = React.useMemo(() => Array.from({ length: Math.max(1, repeat) }), [repeat]);

  return (
    <div
      style={
        {
          "--marquee-duration": `${duration}s`,
          "--marquee-delay": `${delay}s`,
          "--marquee-gap": `${gap}rem`,
        } as React.CSSProperties
      }
      className={cn(
        "group flex gap-(--marquee-gap) overflow-hidden p-3",
        vertical ? "flex-col" : "flex-row",
        className,
      )}
      {...rest}
    >
      {items.map((_, index) => (
        <div
          key={index}
          aria-hidden={index > 0}
          className={cn(
            "flex shrink-0 justify-around gap-(--marquee-gap) [animation-delay:var(--marquee-delay)]",
            vertical ? "animate-marquee-vertical flex-col" : "animate-marquee-horizontal flex-row",
            pauseOnHover && "group-hover:paused",
            reverse && "shimmer-reverse",
          )}
        >
          {children}
        </div>
      ))}
    </div>
  );
}

export { Marquee, type MarqueeProps };
