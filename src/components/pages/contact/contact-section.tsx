"use client";

import { ArrowUpRight, CheckCircle2, Mail, MessageSquare, Send } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  useCallback,
  useId,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactElement,
} from "react";

import { sendContactMessageAction } from "@/app/actions/emails/send-contact-email";
import { SOCIAL_LINKS } from "@/components/general/links/social-links";
import { COUNTRIES } from "@/lib/country-list";
import { cn } from "@/lib/utils";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import ABOUTCTA from "../about/about-cta";

/* ==========================================================================
   TYPES
   ========================================================================== */

type ContactInfo = {
  title: string;
  icon: ReactElement;
  description: string;
};

type FormState = "idle" | "loading" | "success" | "error";

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  message: string;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

/* ==========================================================================
   CONTACT INFORMATION
   ========================================================================== */

const CONTACT_INFO: ContactInfo[] = [
  {
    title: "Email",
    icon: <Mail />,
    description: "hello@sazlan.com\nThe best way to reach us.",
  },
  {
    title: "Let's build",
    icon: <MessageSquare />,
    description: "AI products, web apps,\nbackend systems & APIs.",
  },
];

/* ==========================================================================
   INITIAL FORM
   ========================================================================== */

const INITIAL_FORM: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  country: "",
  message: "",
};

/* ==========================================================================
   CONTACT FORM
   ========================================================================== */

