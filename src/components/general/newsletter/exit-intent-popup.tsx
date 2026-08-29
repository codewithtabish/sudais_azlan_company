"use client";
import { subscribeNewsletterAction } from "@/app/actions/subscribe/subscribe-newsletter-action";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import confetti from "canvas-confetti";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

const NEWSLETTER_SUBSCRIBED_KEY = "sudaisazlan_newsletter_subscribed";
const POPUP_DISMISSED_KEY = "sudaisazlan_newsletter_popup_dismissed";
const NEWSLETTER_SUBSCRIBED_EVENT = "sudaisazlan:newsletter-subscribed";

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function getSubscribedEmails(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(NEWSLETTER_SUBSCRIBED_KEY);
    if (!stored || stored === "true") return [];
    const parsed: unknown = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((value): value is string => typeof value === "string")
      .map(normalizeEmail)
      .filter(Boolean);
  } catch {
    return [];
  }
}

function hasAnySubscription() {
  return getSubscribedEmails().length > 0;
}

function saveSubscribedEmail(email: string) {
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail) return;
  const existingEmails = getSubscribedEmails();
  if (existingEmails.includes(normalizedEmail)) return;
  localStorage.setItem(
    NEWSLETTER_SUBSCRIBED_KEY,
    JSON.stringify([...existingEmails, normalizedEmail]),
  );
}

function getInitialDismissedState() {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(POPUP_DISMISSED_KEY) === "true";
}

function getInitialSubscribedState() {
  if (typeof window === "undefined") return false;
  return hasAnySubscription();
}

function fireConfetti() {
  confetti({
    particleCount: 140,
    spread: 85,
    startVelocity: 30,
    origin: { x: 0.5, y: 0.5 },
    colors: [
      "hsl(var(--primary))",
      "hsl(var(--foreground))",
      "#22c55e",
      "#4ade80",
      "#86efac",
      "#ffffff",
    ],
  });
}

