"use client"

import { useState } from "react"
import { toast } from "sonner"
import { signIn } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import type { AuthMethod } from "../hooks/use-last-used-auth"
import { GoogleIcon, GitHubIcon, EmailIcon } from "./provider-icons"

const labels: Record<AuthMethod, string> = {
  email: "Continue with email",
  google: "Continue with Google",
  github: "Continue with GitHub",
}

function MethodIcon({ method }: { method: AuthMethod }) {
  if (method === "email") return <EmailIcon />
  if (method === "google") return <GoogleIcon />
  if (method === "github") return <GitHubIcon />
  return null
}

export function LastUsedBanner({ lastUsed }: { lastUsed: AuthMethod }) {
  const [loading, setLoading] = useState(false)

  async function handleClick() {
    if (lastUsed === "email") {
      document.getElementById("email")?.focus()
      return
    }
    setLoading(true)
    const { error } = await signIn.social({
      provider: lastUsed as "google" | "github",
      callbackURL: "/",
    })
    if (error) {
      toast.error(error.message ?? `${labels[lastUsed]} failed`)
      setLoading(false)
    }
  }

  return (
    <div className="rounded-lg border border-amber-500/[0.15] bg-amber-500/[0.05] p-3">
      <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.14em] text-amber-500/50">
        Last used
      </p>
      <Button
        type="button"
        variant="ghost"
        className="h-9 w-full gap-2 rounded-lg border border-amber-500/[0.18] bg-amber-500/[0.08] text-amber-200/80 hover:border-amber-500/30 hover:bg-amber-500/[0.14] hover:text-amber-100"
        disabled={loading}
        onClick={handleClick}
      >
        {loading ? (
          <span className="size-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : (
          <MethodIcon method={lastUsed} />
        )}
        {labels[lastUsed]}
      </Button>
    </div>
  )
}
