import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
})

export const { signIn, signUp, signOut, useSession } = authClient

// Better Auth v1 uses requestPasswordReset (endpoint: /request-password-reset)
export const requestPasswordReset = authClient.requestPasswordReset
