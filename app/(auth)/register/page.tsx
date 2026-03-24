import { requireUnauth } from "@/lib/auth-utils"
import { RegisterForm } from "@/features/auth/ui/register-form"

export default async function RegisterPage() {
  await requireUnauth()
  return <RegisterForm />
}
