import "server-only"

import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import type { Route } from "next"

/**
 * Assert an active session exists.
 * Redirects to /login if not authenticated.
 * Use in Server Components / Route Handlers that require a logged-in user.
 */
export async function requireAuth() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect("/login" as Route)
  return session
}

/**
 * Assert no active session exists.
 * Redirects to / if the user is already logged in.
 * Use on login / register / forgot-password pages.
 */
export async function requireUnauth() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (session) redirect("/" as Route)
}
