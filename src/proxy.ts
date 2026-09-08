// src/proxy.ts

import { clerkClient, clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default clerkMiddleware(async (auth, req) => {
  const { pathname } = req.nextUrl;

  const isDashboardRoute = pathname === "/dashboard" || pathname.startsWith("/dashboard/");

  const isAgentRoute = pathname === "/agent" || pathname.startsWith("/agent/");

  const isProtectedRoute = isDashboardRoute || isAgentRoute;

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  const { userId, sessionClaims } = await auth();

  console.log("[Clerk Proxy]", {
    pathname,
    userId,
    isAuthenticated: !!userId,
  });

  if (!userId) {
    return NextResponse.redirect(
      new URL(`/sign-in?redirect_url=${encodeURIComponent(req.url)}`, req.url),
    );
  }

  let role = (sessionClaims?.metadata as { role?: string } | undefined)?.role;

  if (!role) {
    const client = await clerkClient();

    const user = await client.users.getUser(userId);

    role = (user.publicMetadata as { role?: string } | undefined)?.role;
  }

  console.log("[Clerk Proxy] Authorization", {
    userId,
    role,
  });

  if (role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/__clerk/(.*)",
  ],
};
