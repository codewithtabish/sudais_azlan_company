"use client";

import confetti from "canvas-confetti";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { KineticText } from "@/components/ui/kinetic-text";
import { subscribeNewsletterAction } from "@/app/actions/subscribe/subscribe-newsletter-action";
import { SOCIAL_LINKS } from "../links/social-links";

const NEWSLETTER_SUBSCRIBED_KEY = "sudaisazlan_newsletter_subscribed";
const NEWSLETTER_SUBSCRIBED_EVENT = "sudaisazlan:newsletter-subscribed";

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
      .filter((v): v is string => typeof v === "string")
      .map(normalizeEmail)
      .filter(Boolean);
  } catch {
    return [];
  }
}

function isEmailSubscribed(email: string) {
  const normalized = normalizeEmail(email);
  if (!normalized) return false;
  return getSubscribedEmails().includes(normalized);
}

function saveSubscribedEmail(email: string) {
  const normalized = normalizeEmail(email);
  if (!normalized) return;

  const existing = getSubscribedEmails();
  if (existing.includes(normalized)) return;

  localStorage.setItem(NEWSLETTER_SUBSCRIBED_KEY, JSON.stringify([...existing, normalized]));
}

export default function NewsletterSection() {
  const [socialOpen, setSocialOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentEmailSubscribed, setCurrentEmailSubscribed] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const socialRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sync = () => {
      const current = normalizeEmail(email);
      if (!current) return;
      const already = isEmailSubscribed(current);
      setCurrentEmailSubscribed(already);
      if (already) setMessage(null);
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== NEWSLETTER_SUBSCRIBED_KEY) return;
      sync();
    };

    window.addEventListener(NEWSLETTER_SUBSCRIBED_EVENT, sync);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener(NEWSLETTER_SUBSCRIBED_EVENT, sync);
      window.removeEventListener("storage", handleStorage);
    };
  }, [email]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    setEmail(next);

    const normalized = normalizeEmail(next);
    if (!normalized) {
      setCurrentEmailSubscribed(false);
      setMessage(null);
      return;
    }

    setCurrentEmailSubscribed(isEmailSubscribed(normalized));
    setMessage(null);
  };

  const handleSubscribe = async () => {
    const trimmed = normalizeEmail(email);

    if (!trimmed) {
      setMessage("Please enter your email address.");
      return;
    }

    if (isEmailSubscribed(trimmed)) {
      setCurrentEmailSubscribed(true);
      setMessage(null);
      return;
    }

    setMessage(null);
    setLoading(true);

    try {
      const result = await subscribeNewsletterAction(trimmed);

      if (!result.success) {
        const serverMessage = result.message?.toLowerCase() ?? "";
        const isDuplicate =
          serverMessage.includes("already subscribed") ||
          serverMessage.includes("already a subscriber") ||
          serverMessage.includes("already exists");

        if (isDuplicate) {
          saveSubscribedEmail(trimmed);
          setCurrentEmailSubscribed(true);
          setMessage(null);
          window.dispatchEvent(new Event(NEWSLETTER_SUBSCRIBED_EVENT));
          return;
        }

        setMessage(result.message);
        return;
      }

      saveSubscribedEmail(trimmed);
      window.dispatchEvent(new Event(NEWSLETTER_SUBSCRIBED_EVENT));
      fireConfetti();
      setEmail("");
      setCurrentEmailSubscribed(false);
      setMessage("You're subscribed! Welcome.");
    } catch (error) {
      console.error("Newsletter subscription failed:", error);
      setMessage("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading || currentEmailSubscribed) return;
    await handleSubscribe();
  };

  return (
    <section className="border-y border-border py-14 sm:py-16">
      <div className="flex w-full flex-col items-center gap-10 md:flex-row md:items-center md:justify-between md:gap-14 lg:gap-20">
        {/* LEFT — Profile */}
        <div className="flex shrink-0 flex-col items-center text-center md:items-start md:text-left">
          {/* Larger portrait */}
          <div className="relative h-64 w-64 overflow-hidden rounded-full sm:h-72 sm:w-72 md:h-80 md:w-80">
            <Image
              src="/images/about.png"
              alt="Sudais Azlan"
              fill
              priority
              className="object-contain object-center"
              sizes="(max-width: 640px) 256px, (max-width: 768px) 288px, 320px"
            />
          </div>

          <div className="mt-5">
            <div className="flex items-center justify-center gap-2 md:justify-start">
              <h3 className="relative inline-block text-xl font-semibold tracking-tight">
                <span className="absolute bottom-1 left-0 z-0 h-2.5 w-full bg-primary/40" />
              </h3>

              <KineticText text="SUDAIS AZLAN" as="h2" className="relative z-10" />

              <div className="relative" ref={socialRef}>
                <button
                  type="button"
                  aria-label="Open social links"
                  aria-expanded={socialOpen}
                  onClick={() => setSocialOpen((open) => !open)}
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-primary/30 text-primary transition-all hover:border-primary hover:bg-primary hover:text-primary-foreground"
                >
                  <span className="text-sm font-semibold leading-none">@</span>
                </button>

                {socialOpen && (
                  <div
                    role="menu"
                    className="absolute bottom-full left-1/2 z-50 mb-3 w-64 -translate-x-1/2 rounded-xl border border-border bg-background p-3 text-left shadow-xl shadow-black/10 md:left-0 md:translate-x-0"
                  >
                    <div className="mb-2 px-2">
                      <p className="text-sm font-semibold text-foreground">Sudais Azlan</p>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">
                        Designer &amp; Full-Stack Developer
                      </p>
                    </div>

                    <div className="space-y-0.5">
                      <Link
                        href="https://www.sudaisazlan.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        role="menuitem"
                        onClick={() => setSocialOpen(false)}
                        className="flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                      >
                        <span className="flex h-5 w-5 items-center justify-center text-xs font-bold">
                          ↗
                        </span>
                        <span>Website</span>
                      </Link>

                      {SOCIAL_LINKS.map((social) => {
                        const Icon = social.icon;

                        return (
                          <Link
                            key={social.label}
                            href={social.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            role="menuitem"
                            onClick={() => setSocialOpen(false)}
                            className="flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                          >
                            <Icon className="h-4.5 w-4.5" />
                            <span>{social.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Portfolio
            </p>

            <p className="mt-3 max-w-[290px] text-xs leading-relaxed text-muted-foreground sm:text-[13px]">
              Building modern digital products, experiments, and experiences worth sharing.
            </p>

            <Link
              href="https://www.sudaisazlan.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-primary transition-colors hover:text-primary/80"
            >
              <span>sudaisazlan.com</span>
              <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>

        {/* RIGHT — Newsletter */}
        <div className="w-full max-w-md flex-1 text-center md:text-left">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Newsletter</h2>

          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Get updates on new projects, selected work, and occasional notes on design and
            engineering.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-7 flex w-full flex-col gap-3 sm:flex-row sm:items-start"
          >
            <div className="w-full flex-1">
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="Email address"
                autoComplete="email"
                required
                aria-label="Email address"
                disabled={loading}
                className="h-12 w-full rounded-lg border border-border bg-transparent px-4 text-sm text-foreground outline-none ring-ring placeholder:text-muted-foreground focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60"
              />

              {currentEmailSubscribed && (
                <p
                  role="status"
                  aria-live="polite"
                  className="mt-2 text-left text-xs font-medium text-muted-foreground"
                >
                  This email is already subscribed.
                </p>
              )}

              {message && !currentEmailSubscribed && (
                <p
                  role="status"
                  aria-live="polite"
                  className="mt-2 text-left text-xs font-medium text-muted-foreground"
                >
                  {message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || currentEmailSubscribed}
              className="h-12 shrink-0 rounded-lg bg-primary px-7 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60 sm:self-start"
            >
              {loading ? "Subscribing..." : currentEmailSubscribed ? "Subscribed" : "Sign Up"}
            </button>
          </form>

          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            By clicking Sign Up, you confirm you are 16+ and agree to our{" "}
            <Link
              href="/terms"
              className="underline underline-offset-2 transition-colors hover:text-foreground"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy-policy"
              className="underline underline-offset-2 transition-colors hover:text-foreground"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
