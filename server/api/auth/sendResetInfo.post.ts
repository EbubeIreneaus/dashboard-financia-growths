import prisma from "~/lib/prisma";
import jwt from "jsonwebtoken";

export default defineEventHandler(async (event) => {
  try {
    const { email } = await readBody(event);
    const config = useRuntimeConfig();
    const { sendMail } = useNodeMailer();
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return createError({ statusCode: 404, statusMessage: "no user found" });
    }
    const token = jwt.sign({ id: user.id }, config.jwt_secret, {
      expiresIn: "3hr",
    });
    try {
      const message = `<!doctype html>,
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width">
    <title>Password reset</title>
    <style>
      /* General Resets */
      body { margin:0; padding:0; -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; }
      table { border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; }
      img { border:0; line-height:100%; outline:none; text-decoration:none; -ms-interpolation-mode:bicubic; }

      /* Container */
      .email-wrapper { width:100%; background-color:#f4f6f8; padding:24px 0; }
      .email-content { width:100%; max-width:600px; margin:0 auto; background:#ffffff; border-radius:8px; overflow:hidden; }

      /* Header */
      .email-header { padding:20px 24px; text-align:left; background:#ffffff; }
      .brand { font-weight:700; font-size:20px; color:#111827; text-decoration:none; }

      /* Body */
      .email-body { padding:32px 24px; color:#374151; font-family:system-ui,-apple-system,Segoe UI,Roboto,"Helvetica Neue",Arial; font-size:16px; line-height:1.5; }
      .greeting { font-size:18px; font-weight:600; margin-bottom:8px; color:#111827; }
      .lead { margin:16px 0; color:#374151; }

      /* Button (CTA) */
      .btn { display:inline-block; background:#2563eb; color:white; text-decoration:none; padding:12px 20px; border-radius:8px; font-weight:600; }
      .btn:active, .btn:visited { color:white; }
      .muted { color:#6b7280; font-size:13px; }

      /* Footer */
      .email-footer { padding:20px 24px; font-size:13px; color:#6b7280; background:#fafafa; text-align:left; }

      /* Responsive */
      @media (max-width:420px) {
        .email-body { padding:20px 16px; }
        .email-header { padding:16px; }
        .email-footer { padding:16px; }
      }

      /* High-contrast / forced colors fallback */
      @media (prefers-color-scheme:dark) {
        .email-content { background:#0b1220; color:#e6eef8; }
        .email-body, .email-footer, .brand { color:#e6eef8; }
        .btn { background:#2b6ef6; }
      }
    </style>
  </head>
  <body class="email-wrapper" role="article" aria-roledescription="email">
    <center>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center">
            <table role="presentation" class="email-content" width="100%" cellpadding="0" cellspacing="0">
              <!-- Header -->
              <tr>
                <td class="email-header" align="left">
                  <a class="brand" href="https://financia-growth.con" target="_blank" rel="noopener
                  Financial Growth
                  </a>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td class="email-body" align="left">
                  <div class="greeting">Hi ${user.fullname},</div>

                  <div class="lead">
                    We received a request to reset the password for your Financial Growths account.
                  </div>

                  <p>
                    Click the button below to reset your password. The link will expire in <strong> 3 hours</strong>.
                  </p>

                  <p style="text-align:center; margin:24px 0;">
                    <!-- Primary CTA -->
                    <a href="https://financia-growth.com/auth/reset/${token}" class="btn" target="_blank" rel="noopener noreferrer" aria-label="Reset your password">
                      Reset password
                    </a>
                  </p>

                  <p class="muted">
                    If the button doesn't work, copy and paste this URL into your browser:
                  </p>

                  <p style="word-break:break-all; font-size:13px; color:#111827;">
                    <a href="https://financia-growth.com/auth/reset/${token}" target="_blank" rel="noopener noreferrer" style="color:#0b69ff; text-decoration:underline;">
                    https://financia-growth.com/auth/reset/${token}
                    </a>
                  </p>

                  <hr style="border:none; border-top:1px solid #eef2f7; margin:20px 0;" />

                  <p class="muted">
                    If you didn't request a password reset, you can safely ignore this email — no changes will be made.
                  </p>

                  <p class="muted">
                    Need help? Contact us at <a href="mailto:support@financia-growth.com" style="color:#0b69ff; text-decoration:underline;">
                    support@financia-growth.com
                    </a>.
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td class="email-footer" align="left">
                  <div class="muted">© ${new Date().getFullYear()} Financial Growths. All rights reserved.</div>
                </td>
              </tr>
            </table>
            <!-- End content -->
          </td>
        </tr>
      </table>
    </center>
  </body>
</html>`;
      await sendMail({
        subject: `Password Reset`,
        text: message,
        html: message,
        to: user.email,
      });
    } catch (error) {
      console.log("error sending mail", error);
    }
    return { statusCode: 200 };
  } catch (error: any) {
    return createError({ statusCode: 500, statusMessage: error.message });
  }
});
