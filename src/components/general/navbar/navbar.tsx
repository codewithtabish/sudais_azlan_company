"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Show, SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { LayoutDashboard, MenuIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";

const navigationData = [
  { title: "Projects", href: "/projects" },
  { title: "Blogs", href: "/blogs" },
  { title: "About", href: "/about" },
  { title: "Contact", href: "/contact" },
];

// ========== Animated Logo (Icon + Your Image) ==========
function AnimatedLogo() {
  return (
    <div className="flex items-center gap-3 group">
      {/* Animated SVG Icon */}
      <div className="relative w-9 h-9 sm:w-10 sm:h-10 shrink-0">
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Outer ring animation */}
          <circle
            cx="50"
            cy="50"
            r="42"
            stroke="currentColor"
            strokeWidth="3.5"
            className="text-primary opacity-70"
            strokeDasharray="264"
            strokeDashoffset="264"
          >
            <animate
              attributeName="stroke-dashoffset"
              values="264;0;264"
              dur="4.5s"
              repeatCount="indefinite"
            />
          </circle>

          {/* Rotating geometric path */}
          <g>
            <path
              d="M32 30 C32 30 42 22 50 22 C58 22 68 30 68 42 C68 54 58 58 50 62 C42 66 32 70 32 78 C32 86 42 90 50 90 C58 90 68 82 68 82"
              stroke="currentColor"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary"
              fill="none"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 50 50"
                to="360 50 50"
                dur="14s"
                repeatCount="indefinite"
              />
            </path>

            {/* Center diamond pulse */}
            <path d="M50 38 L58 50 L50 62 L42 50 Z" fill="currentColor" className="text-primary">
              <animate
                attributeName="opacity"
                values="0.55;1;0.55"
                dur="2.8s"
                repeatCount="indefinite"
              />
            </path>
          </g>
        </svg>
      </div>

      {/* Your Logo Image */}
      <Image
        src="/images/brandlogo/logo.png"
        alt="Sudais Azlan"
        width={1840}
        height={560}
        className="h-7 sm:h-8 md:h-9 w-auto object-contain group-hover:opacity-90 transition-opacity duration-300"
        priority
      />
    </div>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const { user } = useUser();

  const role = user?.publicMetadata?.role;
  const isAdmin = role === "ADMIN";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
        {/* ========== LEFT + CENTER ========== */}
        <div className="flex flex-1 items-center gap-6 md:gap-8 lg:gap-10">
          {/* Animated Logo + Your Image */}
          <Link href="/" className="shrink-0">
            <AnimatedLogo />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 font-medium text-muted-foreground">
            {navigationData.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className={`relative hover:text-primary transition-colors after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all hover:after:w-full ${
                  pathname === item.href ? "text-primary after:w-full" : ""
                }`}
              >
                {item.title}
              </Link>
            ))}
          </nav>
        </div>

        {/* ========== RIGHT SIDE ========== */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Desktop Auth */}
          <div className="hidden sm:flex items-center gap-2">
            <Show when="signed-out">
              <SignInButton mode="modal">
                <Button variant="outline" size="sm" className="rounded-full px-5">
                  Login
                </Button>
              </SignInButton>
            </Show>

            <Show when="signed-in">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-9 h-9",
                  },
                }}
              >
                {isAdmin && (
                  <UserButton.MenuItems>
                    <UserButton.Link
                      label="Dashboard"
                      labelIcon={<LayoutDashboard className="size-4" />}
                      href="/dashboard"
                    />
                  </UserButton.MenuItems>
                )}
              </UserButton>
            </Show>
          </div>

          {/* Theme Toggle */}
          <AnimatedThemeToggler />

          {/* Mobile Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="md:hidden">
              <Button variant="outline" size="icon" className="h-9 w-9">
                <MenuIcon className="h-4 w-4" />
                <span className="sr-only">Menu</span>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuGroup>
                {navigationData.map((item) => (
                  <DropdownMenuItem key={item.title} asChild>
                    <Link href={item.href}>{item.title}</Link>
                  </DropdownMenuItem>
                ))}

                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="flex items-center gap-2">
                      <LayoutDashboard className="size-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                )}
              </DropdownMenuGroup>

              <div className="border-t border-border mt-1 pt-1 px-1">
                <Show when="signed-out">
                  <SignInButton mode="modal">
                    <Button variant="ghost" className="w-full justify-start">
                      Login
                    </Button>
                  </SignInButton>
                </Show>

                <Show when="signed-in">
                  <div className="flex items-center gap-2 px-2 py-1.5">
                    <UserButton />
                    <span className="text-sm">Account</span>
                  </div>
                </Show>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