export default function ExitIntentPopup() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(getInitialSubscribedState);
  const [dismissed, setDismissed] = useState(getInitialDismissedState);

  useEffect(() => {
    const handleNewsletterSubscribed = () => {
      setSubscribed(true);
      setDismissed(true);
      setOpen(false);
    };
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== NEWSLETTER_SUBSCRIBED_KEY) return;
      if (getSubscribedEmails().length > 0) {
        setSubscribed(true);
        setDismissed(true);
        setOpen(false);
      }
    };
    window.addEventListener(NEWSLETTER_SUBSCRIBED_EVENT, handleNewsletterSubscribed);
    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener(NEWSLETTER_SUBSCRIBED_EVENT, handleNewsletterSubscribed);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  useEffect(() => {
    if (dismissed || subscribed || hasAnySubscription()) return;
    const handleMouseLeave = (event: MouseEvent) => {
      const isSubscribed = hasAnySubscription();
      const isDismissed = sessionStorage.getItem(POPUP_DISMISSED_KEY) === "true";
      if (isSubscribed || isDismissed || event.clientY > 5) return;
      setOpen(true);
    };
    document.addEventListener("mouseout", handleMouseLeave);
    let mobileTimer: ReturnType<typeof setTimeout> | undefined;
    const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) {
      mobileTimer = setTimeout(() => {
        const isSubscribed = hasAnySubscription();
        const isDismissed = sessionStorage.getItem(POPUP_DISMISSED_KEY) === "true";
        if (isSubscribed || isDismissed) return;
        setOpen(true);
      }, 5000);
    }
    return () => {
      document.removeEventListener("mouseout", handleMouseLeave);
      if (mobileTimer) clearTimeout(mobileTimer);
    };
  }, [dismissed, subscribed]);

  const dismissForSession = () => {
    sessionStorage.setItem(POPUP_DISMISSED_KEY, "true");
    setDismissed(true);
    setOpen(false);
  };

  const handleDialogChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      if (open) dismissForSession();
      return;
    }
    if (subscribed || hasAnySubscription()) {
      setOpen(false);
      return;
    }
    const isDismissed = sessionStorage.getItem(POPUP_DISMISSED_KEY) === "true";
    if (dismissed || isDismissed) {
      setOpen(false);
      return;
    }
    setOpen(true);
  };

  const markAsSubscribed = (subscribedEmail: string) => {
    saveSubscribedEmail(subscribedEmail);
    window.dispatchEvent(new Event(NEWSLETTER_SUBSCRIBED_EVENT));
    sessionStorage.setItem(POPUP_DISMISSED_KEY, "true");
    setSubscribed(true);
    setDismissed(true);
    setOpen(false);
  };

  const handleSubscribe = async () => {
    if (loading || subscribed) return;
    const trimmedEmail = normalizeEmail(email);
    if (!trimmedEmail || !trimmedEmail.includes("@") || !trimmedEmail.includes(".")) {
      return;
    }
    if (getSubscribedEmails().includes(trimmedEmail)) {
      markAsSubscribed(trimmedEmail);
      return;
    }
    setLoading(true);
    try {
      const result = await subscribeNewsletterAction(trimmedEmail);
      if (!result.success) {
        const message = result.message?.toLowerCase() ?? "";
        const isDuplicate =
          message.includes("already subscribed") ||
          message.includes("already a subscriber") ||
          message.includes("already exists");
        if (isDuplicate) markAsSubscribed(trimmedEmail);
        return;
      }
      markAsSubscribed(trimmedEmail);
      setEmail("");
      fireConfetti();
    } catch (error) {
      console.error("Newsletter subscription failed:", error);
    } finally {
      setLoading(false);
    }
  };

  if (dismissed || subscribed) return null;

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogOverlay className="fixed inset-0 z-[9998] bg-black/55 backdrop-blur-[1.5px] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0" />
      <DialogContent
        className="z-[9999] m-0 flex max-w-none -translate-x-1/2 -translate-y-1/2 items-center justify-center overflow-visible border-0 bg-transparent p-0 shadow-none outline-none ring-0"
        style={{
          width: "min(80vw, 80vh, 620px)",
          height: "min(80vw, 80vh, 620px)",
          maxWidth: "80vw",
          maxHeight: "80vh",
        }}
      >
        <div className="relative h-full w-full">
          {/* Close button */}
          <button
            type="button"
            aria-label="Close newsletter popup"
            onClick={dismissForSession}
            className="absolute -right-2 -top-2 z-[100] flex h-10 w-10 items-center justify-center rounded-full bg-white text-zinc-600 shadow-md transition-colors hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 sm:-right-3 sm:-top-3 sm:h-11 sm:w-11"
          >
            <X className="h-5 w-5 stroke-[2.5]" />
          </button>

          {/* Outer green ring */}
          <div className="absolute inset-0 rounded-full border-[6px] border-emerald-500 bg-white shadow-[0_25px_80px_rgba(0,0,0,0.25)]" />

          {/* Inner content */}
          <div className="absolute inset-[6px] z-10 flex items-center justify-center overflow-hidden rounded-full bg-white">
            <div className="relative z-20 flex w-[82%] max-w-[380px] flex-col items-center justify-center px-2 text-center">
              {/* Small eyebrow */}
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500 sm:mb-3.5 sm:text-[12px]">
                Stay in the loop
              </p>

              {/* Main title */}
              <DialogTitle className="mx-auto max-w-[340px] p-0 text-[clamp(1.6rem,5.2vw,2.35rem)] font-black leading-[1.08] tracking-[-0.035em] text-zinc-900">
                Get project updates
              </DialogTitle>

              {/* Description */}
              <DialogDescription className="mx-auto mt-3 max-w-[320px] text-[clamp(0.85rem,2vw,1.05rem)] font-medium leading-snug text-zinc-600 sm:mt-3.5">
                New projects, selected work, and occasional notes from Sudais Azlan — straight to
                your inbox.
              </DialogDescription>

              {/* Form */}
              <div className="mt-6 w-full space-y-3.5 sm:mt-7 sm:space-y-4">
                <Input
                  type="email"
                  autoComplete="email"
                  placeholder="Email address"
                  value={email}
                  disabled={loading}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      void handleSubscribe();
                    }
                  }}
                  className="h-12 w-full rounded-lg border border-zinc-300 bg-white px-4 text-[14px] text-zinc-900 shadow-sm placeholder:text-zinc-400 focus-visible:border-emerald-500 focus-visible:ring-2 focus-visible:ring-emerald-500/20 sm:h-13 sm:text-[15px]"
                />

                <div className="flex items-start gap-2.5 px-0.5 text-left">
                  <Checkbox
                    id="newsletter-consent"
                    defaultChecked
                    disabled={loading}
                    className="mt-0.5 h-4.5 w-4.5 shrink-0 border-zinc-300 data-[state=checked]:border-emerald-500 data-[state=checked]:bg-emerald-500"
                  />
                  <Label
                    htmlFor="newsletter-consent"
                    className="cursor-pointer text-[12px] font-medium leading-[1.4] text-zinc-600 sm:text-[13px]"
                  >
                    Get occasional updates so you never miss new work.
                  </Label>
                </div>

                <Button
                  type="button"
                  disabled={loading}
                  onClick={() => void handleSubscribe()}
                  className="h-12 w-full rounded-lg bg-emerald-600 text-[14px] font-bold uppercase tracking-wide text-white shadow-md transition-all duration-200 hover:bg-emerald-700 hover:shadow-lg active:translate-y-0 sm:h-13 sm:text-[15px]"
                >
                  {loading ? "Subscribing..." : "Sign Me Up"}
                </Button>

                <button
                  type="button"
                  onClick={dismissForSession}
                  className="mx-auto block text-[13px] font-medium text-emerald-600 underline underline-offset-4 transition-opacity hover:opacity-70"
                >
                  No thanks
                </button>

                <p className="mx-auto max-w-[300px] text-[11px] leading-tight text-zinc-500 sm:text-[12px]">
                  By signing up, you agree to receive updates from Sudais Azlan.
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