function ContactForm() {
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [state, setState] = useState<FormState>("idle");
  const [errors, setErrors] = useState<FormErrors>({});

  const firstNameId = useId();
  const lastNameId = useId();
  const emailId = useId();
  const countryId = useId();
  const messageId = useId();

  const validate = useCallback((data: FormData): FormErrors => {
    const next: FormErrors = {};

    if (!data.firstName.trim()) {
      next.firstName = "First name is required";
    }

    if (!data.lastName.trim()) {
      next.lastName = "Last name is required";
    }

    if (!data.email.trim()) {
      next.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      next.email = "Enter a valid email address";
    }

    if (!data.country) {
      next.country = "Please select a country";
    }

    if (!data.message.trim()) {
      next.message = "Please tell us a little about your project";
    } else if (data.message.trim().length < 10) {
      next.message = "Please share a little more detail";
    }

    return next;
  }, []);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (errors[name as keyof FormData]) {
      setErrors((previous) => ({
        ...previous,
        [name]: undefined,
      }));
    }

    if (state === "error") {
      setState("idle");
    }
  };

  const handleCountryChange = (value: string) => {
    setForm((previous) => ({
      ...previous,
      country: value,
    }));

    if (errors.country) {
      setErrors((previous) => ({
        ...previous,
        country: undefined,
      }));
    }

    if (state === "error") {
      setState("idle");
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validate(form);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setState("loading");

    try {
      const result = await sendContactMessageAction(form);

      if (result.success) {
        setState("success");
        setForm(INITIAL_FORM);
        return;
      }

      setState("error");
    } catch {
      setState("error");
    }
  };

  if (state === "success") {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-primary/4 p-8 text-center sm:p-10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: "radial-gradient(circle at center, currentColor 1px, transparent 1px)",
            backgroundSize: "18px 18px",
          }}
        />

        <div className="relative">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full border border-primary/20 bg-primary/10">
            <CheckCircle2 className="size-6 text-primary" />
          </div>

          <h3 className="mt-5 text-xl font-semibold tracking-tight text-foreground">
            Message received
          </h3>

          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
            Thanks for reaching out. Your message has been sent successfully. We&apos;ll get back to
            you through the contact information you provided.
          </p>

          <button
            type="button"
            onClick={() => setState("idle")}
            className="mt-7 text-sm font-medium text-primary underline-offset-4 transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-background"
          >
            Send another message
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6" aria-busy={state === "loading"}>
      {/* ================================================================
          NAME
          ================================================================ */}

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="min-w-0 space-y-1.5">
          <label htmlFor={firstNameId} className="text-sm font-medium text-foreground">
            First name
          </label>

          <Input
            id={firstNameId}
            name="firstName"
            type="text"
            autoComplete="given-name"
            value={form.firstName}
            onChange={handleChange}
            disabled={state === "loading"}
            placeholder="Jane"
            aria-invalid={Boolean(errors.firstName)}
            aria-describedby={errors.firstName ? `${firstNameId}-error` : undefined}
            className={cn(
              "h-11 w-full min-w-0",
              errors.firstName && "border-destructive focus-visible:ring-destructive",
            )}
          />

          {errors.firstName && (
            <p id={`${firstNameId}-error`} role="alert" className="text-xs text-destructive">
              {errors.firstName}
            </p>
          )}
        </div>

        <div className="min-w-0 space-y-1.5">
          <label htmlFor={lastNameId} className="text-sm font-medium text-foreground">
            Last name
          </label>

          <Input
            id={lastNameId}
            name="lastName"
            type="text"
            autoComplete="family-name"
            value={form.lastName}
            onChange={handleChange}
            disabled={state === "loading"}
            placeholder="Doe"
            aria-invalid={Boolean(errors.lastName)}
            aria-describedby={errors.lastName ? `${lastNameId}-error` : undefined}
            className={cn(
              "h-11 w-full min-w-0",
              errors.lastName && "border-destructive focus-visible:ring-destructive",
            )}
          />

          {errors.lastName && (
            <p id={`${lastNameId}-error`} role="alert" className="text-xs text-destructive">
              {errors.lastName}
            </p>
          )}
        </div>
      </div>

      {/* ================================================================
          EMAIL
          ================================================================ */}

      <div className="min-w-0 space-y-1.5">
        <label htmlFor={emailId} className="text-sm font-medium text-foreground">
          Email
        </label>

        <Input
          id={emailId}
          name="email"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={handleChange}
          disabled={state === "loading"}
          placeholder="you@company.com"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? `${emailId}-error` : undefined}
          className={cn(
            "h-11 w-full min-w-0",
            errors.email && "border-destructive focus-visible:ring-destructive",
          )}
        />

        {errors.email && (
          <p id={`${emailId}-error`} role="alert" className="text-xs text-destructive">
            {errors.email}
          </p>
        )}
      </div>

      {/* ================================================================
          COUNTRY
          ================================================================ */}

      <div className="min-w-0 space-y-1.5">
        <label htmlFor={countryId} className="text-sm font-medium text-foreground">
          Country
        </label>

        <Select
          value={form.country}
          onValueChange={handleCountryChange}
          disabled={state === "loading"}
        >
          <SelectTrigger
            id={countryId}
            aria-invalid={Boolean(errors.country)}
            aria-describedby={errors.country ? `${countryId}-error` : undefined}
            className={cn(
              "h-11 w-full min-w-0",
              errors.country && "border-destructive focus:ring-destructive",
            )}
          >
            <SelectValue placeholder="Select your country" />
          </SelectTrigger>

          <SelectContent>
            {COUNTRIES.map((country) => (
              <SelectItem key={country.code} value={country.code}>
                {country.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {errors.country && (
          <p id={`${countryId}-error`} role="alert" className="text-xs text-destructive">
            {errors.country}
          </p>
        )}
      </div>

      {/* ================================================================
          MESSAGE
          ================================================================ */}

      <div className="min-w-0 space-y-1.5">
        <div className="flex items-center justify-between gap-3">
          <label htmlFor={messageId} className="text-sm font-medium text-foreground">
            Message
          </label>

          <span className="text-[11px] text-muted-foreground">{form.message.length}/2000</span>
        </div>

        <Textarea
          id={messageId}
          name="message"
          rows={7}
          maxLength={2000}
          value={form.message}
          onChange={handleChange}
          disabled={state === "loading"}
          placeholder="Tell us what you're building, what you're trying to solve, or where you're currently stuck..."
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? `${messageId}-error` : undefined}
          className={cn(
            "min-h-[160px] w-full min-w-0 resize-y",
            errors.message && "border-destructive focus-visible:ring-destructive",
          )}
        />

        {errors.message && (
          <p id={`${messageId}-error`} role="alert" className="text-xs text-destructive">
            {errors.message}
          </p>
        )}
      </div>

      {/* ================================================================
          SERVER ERROR
          ================================================================ */}

      {state === "error" && (
        <div
          className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive"
          role="alert"
        >
          Something went wrong while sending your message. Please try again or contact us directly.
        </div>
      )}

      {/* ================================================================
          FORM FOOTER
          ================================================================ */}

      <div className="flex flex-col gap-5 border-t border-border pt-5 sm:flex-row sm:items-end sm:justify-between">
        <p className="max-w-md text-xs leading-relaxed text-muted-foreground">
          By sending this message, you agree that we may use the information provided to respond to
          your request. Please see our{" "}
          <Link
            href="/privacy-policy"
            className="font-medium text-foreground underline decoration-border underline-offset-2 transition-colors hover:decoration-foreground"
          >
            Privacy Policy
          </Link>
          .
        </p>

        <Button type="submit" disabled={state === "loading"} className="h-11 shrink-0 gap-2 px-6">
          {state === "loading" ? (
            <>
              <span
                aria-hidden="true"
                className="size-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground"
              />
              Sending…
            </>
          ) : (
            <>
              Send message
              <Send className="size-4" />
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

/* ==========================================================================
   CONTACT US
   ========================================================================== */

export default function ContactUs() {
  return (
    <main className="w-full min-w-0 max-w-full overflow-x-clip">
      {/* ================================================================
          BACK BUTTON
          ================================================================ */}

      <div className="mx-auto w-full max-w-7xl px-4 pt-6 sm:px-6 sm:pt-8 lg:px-8">
        <Link
          href="/"
          aria-label="Go back"
          className="group inline-flex size-10 items-center justify-center rounded-full border border-border bg-background text-muted-foreground shadow-sm transition-all duration-200 hover:-translate-x-0.5 hover:border-primary/40 hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="size-[18px] transition-transform duration-200 group-hover:-translate-x-0.5"
          >
            <path d="M19 12H5" />
            <path d="m12 19-7-7 7-7" />
          </svg>
        </Link>
      </div>

      {/* ================================================================
          PAGE HEADER
          ================================================================ */}

      <section className="px-4 pb-10 pt-8 sm:px-6 sm:pb-14 sm:pt-10 lg:px-8 lg:pb-20 lg:pt-12">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <div className="relative mx-auto mb-5 w-fit">
              <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                Contact Us
              </h1>

              <span className="absolute -bottom-2 left-0 h-px w-full bg-primary" />
            </div>

            <p className="mt-6 text-base leading-relaxed text-muted-foreground sm:text-lg">
              Have an idea, a technical challenge, or something you want to build? Tell us about it.
              We&apos;d love to hear what you&apos;re working on.
            </p>
          </div>
        </div>
      </section>

      {/* ================================================================
          CONTACT INTRO
          ================================================================ */}

      <section className=" py-8 sm:py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            {/* Illustration */}

            <div className="relative overflow-hidden rounded-2xl border border-border bg-background shadow-sm">
              <Image
                src="https://cdn.shadcnstudio.com/ss-assets/blocks/marketing/contact-us/image-1.png"
                alt="Contact Sudais Azlan"
                width={1200}
                height={900}
                priority
                unoptimized
                className="h-auto max-h-[520px] w-full object-cover"
              />

              <div className="pointer-events-none absolute inset-0 bg-linear-to-tr from-background/10 via-transparent to-primary/10" />
            </div>

            {/* Intro */}

            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Let&apos;s talk
              </p>

              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Happy to hear from you.
              </h2>

              <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
                Sudais Azlan focuses on thoughtful digital products, modern applications, AI-powered
                experiences, backend systems, APIs, and the engineering foundations behind them.
              </p>

              {/* Contact Cards */}

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {CONTACT_INFO.map((info) => (
                  <Card
                    key={info.title}
                    className="border-border bg-background/70 shadow-none transition-colors hover:border-primary/30"
                  >
                    <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
                      <Avatar className="size-10">
                        <AvatarFallback className="bg-transparent text-card-foreground [&>svg]:size-5">
                          {info.icon}
                        </AvatarFallback>
                      </Avatar>

                      <div className="space-y-2">
                        <h3 className="text-base font-semibold text-foreground">{info.title}</h3>

                        <div className="text-sm font-medium leading-relaxed text-muted-foreground">
                          {info.description.split("\n").map((line, index) => (
                            <p key={`${info.title}-${index}`}>{line}</p>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          FORM + DIRECT CONTACT
          ================================================================ */}

      <section className="py-14 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-16">
            {/* Contact Form */}

            <div className="min-w-0">
              <div className="max-w-2xl">
                <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  Send a message
                </p>

                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                  Start a conversation
                </h2>

                <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Share some context about your project, product, idea, or technical problem. Useful
                  details help us understand what you&apos;re trying to achieve.
                </p>

                <div className="mt-9">
                  <ContactForm />
                </div>
              </div>
            </div>

            {/* Direct Contact */}

            <aside className="min-w-0 space-y-8 lg:pt-[4.25rem]">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                  Prefer direct?
                </p>

                <div className="mt-4 space-y-4">
                  <a
                    href="mailto:hello@sazlan.com"
                    className="group flex min-w-0 items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <Mail className="size-4 shrink-0 text-primary" />

                    <span className="truncate">hello@sazlan.com</span>

                    <ArrowUpRight className="size-3.5 shrink-0 opacity-0 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" />
                  </a>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {SOCIAL_LINKS.map((social) => {
                      const Icon = social.icon;

                      return (
                        <a
                          key={social.label}
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={social.label}
                          className="inline-flex size-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-all duration-200 hover:border-foreground hover:bg-foreground hover:text-background"
                        >
                          <Icon className="size-4" />
                        </a>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Conversation */}

              <div className="rounded-xl border border-border bg-card/40 p-5">
                <div className="flex items-start gap-3">
                  <MessageSquare className="mt-0.5 size-4 shrink-0 text-primary" />

                  <div>
                    <p className="text-sm font-medium text-foreground">Thoughtful conversations</p>

                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      Whether you already have a defined project or are still exploring an idea,
                      start with the context you have.
                    </p>
                  </div>
                </div>
              </div>

              {/* Good Fit */}

              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                  A good fit for
                </p>

                <div className="mt-4 space-y-2.5">
                  {[
                    "AI-powered products",
                    "Modern web applications",
                    "Backend & API systems",
                    "Technical product ideas",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-2.5 text-sm text-muted-foreground"
                    >
                      <span className="size-1.5 shrink-0 rounded-full bg-primary" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section>
        <ABOUTCTA />
      </section>
    </main>
  );
}
