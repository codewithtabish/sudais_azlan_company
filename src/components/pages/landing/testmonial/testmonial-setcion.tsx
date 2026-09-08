"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Bot, Code2, Smartphone, Star, Globe2 } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Alex Morgan",
    role: "Founder & Product Lead",
    company: "Digital Product Studio",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    service: "AI Engineering",
    icon: Bot,
    text: "Sudais brought a strong engineering mindset to our AI product. He understood the product goals quickly and turned complex AI ideas into a practical, polished experience.",
  },
  {
    id: 2,
    name: "Sophia Anderson",
    role: "Startup Founder",
    company: "Technology Startup",
    avatar:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    service: "Web Development",
    icon: Globe2,
    text: "Working with Sudais was a great experience. He built a fast, modern web application with thoughtful UX and a clean technical foundation that was easy to grow.",
  },
  {
    id: 3,
    name: "Emma Williams",
    role: "Product Designer",
    company: "Independent Product Team",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    service: "Full-Stack Development",
    icon: Code2,
    text: "Sudais is the kind of developer who thinks beyond the code. He understands design, product experience, performance, and the details that make a digital product feel complete.",
  },
  {
    id: 4,
    name: "Daniel Richardson",
    role: "Business Owner",
    company: "Growing Technology Business",
    avatar:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    service: "Mobile App Development",
    icon: Smartphone,
    text: "Sudais helped turn our mobile product idea into a real application. His Expo and React Native experience made the development process much smoother and more efficient.",
  },
  {
    id: 5,
    name: "Olivia Thompson",
    role: "Product Manager",
    company: "Software Company",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    service: "Web & AI Products",
    icon: Bot,
    text: "What stood out most was Sudais's ability to work across the entire product. From the web experience to AI functionality and backend architecture, he approached everything with ownership.",
  },
];

const services = [
  {
    title: "AI Engineering",
    description:
      "AI-powered applications, intelligent workflows, LLM integrations, and practical AI products.",
    icon: Bot,
  },
  {
    title: "Web Development",
    description:
      "Modern, fast, scalable web applications built with today's best frontend and backend technologies.",
    icon: Globe2,
  },
  {
    title: "Mobile Development",
    description:
      "Cross-platform mobile applications with Expo and React Native, designed for real-world users.",
    icon: Smartphone,
  },
  {
    title: "Full-Stack Products",
    description:
      "Complete digital products covering frontend, backend, APIs, databases, authentication, and deployment.",
    icon: Code2,
  },
];

