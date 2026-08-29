"use client";

import Image from "next/image";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { ArrowRightIcon, ExternalLinkIcon, Share2Icon } from "lucide-react";

import GreetingWord from "./greeting-words";
import IdCard from "./id-card";
import { Marquee } from "./marquee";
import { SOCIAL_LINKS } from "@/components/general/links/social-links";

const PROFILE_IMAGE_URL = "/images/about.png";

type BrandLogo = {
  image: string;
  name: string;
};

type HeroSectionProps = {
  brandLogos: BrandLogo[];
};

const HeroSection = ({ brandLogos }: HeroSectionProps) => {
  const [socialOpen, setSocialOpen] = useState(false);

  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative grid min-h-[680px] grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-8">
          {/* =========================================================
              LEFT CONTENT
          ========================================================== */}
          <div className="relative z-20 pt-24 pb-8 sm:pt-28 sm:pb-12 lg:col-span-7 lg:pt-24 lg:pb-20">
            <div className="max-w-3xl space-y-6">
              {/* Availability */}
              <Badge
                variant="outline"
                className="h-7 gap-2 overflow-visible rounded-full bg-card px-3 text-primary shadow-sm"
              >
                <span className="relative inline-flex size-1.5">
                  <span className="absolute -inset-0.5 animate-[ping_1.8s_cubic-bezier(0,0,0.2,1)_infinite] rounded-full bg-primary/40 opacity-75" />

                  <span className="relative inline-flex size-1.5 rounded-full bg-primary" />
                </span>
                Available for opportunities
              </Badge>

              {/* Heading */}
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl lg:text-[64px] lg:leading-[1.05] lg:font-bold">
                <GreetingWord />
                I&apos;m Sudais Azlan <span aria-hidden="true">👋</span>
              </h1>

              {/* Role */}
              <p className="text-xl font-medium tracking-tight text-muted-foreground sm:text-2xl lg:text-3xl">
                AI &amp; Software Engineer
              </p>

              {/* Description */}
              <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
                I build intelligent digital products, scalable web applications, and AI-powered
                experiences that turn ambitious ideas into useful products people love to use.
              </p>

              {/* =======================================================
                  CTA
              ======================================================== */}
              <div className="flex flex-wrap items-center gap-2.5 pt-3">
                {/* View Work */}
                <Button asChild className="h-11 rounded-full px-5 text-base">
                  <a href="#projects">
                    View my work
                    <ArrowRightIcon className="ml-1 size-4" />
                  </a>
                </Button>

                {/* Let's Connect */}
                <Button
                  asChild
                  variant="outline"
                  className="group h-11 gap-2.5 rounded-full bg-card pr-4! pl-4! text-base shadow-sm transition-[padding] duration-300 hover:pl-2!"
                >
                  <a href="#contact">
                    <span className="relative flex size-2.5 items-center justify-center overflow-hidden rounded-full bg-primary transition-all duration-300 group-hover:size-6.5">
                      <ArrowRightIcon className="absolute size-4.5 -translate-x-3 text-primary-foreground opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
                    </span>
                    Let&apos;s connect
                  </a>
                </Button>

                {/* =====================================================
                    SOCIAL ICON + POPOVER
                ====================================================== */}
                <div className="relative">
                  {/* Icon */}
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    aria-label="Open social links"
                    aria-expanded={socialOpen}
                    aria-haspopup="menu"
                    onClick={() => setSocialOpen((open) => !open)}
                    className="size-11 rounded-full bg-card shadow-sm transition-transform duration-200 hover:scale-105"
                  >
                    <Share2Icon
                      className={`size-[18px] transition-transform duration-200 ${
                        socialOpen ? "rotate-12" : ""
                      }`}
                    />
                  </Button>

                  {/* =================================================
                      POPOVER
                      Opens ABOVE the icon
                  ================================================== */}
                  {socialOpen && (
                    <>
                      {/* Mobile backdrop */}
                      <button
                        type="button"
                        aria-label="Close social links"
                        className="fixed inset-0 z-40 cursor-default bg-transparent lg:hidden"
                        onClick={() => setSocialOpen(false)}
                      />

                      <div
                        role="menu"
                        aria-label="Social links"
                        className="absolute bottom-[calc(100%+12px)] left-1/2 z-50 w-[280px] -translate-x-1/2 overflow-hidden rounded-2xl border bg-popover p-2 text-popover-foreground shadow-2xl shadow-black/10"
                      >
                        {/* Header */}
                        <div className="px-3 py-2.5">
                          <p className="text-sm font-semibold">Connect with Sudais</p>

                          <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
                            Follow my work and latest updates.
                          </p>
                        </div>

                        {/* Links */}
                        <div className="mt-1 grid gap-1">
                          {SOCIAL_LINKS.map((social) => {
                            const Icon = social.icon;

                            return (
                              <a
                                key={social.label}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                role="menuitem"
                                onClick={() => setSocialOpen(false)}
                                className="group flex min-h-12 items-center gap-3 rounded-xl px-3 py-2.5 outline-none transition-colors hover:bg-muted focus-visible:bg-muted"
                              >
                                {/* Icon */}
                                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border bg-background text-muted-foreground transition-colors group-hover:text-foreground">
                                  <Icon className="size-[18px]" />
                                </span>

                                {/* Text */}
                                <span className="min-w-0 flex-1">
                                  <span className="block text-sm font-medium">{social.label}</span>

                                  <span className="block truncate text-xs text-muted-foreground">
                                    {social.href.replace(/^https?:\/\//, "")}
                                  </span>
                                </span>

                                {/* External icon */}
                                <ExternalLinkIcon className="size-3.5 shrink-0 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Supporting skills */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-2 text-sm text-muted-foreground">
                <span>Artificial Intelligence</span>

                <span className="size-1 rounded-full bg-border" aria-hidden="true" />

                <span>Software Engineering</span>

                <span className="size-1 rounded-full bg-border" aria-hidden="true" />

                <span>Product Development</span>
              </div>
            </div>
          </div>

          {/* =========================================================
              DESKTOP ID CARD
          ========================================================== */}
          <div className="relative hidden min-h-[680px] lg:col-span-5 lg:flex lg:items-center lg:justify-center">
            <div className="relative h-[620px] w-full max-w-[430px] xl:h-[660px] xl:max-w-[460px]">
              <IdCard frontImage={PROFILE_IMAGE_URL} className="h-full w-full" />
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          MOBILE ID CARD
      ========================================================== */}
      <div className="flex justify-center px-4 pb-4 sm:px-6 lg:hidden">
        <div className="w-full max-w-sm">
          <IdCard frontImage={PROFILE_IMAGE_URL} className="aspect-4/5 w-full" />
        </div>
      </div>

      {/* =========================================================
          TECHNOLOGY MARQUEE
      ========================================================== */}
      {brandLogos.length > 0 && (
        <div className="relative mx-auto mt-14 mb-12 w-full max-w-7xl px-4 sm:mt-16 sm:px-6 lg:mt-20 lg:px-8">
          {/* Left fade */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-linear-to-r from-background to-transparent sm:w-24" />

          {/* Right fade */}
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-linear-to-l from-background to-transparent sm:w-24" />

          <div className="w-full overflow-hidden">
            <Marquee pauseOnHover duration={25} gap={2}>
              {brandLogos.map((logo, logoIndex) => (
                <div
                  key={`${logo.image}-${logoIndex}`}
                  className="flex size-16 shrink-0 items-center justify-center rounded-xl border bg-muted/60 transition-colors hover:bg-muted"
                >
                  <Image
                    src={logo.image}
                    alt={logo.name || "Technology logo"}
                    width={40}
                    height={40}
                    className="size-9 object-contain grayscale transition-all duration-300 hover:grayscale-0 sm:size-10"
                  />
                </div>
              ))}
            </Marquee>
          </div>
        </div>
      )}
    </section>
  );
};

export default HeroSection;
