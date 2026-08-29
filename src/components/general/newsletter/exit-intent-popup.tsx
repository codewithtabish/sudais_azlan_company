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

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function getSubscribedEmails(): string[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored = localStorage.getItem(NEWSLETTER_SUBSCRIBED_KEY);

    if (!stored || stored === "true") {
      return [];
    }

    const parsed: unknown = JSON.parse(stored);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .filter((value): value is string => typeof value === "string")
      .map(normalizeEmail)
      .filter(Boolean);
  } catch {
    return [];
  }
}

function hasAnySubscription(): boolean {
  return getSubscribedEmails().length > 0;
}

function saveSubscribedEmail(email: string): void {
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail) {
    return;
  }

  const existingEmails = getSubscribedEmails();

  if (existingEmails.includes(normalizedEmail)) {
    return;
  }

  localStorage.setItem(
    NEWSLETTER_SUBSCRIBED_KEY,
    JSON.stringify([...existingEmails, normalizedEmail]),
  );
}

function getInitialDismissedState(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return sessionStorage.getItem(POPUP_DISMISSED_KEY) === "true";
}

function getInitialSubscribedState(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return hasAnySubscription();
}

function fireConfetti(): void {
  confetti({
    particleCount: 140,
    spread: 85,
    startVelocity: 30,
    origin: {
      x: 0.5,
      y: 0.5,
    },
    colors: [
      "hsl(var(--primary))",
      "hsl(var(--foreground))",
      "hsl(var(--accent))",
      "hsl(var(--secondary))",
      "hsl(var(--muted-foreground))",
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
      if (event.key !== NEWSLETTER_SUBSCRIBED_KEY) {
        return;
      }

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
    if (dismissed || subscribed || hasAnySubscription()) {
      return;
    }

    const handleMouseLeave = (event: MouseEvent) => {
      const isSubscribed = hasAnySubscription();

      const isDismissed = sessionStorage.getItem(POPUP_DISMISSED_KEY) === "true";

      if (isSubscribed || isDismissed || event.clientY > 5) {
        return;
      }

      setOpen(true);
    };

    document.addEventListener("mouseout", handleMouseLeave);

    let mobileTimer: ReturnType<typeof setTimeout> | undefined;

    const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;

    if (isTouchDevice) {
      mobileTimer = setTimeout(() => {
        const isSubscribed = hasAnySubscription();

        const isDismissed = sessionStorage.getItem(POPUP_DISMISSED_KEY) === "true";

        if (isSubscribed || isDismissed) {
          return;
        }

        setOpen(true);
      }, 5000);
    }

    return () => {
      document.removeEventListener("mouseout", handleMouseLeave);

      if (mobileTimer) {
        clearTimeout(mobileTimer);
      }
    };
  }, [dismissed, subscribed]);

  const dismissForSession = () => {
    sessionStorage.setItem(POPUP_DISMISSED_KEY, "true");

    setDismissed(true);
    setOpen(false);
  };

  const handleDialogChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      if (open) {
        dismissForSession();
      }

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
    if (loading || subscribed) {
      return;
    }

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

        if (isDuplicate) {
          markAsSubscribed(trimmedEmail);
        }

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

  if (dismissed || subscribed) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogOverlay
        className="
          fixed inset-0 z-9998
          bg-background/80
          backdrop-blur-sm
          data-[state=open]:animate-in
          data-[state=closed]:animate-out
          data-[state=open]:fade-in-0
          data-[state=closed]:fade-out-0
        "
      />

      <DialogContent
        className="
          z-9999
          m-0
          flex
          max-w-none
          -translate-x-1/2
          -translate-y-1/2
          items-center
          justify-center
          overflow-visible
          border-0
          bg-transparent
          p-0
          shadow-none
          outline-none
          ring-0
        "
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
            className="
              absolute
              -right-2
              -top-2
              z-100
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              border
              border-border
              bg-background
              text-muted-foreground
              shadow-lg
              transition-all
              duration-200
              hover:bg-muted
              hover:text-foreground
              focus:outline-none
              focus:ring-2
              focus:ring-ring/40
              sm:-right-3
              sm:-top-3
              sm:h-11
              sm:w-11
            "
          >
            <X className="h-5 w-5 stroke-[2.5]" />
          </button>

          {/* Outer brand ring */}
          <div
            className="
              absolute
              inset-0
              rounded-full
              border-[6px]
              border-primary
              bg-background
              shadow-[0_25px_80px_hsl(var(--foreground)/0.2)]
            "
          />

          {/* Inner content */}
          <div
            className="
              absolute
              inset-[6px]
              z-10
              flex
              items-center
              justify-center
              overflow-hidden
              rounded-full
              bg-background
            "
          >
            <div
              className="
                relative
                z-20
                flex
                w-[82%]
                max-w-[380px]
                flex-col
                items-center
                justify-center
                px-2
                text-center
              "
            >
              {/* Brand */}
              <div className="mb-3 flex items-center justify-center sm:mb-3.5">
                <span
                  className="
                    text-[11px]
                    font-bold
                    uppercase
                    tracking-[0.2em]
                    text-primary
                    sm:text-[12px]
                  "
                >
                  Sudais Azlan
                </span>
              </div>

              {/* Eyebrow */}
              <p
                className="
                  mb-3
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.18em]
                  text-muted-foreground
                  sm:mb-3.5
                  sm:text-[11px]
                "
              >
                Stay in the loop
              </p>

              {/* Main title */}
              <DialogTitle
                className="
                  mx-auto
                  max-w-[340px]
                  p-0
                  text-[clamp(1.6rem,5.2vw,2.35rem)]
                  font-black
                  leading-[1.08]
                  tracking-[-0.035em]
                  text-foreground
                "
              >
                Let&apos;s stay connected.
              </DialogTitle>

              {/* Description */}
              <DialogDescription
                className="
                  mx-auto
                  mt-3
                  max-w-xs
                  text-[clamp(0.85rem,2vw,1.05rem)]
                  font-medium
                  leading-snug
                  text-muted-foreground
                  sm:mt-3.5
                "
              >
                Get occasional updates from Sudais Azlan — new projects, selected work, ideas, and
                notes delivered straight to your inbox.
              </DialogDescription>

              {/* Form */}
              <div
                className="
                  mt-6
                  w-full
                  space-y-3.5
                  sm:mt-7
                  sm:space-y-4
                "
              >
                <Input
                  type="email"
                  autoComplete="email"
                  placeholder="Enter your email address"
                  value={email}
                  disabled={loading}
                  onChange={(event) => setEmail(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      void handleSubscribe();
                    }
                  }}
                  className="
                    h-12
                    w-full
                    rounded-lg
                    border-border
                    bg-background
                    px-4
                    text-[14px]
                    text-foreground
                    shadow-sm
                    placeholder:text-muted-foreground
                    focus-visible:border-primary
                    focus-visible:ring-2
                    focus-visible:ring-primary/20
                    sm:h-13
                    sm:text-[15px]
                  "
                />

                <div className="flex items-start gap-2.5 px-0.5 text-left">
                  <Checkbox
                    id="newsletter-consent"
                    defaultChecked
                    disabled={loading}
                    className="
                      mt-0.5
                      h-4.5
                      w-4.5
                      shrink-0
                      border-border
                      data-[state=checked]:border-primary
                      data-[state=checked]:bg-primary
                      data-[state=checked]:text-primary-foreground
                    "
                  />

                  <Label
                    htmlFor="newsletter-consent"
                    className="
                      cursor-pointer
                      text-[12px]
                      font-medium
                      leading-[1.4]
                      text-muted-foreground
                      sm:text-[13px]
                    "
                  >
                    Keep me updated about new work, projects, and occasional notes.
                  </Label>
                </div>

                <Button
                  type="button"
                  disabled={loading}
                  onClick={() => void handleSubscribe()}
                  className="
                    h-12
                    w-full
                    rounded-lg
                    bg-primary
                    text-[14px]
                    font-bold
                    uppercase
                    tracking-wide
                    text-primary-foreground
                    shadow-md
                    transition-all
                    duration-200
                    hover:bg-primary/90
                    hover:shadow-lg
                    active:translate-y-0
                    sm:h-13
                    sm:text-[15px]
                  "
                >
                  {loading ? "Subscribing..." : "Join Sudais Azlan"}
                </Button>

                <button
                  type="button"
                  onClick={dismissForSession}
                  className="
                    mx-auto
                    block
                    text-[13px]
                    font-medium
                    text-muted-foreground
                    underline
                    underline-offset-4
                    transition-colors
                    hover:text-foreground
                  "
                >
                  No thanks
                </button>

                <p
                  className="
                    mx-auto
                    max-w-[300px]
                    text-[11px]
                    leading-tight
                    text-muted-foreground
                    sm:text-[12px]
                  "
                >
                  {/* By subscribing, you agree to receive occasional updates from Sudais Azlan. */}
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
