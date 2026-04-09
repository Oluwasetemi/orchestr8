"use client"

import { useActionState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import type { Route } from "next"
import { ResetPasswordState } from "@/lib/validation-schemas"
import { resetPasswordAction } from "@/lib/actions"


export function useResetPassword() {
  
  const [state, formAction, isPending] = useActionState(action, null)
  const router = useRouter()
    
  async function action(prev: ResetPasswordState, formData: FormData): Promise<ResetPasswordState> {

    const result = await resetPasswordAction(prev, formData)

    if (result?.redirectTo) {
      toast.success("Password updated — please proceed to sign in with your new password.")
      router.push(result.redirectTo as Route)
    } else {
      toast.error(result?.errors || "Reset Password failed")
      return null
    }
    
    return result
  }

  return { state, formAction, isResettingPassword: isPending}
}