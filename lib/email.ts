import { Resend } from "resend";
import { EmailEnvSchema } from "@/lib/env";

const { RESEND_API_KEY } = EmailEnvSchema.parse(process.env);
const resend = new Resend(RESEND_API_KEY);

const FROM = "Orchestr8 <orchestr8@oluwasetemi.dev>";

export async function sendResetPasswordEmail({
  to,
  name,
  url,
}: {
  to: string;
  name: string;
  url: string;
}) {
  await resend.emails.send({
    from: FROM,
    to,
    subject: "Reset your password",
    html: `
<!DOCTYPE html>
<html>
  <body style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 16px;color:#111;">
    <h2 style="margin-bottom:8px;">Reset your password</h2>
    <p style="color:#555;margin-bottom:24px;">Hi ${name}, we received a request to reset your password.</p>
    <a href="${url}"
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
