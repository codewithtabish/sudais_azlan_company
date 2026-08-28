// src/components/dashboard/sidebar.tsx

"use client";

import { ModeToggle } from "@/components/general/themes/mode-toogle";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  FileText,
  FolderKanban,
  Images,
  LayoutDashboard,
  PanelLeftClose,
  PanelLeftOpen,
  PrinterIcon,
  Settings,
  Tags,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Suspense,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ComponentType,
} from "react";

/* ==========================================================================
   TYPES
   ========================================================================== */

type NavItem = {
  label: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
  exact?: boolean;
};

/* ==========================================================================
   NAVIGATION
   ========================================================================== */

const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    label: "Projects",
    href: "/dashboard/projects",
    icon: FolderKanban,
  },
  {
    label: "Projects Category",
    href: "/dashboard/project-categories",
    icon: PrinterIcon,
  },
  {
    label: "Blogs",
    href: "/dashboard/blogs",
    icon: FileText,
  },
  {
    label: "Assets",
    href: "/dashboard/assets",
    icon: Images,
  },
  {
    label: "Category",
    href: "/dashboard/category",
    icon: Tags,
  },
  {
    label: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

/* ==========================================================================
   STORAGE
   ========================================================================== */

const STORAGE_KEY = "dashboard-sidebar-collapsed";

/* ==========================================================================
   COLLAPSED SIDEBAR STORE
   ========================================================================== */

const collapsedListeners = new Set<() => void>();

function subscribeCollapsed(onChange: () => void) {
  collapsedListeners.add(onChange);
  window.addEventListener("storage", onChange);

  return () => {
    collapsedListeners.delete(onChange);
    window.removeEventListener("storage", onChange);
  };
}

function getCollapsedSnapshot() {
  return window.localStorage.getItem(STORAGE_KEY) === "1";
}

function getCollapsedServerSnapshot() {
  return false;
}

function setCollapsedStore(next: boolean) {
  window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
  collapsedListeners.forEach((listener) => listener());
}

/* ==========================================================================
   SIDEBAR
   ========================================================================== */

export function DashboardSidebar() {
  return (
    <Suspense fallback={<DashboardSidebarSkeleton />}>
      <DashboardSidebarContent />
    </Suspense>
  );
}

/* ==========================================================================
   SIDEBAR CONTENT
   ========================================================================== */

function DashboardSidebarContent() {
  const pathname = usePathname();

  const collapsed = useSyncExternalStore(
    subscribeCollapsed,
    getCollapsedSnapshot,
    getCollapsedServerSnapshot,
  );

  const listRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<Map<string, HTMLLIElement>>(new Map());

  const [marker, setMarker] = useState({
    top: 0,
    height: 0,
    ready: false,
  });

  const isActive = (item: NavItem) => {
    if (item.exact) return pathname === item.href;
    return pathname?.startsWith(item.href) ?? false;
  };

  const toggleCollapsed = () => {
    setCollapsedStore(!collapsed);
  };

  useLayoutEffect(() => {
    const activeItem = NAV_ITEMS.find(isActive);
    const activeElement = activeItem ? itemRefs.current.get(activeItem.href) : null;

    if (!activeElement || !listRef.current) {
      setMarker((prev) => ({ ...prev, ready: false }));
      return;
    }

    const listRect = listRef.current.getBoundingClientRect();
    const itemRect = activeElement.getBoundingClientRect();

    setMarker({
      top: itemRect.top - listRect.top,
      height: itemRect.height,
      ready: true,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, collapsed]);

  return (
    <aside
      className={cn(
        "group/sidebar sticky top-0 flex h-svh shrink-0 flex-col overflow-hidden",
        "border-r border-sidebar-border bg-sidebar text-sidebar-foreground",
        "transition-[width] duration-300 ease-out",
        collapsed ? "w-[72px]" : "w-64",
      )}
    >
      {/* Brand */}
      <div className="relative flex h-16 shrink-0 items-center border-b border-sidebar-border px-4">
        <Link
          href="/dashboard"
          aria-label="Sudais Azlan Dashboard"
          className="flex min-w-0 items-center gap-2.5"
        >
          {/* Gradient brand mark */}
          <span
            className={cn(
              "flex size-8 shrink-0 items-center justify-center rounded-md",
              "bg-gradient-to-br from-primary via-primary to-primary/80",
              "text-sm font-semibold text-primary-foreground",
              "shadow-sm shadow-primary/20",
              "ring-1 ring-primary/30",
            )}
          >
            S
          </span>

          <span
            className={cn(
              "flex min-w-0 flex-col overflow-hidden transition-all duration-300",
              collapsed ? "w-0 opacity-0" : "w-auto opacity-100",
            )}
          >
            <span className="truncate text-sm font-semibold tracking-tight text-sidebar-foreground">
              Sudais Azlan
            </span>
            <span className="truncate text-[11px] text-muted-foreground">Studio</span>
          </span>
        </Link>

        {/* Collapse toggle */}
        <button
          type="button"
          onClick={toggleCollapsed}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-pressed={collapsed}
          className={cn(
            "absolute top-1/2 -right-3.5 z-10 flex size-7 -translate-y-1/2",
            "items-center justify-center rounded-full",
            "border border-sidebar-border bg-sidebar text-muted-foreground shadow-sm",
            "transition-all duration-200",
            "hover:border-primary/40 hover:bg-sidebar-accent hover:text-primary",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            "focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar",
          )}
        >
          {collapsed ? (
            <PanelLeftOpen className="size-3.5" />
          ) : (
            <PanelLeftClose className="size-3.5" />
          )}
        </button>
      </div>

      {/* Section label */}
      <div
        className={cn(
          "px-4 pt-5 pb-2 text-[11px] font-medium tracking-wider text-muted-foreground uppercase",
          "transition-opacity duration-200",
          collapsed && "opacity-0",
        )}
      >
        Workspace
      </div>

      {/* Navigation */}
      <nav aria-label="Dashboard navigation" className="relative flex-1 px-3">
        <ul ref={listRef} className="relative flex flex-col gap-0.5">
          {/* Active gradient marker */}
          <div
            aria-hidden
            className={cn(
              "pointer-events-none absolute left-0 w-[3px] rounded-full",
              "bg-gradient-to-b from-primary via-primary to-primary/70",
              "transition-all duration-300 ease-out",
              marker.ready ? "opacity-100" : "opacity-0",
            )}
            style={{
              top: marker.top,
              height: marker.height,
            }}
          />

          {NAV_ITEMS.map((item) => {
            const active = isActive(item);
            const Icon = item.icon;

            return (
              <li
                key={item.href}
                ref={(el) => {
                  if (el) itemRefs.current.set(item.href, el);
                  else itemRefs.current.delete(item.href);
                }}
              >
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-md py-2.5 pr-3 pl-3.5 text-sm",
                    "transition-all duration-200",
                    active
                      ? "bg-gradient-to-r from-primary/12 via-primary/8 to-transparent font-medium text-primary"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/80 hover:text-sidebar-foreground",
                  )}
                >
                  <Icon
                    className={cn(
                      "size-[18px] shrink-0 transition-all duration-200",
                      active
                        ? "text-primary"
                        : "text-sidebar-foreground/55 group-hover:text-sidebar-foreground",
                      "group-hover:scale-105",
                    )}
                  />

                  <span
                    className={cn(
                      "overflow-hidden whitespace-nowrap transition-all duration-300",
                      collapsed ? "w-0 opacity-0" : "w-auto opacity-100",
                    )}
                  >
                    {item.label}
                  </span>

                  {/* Collapsed tooltip */}
                  {collapsed && (
                    <span
                      className={cn(
                        "pointer-events-none absolute left-full top-1/2 z-50 ml-3 -translate-y-1/2",
                        "whitespace-nowrap rounded-md border border-border bg-popover px-2.5 py-1.5",
                        "text-xs text-popover-foreground shadow-md",
                        "scale-95 opacity-0 transition-all duration-150",
                        "group-hover:scale-100 group-hover:opacity-100",
                      )}
                    >
                      {item.label}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div
        className={cn(
          "flex items-center gap-3 border-t border-sidebar-border p-4",
          collapsed ? "flex-col" : "flex-row justify-between",
        )}
      >
        <p
          className={cn(
            "truncate text-[11px] tracking-wider text-muted-foreground uppercase",
            "transition-opacity duration-200",
            collapsed ? "hidden" : "block",
          )}
        >
          Sudais Azlan · 2026
        </p>

        <ModeToggle />
      </div>
    </aside>
  );
}

/* ==========================================================================
   SUSPENSE FALLBACK
   ========================================================================== */

function DashboardSidebarSkeleton() {
  return (
    <aside className="sticky top-0 flex h-svh w-64 shrink-0 flex-col overflow-hidden border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      <div className="flex h-16 shrink-0 items-center border-b border-sidebar-border px-4">
        <div className="flex items-center gap-2.5">
          <div className="size-8 shrink-0 animate-pulse rounded-md bg-sidebar-accent" />
          <div className="space-y-1.5">
            <div className="h-3.5 w-24 animate-pulse rounded bg-sidebar-accent" />
            <div className="h-2.5 w-14 animate-pulse rounded bg-sidebar-accent" />
          </div>
        </div>
      </div>

      <div className="px-4 pt-5 pb-2">
        <div className="h-2.5 w-16 animate-pulse rounded bg-sidebar-accent" />
      </div>

      <nav className="flex-1 px-3">
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <div className="flex h-10 items-center gap-3 rounded-md px-3.5">
                <div className="size-[18px] shrink-0 animate-pulse rounded bg-sidebar-accent" />
                <div className="h-3.5 w-24 animate-pulse rounded bg-sidebar-accent" />
              </div>
            </li>
          ))}
        </ul>
      </nav>

      <div className="flex items-center justify-between border-t border-sidebar-border p-4">
        <div className="h-2.5 w-24 animate-pulse rounded bg-sidebar-accent" />
        <div className="size-8 animate-pulse rounded-md bg-sidebar-accent" />
      </div>
    </aside>
  );
}

export default DashboardSidebar;
