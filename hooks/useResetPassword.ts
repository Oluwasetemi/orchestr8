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
    try {
      const result = await resetPasswordAction(prev, formData)
  
      if (result?.redirectTo) {
        toast.success("Password updated — please proceed to sign in with your new password.")
        router.push(result.redirectTo as Route)
      } else {
        const { password, confirm, token } = result?.errors ?? {}

        if (token) toast.error(token)
        if (password) toast.error(password)
        if (confirm) toast.error(confirm)

        return null
      }

      return result

    }  catch (error) {
      toast.error("Something went wrong, please try again.")
      return null
    }
  }

  return { state, formAction, isResettingPassword: isPending}
}