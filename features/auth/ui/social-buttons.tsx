"use client"

import { useState } from "react"
import { toast } from "sonner"
import { signIn } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { GoogleIcon, GitHubIcon } from "./provider-icons"

type Provider = "google" | "github"

const icons: Record<Provider, React.ReactNode> = {
  google: <GoogleIcon />,
  github: <GitHubIcon />,
}

const labels: Record<Provider, string> = {
  google: "Continue with Google",
  github: "Continue with GitHub",
}

export function SocialButtons() {
  const [loading, setLoading] = useState<Provider | null>(null)

  async function handleSocial(provider: Provider) {
    setLoading(provider)
    const { error } = await signIn.social({ provider, callbackURL: "/" })
    if (error) {
      toast.error(error.message ?? `${labels[provider]} failed`)
      setLoading(null)
    }
  }

  return (
    <div className="flex w-full flex-col gap-2.5">
      {(["google", "github"] as Provider[]).map((provider) => (
        <Button
          key={provider}
          type="button"
          variant="outline"
          className="h-11 w-full gap-2.5 rounded-xl border-white/[0.09] bg-white/[0.04] font-normal text-zinc-300 dark:border-white/[0.09] dark:bg-white/[0.04] dark:text-zinc-300 dark:hover:border-white/[0.18] dark:hover:bg-white/[0.1] dark:hover:text-zinc-100"
          disabled={loading !== null}
          onClick={() => handleSocial(provider)}
        >
          {loading === provider ? (
            <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : (
            icons[provider]
          )}
          {labels[provider]}
        </Button>
      ))}
    </div>
  )
}
