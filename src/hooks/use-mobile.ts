import * as React from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  return React.useSyncExternalStore(
    // Subscribe
    (callback) => {
      const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
      mql.addEventListener("change", callback);
      return () => mql.removeEventListener("change", callback);
    },
    // Get current value on client
    () => window.innerWidth < MOBILE_BREAKPOINT,
    // Server snapshot (SSR)
    () => false,
  );
}
