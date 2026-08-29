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
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CVStackedLogo } from "../logos/app-logo";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";

const navigationData = [
  { title: "Projects", href: "/projects" },
  { title: "Blogs", href: "/blogs" },
  { title: "About", href: "/about" },
  { title: "Contact", href: "/contact" },
];

const ADMIN_EMAIL = "kashisultan099@gmail.com";

export default function Navbar() {
  const pathname = usePathname();
  const { user } = useUser();

  const isAdmin = user?.primaryEmailAddress?.emailAddress?.toLowerCase() === ADMIN_EMAIL;

  return (
    <header className="bg-background/80 backdrop-blur-md sticky top-0 z-50 border-b border-border/40 shadow-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-5 sm:px-6">
        {/* ========== CENTER NAV (Logo in middle) ========== */}
        <div className="text-muted-foreground flex flex-1 items-center gap-6 font-medium md:justify-center lg:gap-12">
          {/* Left links */}
          <Link
            href="/projects"
            className={`hover:text-primary transition-colors max-md:hidden ${
              pathname === "/projects" ? "text-primary" : ""
            }`}
          >
            Projects
          </Link>
          <Link
            href="/blogs"
            className={`hover:text-primary transition-colors max-md:hidden ${
              pathname === "/blogs" ? "text-primary" : ""
            }`}
          >
            Blogs
          </Link>

          {/* Logo */}
          <Link href="/" className="shrink-0">
            <CVStackedLogo className="text-foreground gap-3" />
          </Link>

          {/* Right links */}
          <Link
            href="/about"
            className={`hover:text-primary transition-colors max-md:hidden ${
              pathname === "/about" ? "text-primary" : ""
            }`}
          >
            About
          </Link>
          <Link
            href="/contact"
            className={`hover:text-primary transition-colors max-md:hidden ${
              pathname === "/contact" ? "text-primary" : ""
            }`}
          >
            Contact
          </Link>
        </div>

        {/* ========== RIGHT SIDE ========== */}
        <div className="flex items-center gap-3">
          {/* Clerk Auth */}
          <div className="hidden sm:flex items-center gap-2">
            <Show when="signed-out">
              <SignInButton mode="modal">
                <Button variant="outline" size="sm" className="rounded-full px-4">
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
              <Button variant="outline" size="icon">
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

                {/* Admin Dashboard (mobile) */}
                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="flex items-center gap-2">
                      <LayoutDashboard className="size-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                )}
              </DropdownMenuGroup>

              {/* Mobile Auth */}
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
