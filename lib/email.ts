import { Resend } from "resend";
import { EmailEnvSchema } from "@/lib/env";

const { RESEND_API_KEY } = EmailEnvSchema.parse(process.env);
const resend = new Resend(RESEND_API_KEY);

const FROM = "Orchestr8 <orchestr8@oluwasetemi.dev>";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

export async function sendResetPasswordEmail({
  to,
  name,
  url,
}: {
  to: string;
  name: string;
  url: string;
}) {
  const safeName = escapeHtml(name)
  const resetUrl = new URL(url)
  if (
    !resetUrl.hostname.endsWith("orchestr8.dev") &&
    !resetUrl.hostname.includes("localhost")
  ) {
    throw new Error("Invalid reset URL domain")
  }

  await resend.emails.send({
    from: FROM,
    to,
    subject: "Reset your password",
    html: `
<!DOCTYPE html>
<html>
  <body style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 16px;color:#111;">
    <h2 style="margin-bottom:8px;">Reset your password</h2>
    <p style="color:#555;margin-bottom:24px;">Hi ${safeName}, we received a request to reset your password.</p>
    <a href="${resetUrl.toString()}"
       style="display:inline-block;padding:12px 24px;background:#111;color:#fff;text-decoration:none;border-radius:6px;font-weight:600;">
      Reset password
    </a>
    <p style="color:#888;font-size:13px;margin-top:24px;">
      This link expires in 1 hour. If you didn't request a reset, you can safely ignore this email.
    </p>
  </body>
</html>`,
  });
}
