"use client";

import { ArrowDown, ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

export default function ScrollToTopBottom() {
  const [isNearTop, setIsNearTop] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Show button after scrolling a bit
      setIsVisible(scrollY > 200);

      // Near top or near bottom
      const distanceFromBottom = documentHeight - (scrollY + windowHeight);
      setIsNearTop(distanceFromBottom > 400); // if far from bottom → show down arrow
    };

    handleScroll(); // initial check
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={isNearTop ? scrollToBottom : scrollToTop}
      aria-label={isNearTop ? "Scroll to bottom" : "Scroll to top"}
      className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-border bg-background/90 text-foreground shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-primary hover:text-primary-foreground active:scale-95"
    >
      {isNearTop ? (
        <ArrowDown className="h-5 w-5" strokeWidth={2.2} />
      ) : (
        <ArrowUp className="h-5 w-5" strokeWidth={2.2} />
      )}
    </button>
  );
}
