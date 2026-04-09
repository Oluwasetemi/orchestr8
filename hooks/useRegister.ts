"use client"

import { useActionState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import type { Route } from "next"
import { RegisterState } from "@/lib/validation-schemas"
import { registerAction } from "@/lib/actions"


export function useRegister() {
  
  const [state, formAction, isPending] = useActionState(action, null)
  const router = useRouter()
    
  async function action(prev: RegisterState, formData: FormData): Promise<RegisterState> {

    const result = await registerAction(prev, formData)

    if (result?.redirectTo) {
      toast.success("Account created! Please sign in.")
      router.push(result.redirectTo as Route)
    } else {
      toast.error(result?.errors || "Sign up failed")
    }
    
    return result
  }

  return { state, formAction, isRegistering: isPending}
}