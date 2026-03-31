'use server'

import { z } from "zod/v4"
import { toast } from "sonner"
import { authClient, signIn, signUp } from "@/lib/auth-client"
import {
  loginSchema, 
  LoginState, 
  registerSchema, 
  RegisterState, 
  resetPassordSchema, 
  ResetPasswordState 
} from "./validation-schemas"


/*  
  ___________________________________________
  Server Action for User's Registration
  ___________________________________________
*/
export async function registerAction(_prev: RegisterState, formData: FormData): Promise<RegisterState> {
  
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirm: formData.get("confirm"),
  })

  if (!parsed.success) {
    const f = z.treeifyError(parsed.error).properties ?? {}

    return {
      errors: {
        name: f.name?.errors?.[0],
        email: f.email?.errors?.[0],
        password: f.password?.errors?.[0],
        confirm: f.confirm?.errors?.[0],
      },
    }
  }

  const { name, email, password } = parsed.data

  const { error } = await signUp.email({ name, email, password })

  if (error) {
    const msg = error.message ?? ""
    if (msg.toLowerCase().includes("already")) return { errors: { email: "An account with this email already exists" } }
    if (msg.toLowerCase().includes("password")) return { errors: { password: msg } }
    if (msg.toLowerCase().includes("name")) return { errors: { name: msg } }
    toast.error(msg || "Sign up failed")
    return null
  }
  
  return {
    redirectTo: '/login'
  }

}


/*  
  ___________________________________________
  Server Action for User's Login
  ___________________________________________
*/
export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  })
  if (!parsed.success) {
    const f = parsed.error.flatten().fieldErrors
    return { errors: { email: f.email?.[0], password: f.password?.[0] } }
  }
  const { error } = await signIn.email(parsed.data)
  if (error) {
    const msg = error.message ?? ""
    if (msg.toLowerCase().includes("password")) return { errors: { password: "Invalid email or password" } }
    if (msg.toLowerCase().includes("email")) return { errors: { email: msg } }
    toast.error(msg || "Sign in failed")
    return null
  }
  
  return {
    redirectTo: '/'
  }
}

/*  
  ___________________________________________
  Server Action for User's Reset-Password
  ___________________________________________
*/
export async function resetPasswordAction(_prev: ResetPasswordState, formData: FormData): Promise<ResetPasswordState> {
  const parsed = resetPassordSchema.safeParse({
    password: formData.get("password"),
    confirm: formData.get("confirm"),
    token: formData.get("token")
  })
  if (!parsed.success) {
    const f = z.treeifyError(parsed.error).properties ?? {}
    return { errors: { password: f.password?.errors?.[0], confirm: f.confirm?.errors?.[0], token: f.token?.errors?.[0] } }
  }

  const {token, password} = parsed.data

  const { error } = await authClient.resetPassword({ newPassword: password, token})
  if (error) {
    if (error.message?.toLowerCase().includes("token")) {
      toast.error("This reset link has expired or already been used. Request a new one.")
      return null
    }
    return { errors: { password: error.message ?? "Failed to reset password" } }
  }
  toast.success("Password updated — please sign in.")
  
  return {
    redirectTo: '/login'
  }
}