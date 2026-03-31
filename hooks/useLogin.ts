"use client"

import { useActionState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import type { Route } from "next"
import { LoginState } from "@/lib/validation-schemas"
import { loginAction } from "@/lib/actions"


export function useLogin() {
  
  const [state, formAction] = useActionState(action, null)
  const router = useRouter()
    
  async function action(prev: LoginState, formData: FormData): Promise<LoginState> {

    const result = await loginAction(prev, formData)

    if (result?.redirectTo) {
      toast.success("Welcome Back!")
      router.push(result.redirectTo as Route)
    }
    
    return result
  }

  return { state, formAction}
}