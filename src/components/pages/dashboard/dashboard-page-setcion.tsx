// src/components/dashboard/dashboard-page-comp.tsx
// or: src/app/dashboard/page.tsx  (if you prefer)

"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import { ArrowUpRight, Eye, FileText, FolderKanban, Images, TrendingUp } from "lucide-react";
import Link from "next/link";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";

/* -------------------------------------------------------------------------- */
/*  Mock data – replace with real data later                                  */
/* -------------------------------------------------------------------------- */

const stats = [
  {
    title: "Total Projects",
    value: "24",
    change: "+3 this month",
    icon: FolderKanban,
    href: "/dashboard/projects",
  },
  {
    title: "Published Blogs",
    value: "48",
    change: "+6 this month",
    icon: FileText,
    href: "/dashboard/blogs",
  },
  {
    title: "Assets",
    value: "312",
    change: "+28 this month",
    icon: Images,
    href: "/dashboard/assets",
  },
  {
    title: "Page Views",
    value: "18.4k",
    change: "+12.5%",
    icon: Eye,
    href: "/dashboard/analytics",
  },
];

const trafficData = [
  { month: "Jan", views: 2400, visitors: 1400 },
  { month: "Feb", views: 3100, visitors: 1800 },
  { month: "Mar", views: 2800, visitors: 1600 },
  { month: "Apr", views: 4200, visitors: 2400 },
  { month: "May", views: 3900, visitors: 2200 },
  { month: "Jun", views: 5100, visitors: 2900 },
  { month: "Jul", views: 4800, visitors: 2700 },
  { month: "Aug", views: 6200, visitors: 3400 },
];

const contentData = [
  { name: "Projects", value: 24, fill: "var(--color-projects)" },
  { name: "Blogs", value: 48, fill: "var(--color-blogs)" },
  { name: "Assets", value: 312, fill: "var(--color-assets)" },
];

const recentActivity = [
  {
    title: "New project published",
    description: "Portfolio redesign went live",
    time: "2h ago",
    href: "/dashboard/projects",
  },
  {
    title: "Blog post drafted",
    description: "Building with Next.js 15",
    time: "5h ago",
    href: "/dashboard/blogs",
  },
  {
    title: "Assets uploaded",
    description: "12 new images added",
    time: "1d ago",
    href: "/dashboard/assets",
  },
  {
    title: "Category updated",
    description: "Open Source category refined",
    time: "2d ago",
    href: "/dashboard/category",
  },
];

/* -------------------------------------------------------------------------- */
/*  Chart configs                                                             */
/* -------------------------------------------------------------------------- */

const trafficConfig = {
  views: {
    label: "Views",
    color: "var(--primary)",
  },
  visitors: {
    label: "Visitors",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

const contentConfig = {
  projects: {
    label: "Projects",
    color: "var(--primary)",
  },
  blogs: {
    label: "Blogs",
    color: "var(--chart-2)",
  },
  assets: {
    label: "Assets",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

const monthlyContentData = [
  { month: "Jan", projects: 2, blogs: 4 },
  { month: "Feb", projects: 3, blogs: 5 },
  { month: "Mar", projects: 1, blogs: 6 },
  { month: "Apr", projects: 4, blogs: 3 },
  { month: "May", projects: 2, blogs: 7 },
  { month: "Jun", projects: 5, blogs: 4 },
  { month: "Jul", projects: 3, blogs: 8 },
  { month: "Aug", projects: 4, blogs: 6 },
];

const monthlyConfig = {
  projects: {
    label: "Projects",
    color: "var(--primary)",
  },
  blogs: {
    label: "Blogs",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export default function DashboardPageSection() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Dashboard
        </h1>
        <p className="text-sm text-muted-foreground">
          Overview of your studio performance and content.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.title} href={stat.href} className="group">
              <Card className="h-full transition-all duration-200 hover:border-primary/30 hover:shadow-md">
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div
                    className={cn(
                      "flex size-9 items-center justify-center rounded-md",
                      "bg-gradient-to-br from-primary/15 via-primary/10 to-transparent",
                      "text-primary ring-1 ring-primary/20",
                      "transition-transform duration-200 group-hover:scale-105",
                    )}
                  >
                    <Icon className="size-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-semibold tracking-tight">{stat.value}</div>
                  <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <TrendingUp className="size-3 text-primary" />
                    {stat.change}
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Charts row */}
      <div className="grid gap-4 lg:grid-cols-7">
        {/* Traffic Area Chart */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Traffic Overview</CardTitle>
            <CardDescription>Views and unique visitors over the last 8 months</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ChartContainer config={trafficConfig} className="h-[280px] w-full">
              <AreaChart data={trafficData} margin={{ left: 0, right: 12, top: 8 }}>
                <defs>
                  <linearGradient id="fillViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-views)" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="var(--color-views)" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="fillVisitors" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-visitors)" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="var(--color-visitors)" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  vertical={false}
                  strokeDasharray="3 3"
                  className="stroke-border/50"
                />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  className="text-xs text-muted-foreground"
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  className="text-xs text-muted-foreground"
                  width={40}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  dataKey="visitors"
                  type="monotone"
                  fill="url(#fillVisitors)"
                  stroke="var(--color-visitors)"
                  strokeWidth={2}
                  stackId="a"
                />
                <Area
                  dataKey="views"
                  type="monotone"
                  fill="url(#fillViews)"
                  stroke="var(--color-views)"
                  strokeWidth={2}
                  stackId="a"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Content Distribution Pie */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Content Mix</CardTitle>
            <CardDescription>Distribution across your studio</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={contentConfig} className="mx-auto h-[220px] w-full">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent nameKey="name" hideLabel />} />
                <Pie
                  data={contentData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={58}
                  outerRadius={88}
                  strokeWidth={2}
                  paddingAngle={3}
                >
                  {contentData.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>

            <div className="mt-4 flex flex-wrap justify-center gap-4">
              {contentData.map((item) => (
                <div key={item.name} className="flex items-center gap-2 text-sm">
                  <span
                    className="size-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: item.fill }}
                  />
                  <span className="text-muted-foreground">{item.name}</span>
                  <span className="font-medium tabular-nums">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom row */}
      <div className="grid gap-4 lg:grid-cols-7">
        {/* Monthly content bar chart */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Content Published</CardTitle>
            <CardDescription>Projects & blogs per month</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ChartContainer config={monthlyConfig} className="h-[260px] w-full">
              <BarChart data={monthlyContentData} margin={{ left: 0, right: 12, top: 8 }}>
                <CartesianGrid
                  vertical={false}
                  strokeDasharray="3 3"
                  className="stroke-border/50"
                />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  className="text-xs text-muted-foreground"
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  className="text-xs text-muted-foreground"
                  width={32}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="projects"
                  fill="var(--color-projects)"
                  radius={[4, 4, 0, 0]}
                  barSize={18}
                />
                <Bar dataKey="blogs" fill="var(--color-blogs)" radius={[4, 4, 0, 0]} barSize={18} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
              <CardDescription>Latest updates across your studio</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            {recentActivity.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className={cn(
                  "group flex items-start gap-3 rounded-lg px-3 py-3",
                  "transition-colors hover:bg-muted/60",
                )}
              >
                <div
                  className={cn(
                    "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md",
                    "bg-gradient-to-br from-primary/15 to-primary/5 text-primary",
                    "ring-1 ring-primary/15",
                  )}
                >
                  <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground group-hover:text-primary">
                    {item.title}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {item.description}
                  </p>
                </div>
                <span className="shrink-0 text-[11px] text-muted-foreground tabular-nums">
                  {item.time}
                </span>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
