import { createAuthClient } from "better-auth/react"
import { lastLoginMethodClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  plugins: [lastLoginMethodClient()],
})

export const { signIn, signUp, signOut, useSession } = authClient

// Better Auth v1 uses requestPasswordReset (endpoint: /request-password-reset)
export const requestPasswordReset = authClient.requestPasswordReset

// Last login method helpers (reads from cookie, no network request)
export const getLastUsedLoginMethod = authClient.getLastUsedLoginMethod
export const isLastUsedLoginMethod = authClient.isLastUsedLoginMethod
