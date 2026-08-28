import prisma from "@/lib/prisma-client";
import { clerkClient } from "@clerk/nextjs/server";
import type { WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { Webhook } from "svix";

// ============================================================
// TYPES
// ============================================================

console.log("I AM HERE AND IT FIRED ...");

type ClerkEmailAddress = {
  id: string;
  email_address: string;
};

type ClerkUserWebhookData = {
  id: string;
  first_name?: string | null;
  last_name?: string | null;
  primary_email_address_id?: string | null;
  email_addresses?: ClerkEmailAddress[];
};

type ClerkSessionWebhookData = {
  user_id?: string;
};

// ============================================================
// ADMIN EMAILS
// ============================================================

function getAdminEmails(): Set<string> {
  return new Set(
    (process.env.ADMIN_EMAILS ?? "")
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean),
  );
}

// ============================================================
// GET USER EMAIL
// ============================================================

function getUserEmail(data: ClerkUserWebhookData): string | null {
  const primaryEmail = data.email_addresses?.find(
    (item: ClerkEmailAddress) => item.id === data.primary_email_address_id,
  );

  return primaryEmail?.email_address ?? data.email_addresses?.[0]?.email_address ?? null;
}

// ============================================================
// WEBHOOK
// ============================================================

export async function POST(req: Request) {
  // ============================================================
  // WEBHOOK SECRET
  // ============================================================

  const webhookSecret = process.env.CLERK_WEBHOOK_SIGNING_SECRET;

  console.log("webhookSecret", webhookSecret);

  if (!webhookSecret) {
    console.error("[Clerk Webhook] Missing CLERK_WEBHOOK_SIGNING_SECRET");

    return new Response("Missing webhook secret", {
      status: 500,
    });
  }

  // ============================================================
  // SVIX HEADERS
  // ============================================================

  const headerPayload = await headers();

  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    console.warn("[Clerk Webhook] Missing Svix headers");

    return new Response("Missing Svix headers", {
      status: 400,
    });
  }

  // ============================================================
  // READ RAW BODY
  // ============================================================

  const payload = await req.text();

  // ============================================================
  // VERIFY WEBHOOK
  // ============================================================

  const webhook = new Webhook(webhookSecret);

  let event: WebhookEvent;

  try {
    event = webhook.verify(payload, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as WebhookEvent;
  } catch (error) {
    console.error("[Clerk Webhook] Verification failed:", error);

    return new Response("Invalid webhook", {
      status: 400,
    });
  }

  // ============================================================
  // ADMIN EMAILS FROM ENV
  // ============================================================

  const adminEmails = getAdminEmails();

  // ============================================================
  // HANDLE EVENT
  // ============================================================

  try {
    switch (event.type) {
      // ========================================================
      // USER CREATED
      // ========================================================

      case "user.created": {
        const data = event.data as ClerkUserWebhookData;

        const email = getUserEmail(data);

        const normalizedEmail = email?.trim().toLowerCase() ?? null;

        const role = normalizedEmail && adminEmails.has(normalizedEmail) ? "ADMIN" : "USER";

        // ------------------------------------------------------
        // CREATE OR UPDATE LOCAL USER
        // ------------------------------------------------------

        await prisma.user.upsert({
          where: {
            clerkId: data.id,
          },

          update: {
            firstName: data.first_name ?? null,
            lastName: data.last_name ?? null,
            email,

            // Only promote here.
            // We don't accidentally demote an existing admin.
            ...(role === "ADMIN"
              ? {
                  role: "ADMIN",
                }
              : {}),
          },

          create: {
            clerkId: data.id,
            firstName: data.first_name ?? null,
            lastName: data.last_name ?? null,
            email,
            role,
          },
        });

        // ------------------------------------------------------
        // SYNC ROLE TO CLERK PUBLIC METADATA
        // ------------------------------------------------------

        try {
          const client = await clerkClient();

          await client.users.updateUserMetadata(data.id, {
            publicMetadata: {
              role,
            },
          });
        } catch (metadataError) {
          console.error("[Clerk Webhook] Failed to sync Clerk metadata:", metadataError);
        }

        console.log("[Clerk Webhook] User created:", data.id, "role:", role);

        break;
      }

      // ========================================================
      // USER UPDATED
      // ========================================================

      case "user.updated": {
        const data = event.data as ClerkUserWebhookData;

        const email = getUserEmail(data);

        const normalizedEmail = email?.trim().toLowerCase() ?? null;

        const shouldBeAdmin = normalizedEmail !== null && adminEmails.has(normalizedEmail);

        // ------------------------------------------------------
        // UPDATE LOCAL USER
        // ------------------------------------------------------

        await prisma.user.updateMany({
          where: {
            clerkId: data.id,
          },

          data: {
            firstName: data.first_name ?? null,
            lastName: data.last_name ?? null,

            ...(email !== null
              ? {
                  email,
                }
              : {}),

            // Promote users whose email is in ADMIN_EMAILS.
            //
            // We intentionally do NOT automatically demote
            // existing admins if their email changes.
            ...(shouldBeAdmin
              ? {
                  role: "ADMIN",
                }
              : {}),
          },
        });

        // ------------------------------------------------------
        // SYNC ROLE TO CLERK
        // ------------------------------------------------------

        try {
          const client = await clerkClient();

          await client.users.updateUserMetadata(data.id, {
            publicMetadata: {
              role: shouldBeAdmin ? "ADMIN" : "USER",
            },
          });
        } catch (metadataError) {
          console.error("[Clerk Webhook] Failed to sync Clerk metadata:", metadataError);
        }

        console.log("[Clerk Webhook] User updated:", data.id);

        break;
      }

      // ========================================================
      // SESSION CREATED
      // ========================================================

      case "session.created": {
        const data = event.data as ClerkSessionWebhookData;

        if (!data.user_id) {
          console.warn("[Clerk Webhook] session.created without user_id");

          break;
        }

        // ------------------------------------------------------
        // YOUR PRISMA SCHEMA USES `lastSeen`
        // ------------------------------------------------------

        await prisma.user.updateMany({
          where: {
            clerkId: data.user_id,
          },

          data: {
            lastSeen: new Date(),
          },
        });

        console.log("[Clerk Webhook] User login tracked:", data.user_id);

        break;
      }

      // ========================================================
      // USER DELETED
      // ========================================================

      case "user.deleted": {
        const data = event.data as {
          id?: string;
        };

        if (!data.id) {
          console.warn("[Clerk Webhook] user.deleted without user id");

          break;
        }

        // ------------------------------------------------------
        // DELETE LOCAL USER
        // ------------------------------------------------------

        await prisma.user.deleteMany({
          where: {
            clerkId: data.id,
          },
        });

        console.log("[Clerk Webhook] User deleted:", data.id);

        break;
      }

      // ========================================================
      // OTHER EVENTS
      // ========================================================

      default: {
        console.log("[Clerk Webhook] Ignoring event:", event.type);

        break;
      }
    }

    // ==========================================================
    // SUCCESS
    // ==========================================================

    return Response.json({
      success: true,
    });
  } catch (error) {
    console.error("[Clerk Webhook] Error:", error);

    const message = error instanceof Error ? error.message : "Unknown webhook error";

    return new Response(`Webhook Error: ${message}`, {
      status: 500,
    });
  }
}
