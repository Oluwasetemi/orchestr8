import type { Route } from "next"
import { redirect } from "next/navigation"
import { ResetPasswordForm } from "@/features/auth/ui/reset-password-form"

interface Props {
  searchParams: Promise<{ token?: string }>
}

export default async function ResetPasswordPage({ searchParams }: Props) {
  const { token } = await searchParams

  if (!token) {
    redirect("/forgot-password" as Route)
  }

  return <ResetPasswordForm token={token} />
}
