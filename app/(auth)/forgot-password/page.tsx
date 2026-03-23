import { requireUnauth } from "@/lib/auth-utils"
import { ForgotPasswordForm } from "@/features/auth/ui/forgot-password-form"

export default async function ForgotPasswordPage() {
  await requireUnauth()
  return <ForgotPasswordForm />
}
