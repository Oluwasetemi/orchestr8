"use client"

import { useActionState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import type { Route } from "next"
import { LoginState } from "@/lib/validation-schemas"
import { loginAction } from "@/lib/actions"


export function useLogin() {
  
  const [state, formAction, isPending] = useActionState(action, null)
  const router = useRouter()
    
  async function action(prev: LoginState, formData: FormData): Promise<LoginState> {

    let result: LoginState

    try {
      result = await loginAction(prev, formData)
    } catch {
      toast.error("Sign in failed")
      return { errors: { email: "Something went wrong. Please try again." } }
    }
  

    if (result?.redirectTo) {
      toast.success("Welcome Back!")
      router.push(result.redirectTo as Route)
    } else {
      const message = result?.errors?.email ?? result?.errors?.password ?? "Sign in failed"
      toast.error(message)
    }
    
    return result
  }

  return { state, formAction, isLoggingIn: isPending}
}