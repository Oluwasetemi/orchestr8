"use client"

import { useState, useEffect } from "react"
import { getLastUsedLoginMethod } from "@/lib/auth-client"

export type AuthMethod = "email" | "google" | "github"

/**
 * Reads the last used login method from the Better Auth cookie.
 * The cookie is written automatically by the lastLoginMethod plugin
 * after every successful sign-in — no manual tracking needed.
 */
export function useLastUsedAuth() {
  const [lastUsed, setLastUsed] = useState<AuthMethod | null>(null)

  useEffect(() => {
    const method = getLastUsedLoginMethod()
    if (method === "email" || method === "google" || method === "github") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLastUsed(method)
    }
  }, [])

  return { lastUsed }
}
