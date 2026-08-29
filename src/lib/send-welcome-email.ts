import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = "Sudais Azlan <newsletter@sudaisazlan.com>";
const SITE_URL = "https://www.sudaisazlan.com/";

// Email-safe brand colors (portfolio-friendly)
const BRAND_PRIMARY = "#2f3430";
const BRAND_ACCENT = "#5c6b5e";

type SendWelcomeEmailResult =
  | {
      success: true;
      id: string;
    }
  | {
      success: false;
      error: string;
    };

export async function sendWelcomeEmail(email: string): Promise<SendWelcomeEmailResult> {
  console.log("========================================");
  console.log("[Newsletter] Starting welcome email");
  console.log("========================================");

  const normalizedEmail = email.trim().toLowerCase();

  console.log("[Newsletter] Recipient:", normalizedEmail);
  console.log("[Newsletter] From:", FROM_EMAIL);
  console.log("[Newsletter] RESEND_API_KEY exists:", Boolean(process.env.RESEND_API_KEY));

  if (!normalizedEmail) {
    console.error("[Newsletter] No email address provided.");

    return {
      success: false,
      error: "Email address is required.",
    };
  }

  if (!process.env.RESEND_API_KEY) {
    console.error("[Newsletter] RESEND_API_KEY is missing from environment variables.");

    return {
      success: false,
      error: "Email service is not configured.",
    };
  }

  const currentYear = new Date().getFullYear();

  try {
    console.log("[Newsletter] Calling Resend...");

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [normalizedEmail],
      subject: "Welcome — You're on the list · Sudais Azlan",
      html: `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="color-scheme" content="light" />
    <meta name="supported-color-schemes" content="light" />
    <title>Welcome to Sudais Azlan</title>
  </head>

  <body
    style="
      margin: 0;
      padding: 0;
      width: 100%;
      background-color: #f3f4f2;
      color: #151715;
      font-family: Arial, Helvetica, sans-serif;
      -webkit-font-smoothing: antialiased;
    "
  >
    <!-- Preheader -->
    <div
      style="
        display: none;
        max-height: 0;
        overflow: hidden;
        opacity: 0;
        color: transparent;
        font-size: 1px;
        line-height: 1px;
      "
    >
      Thanks for subscribing — projects, ideas, and updates from Sudais Azlan.
    </div>

    <table
      role="presentation"
      width="100%"
      cellpadding="0"
      cellspacing="0"
      border="0"
      style="width: 100%; margin: 0; padding: 0; background-color: #f3f4f2;"
    >
      <tr>
        <td align="center" style="padding: 48px 16px;">
          <!-- Main container -->
          <table
            role="presentation"
            width="620"
            cellpadding="0"
            cellspacing="0"
            border="0"
            style="
              width: 100%;
              max-width: 620px;
              background-color: #ffffff;
              border: 1px solid #e3e5e2;
            "
          >
            <!-- Brand header -->
            <tr>
              <td style="padding: 28px 30px; border-bottom: 1px solid #e8e9e7;">
                <table
                  role="presentation"
                  width="100%"
                  cellpadding="0"
                  cellspacing="0"
                  border="0"
                >
                  <tr>
                    <td align="left">
                      <a
                        href="${SITE_URL}"
                        target="_blank"
                        style="
                          display: inline-block;
                          color: #151715;
                          text-decoration: none;
                        "
                      >
                        <span
                          style="
                            display: inline-block;
                            padding: 8px 13px;
                            border-top: 2px solid ${BRAND_PRIMARY};
                            border-bottom: 2px solid ${BRAND_PRIMARY};
                            color: #151715;
                            font-family: Arial, Helvetica, sans-serif;
                            font-size: 18px;
                            line-height: 1;
                            font-weight: 900;
                            letter-spacing: -0.8px;
                          "
                        >
                          SUDAIS AZLAN
                        </span>
                      </a>
                    </td>

                    <td
                      align="right"
                      valign="middle"
                      style="
                        font-family: Arial, Helvetica, sans-serif;
                        font-size: 11px;
                        line-height: 1.4;
                        font-weight: 700;
                        letter-spacing: 1.5px;
                        text-transform: uppercase;
                        color: #8a8e89;
                      "
                    >
                      Newsletter
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Accent -->
            <tr>
              <td
                style="
                  height: 4px;
                  background-color: ${BRAND_PRIMARY};
                  font-size: 0;
                  line-height: 0;
                "
              >
                &nbsp;
              </td>
            </tr>

            <!-- Main content -->
            <tr>
              <td style="padding: 52px 34px 46px;">
                <p
                  style="
                    margin: 0 0 14px;
                    font-family: Arial, Helvetica, sans-serif;
                    font-size: 11px;
                    line-height: 1.4;
                    font-weight: 700;
                    letter-spacing: 2.2px;
                    text-transform: uppercase;
                    color: ${BRAND_ACCENT};
                  "
                >
                  Welcome
                </p>

                <h1
                  style="
                    margin: 0 0 22px;
                    font-family: Arial, Helvetica, sans-serif;
                    font-size: 36px;
                    line-height: 1.08;
                    font-weight: 800;
                    letter-spacing: -1.4px;
                    color: #151715;
                  "
                >
                  You're on the list.
                </h1>

                <p
                  style="
                    margin: 0 0 20px;
                    font-family: Arial, Helvetica, sans-serif;
                    font-size: 17px;
                    line-height: 1.7;
                    color: #4f534f;
                  "
                >
                  Thanks for subscribing to updates from
                  <strong style="color: #151715;">Sudais Azlan</strong>.
                </p>

                <p
                  style="
                    margin: 0 0 20px;
                    font-family: Arial, Helvetica, sans-serif;
                    font-size: 16px;
                    line-height: 1.75;
                    color: #5f635f;
                  "
                >
                  You’ll hear about new projects, selected work, experiments,
                  and the ideas behind the products I design and build.
                </p>

                <p
                  style="
                    margin: 0 0 34px;
                    font-family: Arial, Helvetica, sans-serif;
                    font-size: 16px;
                    line-height: 1.75;
                    color: #5f635f;
                  "
                >
                  No spam. Just occasional notes when something is worth sharing.
                </p>

                <!-- CTA -->
                <table
                  role="presentation"
                  cellpadding="0"
                  cellspacing="0"
                  border="0"
                >
                  <tr>
                    <td
                      style="
                        background-color: ${BRAND_PRIMARY};
                        border-radius: 7px;
                      "
                    >
                      <a
                        href="${SITE_URL}"
                        target="_blank"
                        style="
                          display: inline-block;
                          padding: 15px 25px;
                          border-radius: 7px;
                          font-family: Arial, Helvetica, sans-serif;
                          font-size: 14px;
                          line-height: 1;
                          font-weight: 700;
                          color: #ffffff;
                          text-decoration: none;
                        "
                      >
                        Visit the site
                        <span style="padding-left: 5px; font-size: 15px;">→</span>
                      </a>
                    </td>
                  </tr>
                </table>

                <!-- Note -->
                <table
                  role="presentation"
                  width="100%"
                  cellpadding="0"
                  cellspacing="0"
                  border="0"
                  style="margin-top: 42px;"
                >
                  <tr>
                    <td
                      style="
                        padding: 20px 20px;
                        border-left: 3px solid ${BRAND_PRIMARY};
                        background-color: #f7f8f6;
                      "
                    >
                      <p
                        style="
                          margin: 0 0 7px;
                          font-family: Arial, Helvetica, sans-serif;
                          font-size: 11px;
                          line-height: 1.4;
                          font-weight: 700;
                          letter-spacing: 1.6px;
                          text-transform: uppercase;
                          color: ${BRAND_ACCENT};
                        "
                      >
                        What to expect
                      </p>

                      <p
                        style="
                          margin: 0;
                          font-family: Arial, Helvetica, sans-serif;
                          font-size: 14px;
                          line-height: 1.7;
                          color: #626762;
                        "
                      >
                        Project launches, case-study notes, and occasional
                        insights on design, engineering, and building products.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td
                style="
                  padding: 28px 30px;
                  border-top: 1px solid #e5e7e4;
                  background-color: #fafbf9;
                "
              >
                <table
                  role="presentation"
                  width="100%"
                  cellpadding="0"
                  cellspacing="0"
                  border="0"
                >
                  <tr>
                    <td align="center">
                      <p
                        style="
                          margin: 0 0 10px;
                          font-family: Arial, Helvetica, sans-serif;
                          font-size: 11px;
                          line-height: 1.6;
                          font-weight: 700;
                          letter-spacing: 1.5px;
                          text-transform: uppercase;
                          color: #737873;
                        "
                      >
                        Sudais Azlan
                      </p>

                      <p
                        style="
                          margin: 0 0 8px;
                          font-family: Arial, Helvetica, sans-serif;
                          font-size: 12px;
                          line-height: 1.6;
                          color: #8a8e89;
                        "
                      >
                        Design, engineering, and products worth building.
                      </p>

                      <p
                        style="
                          margin: 0;
                          font-family: Arial, Helvetica, sans-serif;
                          font-size: 11px;
                          line-height: 1.6;
                          color: #a0a39f;
                        "
                      >
                        You received this email because you subscribed on
                        sudaisazlan.com.
                      </p>

                      <p
                        style="
                          margin: 8px 0 0;
                          font-family: Arial, Helvetica, sans-serif;
                          font-size: 11px;
                          line-height: 1.6;
                          color: #a0a39f;
                        "
                      >
                        © ${currentYear} Sudais Azlan
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>

          <!-- Bottom link -->
          <table
            role="presentation"
            width="620"
            cellpadding="0"
            cellspacing="0"
            border="0"
            style="width: 100%; max-width: 620px;"
          >
            <tr>
              <td align="center" style="padding: 18px 20px 0;">
                <a
                  href="${SITE_URL}"
                  target="_blank"
                  style="
                    font-family: Arial, Helvetica, sans-serif;
                    font-size: 11px;
                    line-height: 1.5;
                    color: #8a8e89;
                    text-decoration: none;
                  "
                >
                  sudaisazlan.com
                </a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
      `,
    });

    console.log("[Newsletter] Resend response received.");

    if (error) {
      console.error("[Newsletter] ❌ Resend returned an error:");
      console.error("[Newsletter] Error:", error);

      return {
        success: false,
        error: error.message,
      };
    }

    console.log("[Newsletter] ✅ Resend accepted the email.");
    console.log("[Newsletter] Email ID:", data?.id);

    if (!data?.id) {
      console.error("[Newsletter] ❌ Resend did not return an email ID.");

      return {
        success: false,
        error: "Resend did not return an email ID.",
      };
    }

    console.log("========================================");
    console.log("[Newsletter] SUCCESS");
    console.log("[Newsletter] Email ID:", data.id);
    console.log("[Newsletter] Recipient:", normalizedEmail);
    console.log("========================================");

    return {
      success: true,
      id: data.id,
    };
  } catch (error) {
    console.error("[Newsletter] ❌ Exception while sending email:");
    console.error(error);

    return {
      success: false,
      error: "Failed to send welcome email.",
    };
  }
}