export default function Testimonials() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((previous) => (previous + 1) % testimonials.length);
    }, 4500);

    return () => clearInterval(timer);
  }, []);

  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-heading"
      className="relative overflow-hidden bg-background py-20 sm:py-24 lg:py-28"
    >
      {/* Background atmosphere */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_50%_at_50%_0%,hsl(var(--primary)/0.08),transparent_65%)]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-1/4 h-80 w-80 rounded-full bg-primary/5 blur-[110px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 bottom-1/4 h-80 w-80 rounded-full bg-primary/5 blur-[110px]"
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto mb-14 max-w-3xl text-center sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3 py-1 text-[11px] font-medium tracking-wide text-muted-foreground"
          >
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-primary" />
            Working with Sudais
          </motion.div>

          <motion.h2
            id="testimonials-heading"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05, duration: 0.55 }}
            className="font-serif text-[2.25rem] leading-[1.12] tracking-tight text-foreground sm:text-[2.8rem] lg:text-[3.35rem]"
          >
            Building <span className="text-primary">meaningful digital products</span> with
            technology.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.55 }}
            className="mx-auto mt-5 max-w-2xl text-[1rem] leading-relaxed text-muted-foreground sm:text-[1.05rem]"
          >
            Sudais Azlan is an AI Engineer, web developer, and Expo mobile app developer focused on
            turning ideas into modern, scalable, and useful digital products.
          </motion.p>
        </div>

        {/* Main content */}
        <div className="grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          {/* Left */}
          <div className="max-w-xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
            >
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                What Sudais does
              </p>

              <h3 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                From an idea to a working product.
              </h3>

              <p className="mt-4 text-[15px] leading-7 text-muted-foreground">
                Whether it is an AI-powered application, a high-performance website, a mobile app,
                or a complete full-stack platform, Sudais works across the product to turn ambitious
                ideas into reliable software.
              </p>
            </motion.div>

            {/* Services */}
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {services.map((service, index) => {
                const Icon = service.icon;

                return (
                  <motion.div
                    key={service.title}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: index * 0.07,
                      duration: 0.45,
                    }}
                    className="group rounded-xl border border-border bg-card/60 p-4 transition-colors duration-200 hover:bg-muted/40"
                  >
                    <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-primary">
                      <Icon className="h-4 w-4" />
                    </div>

                    <h4 className="text-sm font-semibold text-card-foreground">{service.title}</h4>

                    <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                      {service.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.55 }}
              className="mt-9 flex flex-wrap gap-x-10 gap-y-6 border-t border-border pt-7"
            >
              <div>
                <p className="font-serif text-2xl font-semibold tracking-tight text-foreground">
                  AI
                </p>

                <p className="mt-1 text-[12px] text-muted-foreground">Intelligent products</p>
              </div>

              <div>
                <p className="font-serif text-2xl font-semibold tracking-tight text-foreground">
                  Web
                </p>

                <p className="mt-1 text-[12px] text-muted-foreground">Modern applications</p>
              </div>

              <div>
                <p className="font-serif text-2xl font-semibold tracking-tight text-foreground">
                  Expo
                </p>

                <p className="mt-1 text-[12px] text-muted-foreground">Mobile experiences</p>
              </div>
            </motion.div>
          </div>

          {/* Right - Testimonials */}
          <div className="relative mx-auto w-full max-w-[500px] lg:mx-0 lg:ml-auto">
            <div className="relative h-[360px] sm:h-[380px]">
              {testimonials.map((testimonial, index) => {
                const total = testimonials.length;

                const offset = (index - active + total) % total;

                if (offset > 2) {
                  return null;
                }

                const ServiceIcon = testimonial.icon;

                return (
                  <motion.div
                    key={testimonial.id}
                    className="absolute inset-x-0 top-0"
                    style={{
                      zIndex: 30 - offset,
                    }}
                    animate={{
                      scale: 1 - offset * 0.045,
                      y: offset * 15,
                      x: offset * 8,
                      rotate: offset === 0 ? 0 : offset === 1 ? -1.5 : 1.5,
                      opacity: offset === 0 ? 1 : offset === 1 ? 0.82 : 0.58,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 28,
                    }}
                  >
                    <article className="rounded-2xl border border-border bg-card p-6 shadow-2xl sm:p-7">
                      {/* Service */}
                      <div className="mb-5 flex items-center justify-between">
                        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                          <ServiceIcon className="h-3.5 w-3.5 text-primary" />

                          {testimonial.service}
                        </div>

                        <div
                          className="flex items-center gap-0.5"
                          aria-label={`${testimonial.rating} out of 5 stars`}
                        >
                          {Array.from({ length: 5 }).map((_, starIndex) => (
                            <Star
                              key={starIndex}
                              aria-hidden="true"
                              className={
                                starIndex < testimonial.rating
                                  ? "h-3.5 w-3.5 fill-primary text-primary"
                                  : "h-3.5 w-3.5 text-muted-foreground/30"
                              }
                            />
                          ))}
                        </div>
                      </div>

                      {/* Quote */}
                      <blockquote className="text-[15px] leading-7 text-card-foreground sm:text-[15.5px]">
                        “{testimonial.text}”
                      </blockquote>

                      {/* Divider */}
                      <div className="my-5 h-px bg-border" />

                      {/* Author */}
                      <div className="flex items-center gap-3">
                        <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full ring-2 ring-border">
                          <Image
                            src={testimonial.avatar}
                            alt={`${testimonial.name} profile photo`}
                            fill
                            sizes="44px"
                            className="object-cover"
                          />
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold tracking-tight text-card-foreground">
                            {testimonial.name}
                          </p>

                          <p className="truncate text-xs text-muted-foreground">
                            {testimonial.role} · {testimonial.company}
                          </p>
                        </div>
                      </div>
                    </article>
                  </motion.div>
                );
              })}
            </div>

            {/* Slider controls */}
            <div className="mt-9 flex items-center justify-center gap-2">
              {testimonials.map((testimonial, index) => (
                <button
                  key={testimonial.id}
                  type="button"
                  aria-label={`Show testimonial from ${testimonial.name}`}
                  aria-current={index === active}
                  onClick={() => setActive(index)}
                  className={`
                    h-1.5 rounded-full
                    transition-all duration-300
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-ring
                    focus-visible:ring-offset-2
                    focus-visible:ring-offset-background
                    ${
                      index === active
                        ? "w-7 bg-primary"
                        : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                    }
                  `}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Bottom positioning statement */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.55 }}
          className="mx-auto mt-16 max-w-3xl border-t border-border pt-8 text-center sm:mt-20"
        >
          <p className="text-sm leading-relaxed text-muted-foreground">
            AI engineering. Web development. Mobile apps. Full-stack products.{" "}
            <span className="font-medium text-foreground">
              One developer focused on building technology that works.
            </span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
