"use client"

import { useActionState, useState } from "react"
import Link from "next/link"
import type { Route } from "next"
import { z } from "zod/v4"
import { toast } from "sonner"
import { requestPasswordReset } from "@/lib/auth-client"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { FieldGroup} from "@/components/ui/field"
import { Button } from "@/components/ui/button"
import { SocialButtons } from "./social-buttons"
import { SubmitButton } from "./submit-button"
import { FormField } from "@/components/form/form-field"

const schema = z.object({
  email: z.email("Enter a valid email address"),
})

type CardState = "form" | "sent" | "socialError"
type State = { cardState: CardState; errors?: { email?: string } }

const SOCIAL_ERRS = ["social", "oauth", "provider", "password not set", "no password"]
const isSocialErr = (msg: string) => SOCIAL_ERRS.some((k) => msg.toLowerCase().includes(k))

const cardCls = "w-full rounded-none rounded-b-xl border-0 bg-[#1b1815] shadow-[0_0_0_1px_rgba(255,255,255,0.07),0_24px_56px_rgba(0,0,0,0.55)]"
const titleCls = "text-[1.45rem] font-bold tracking-[-0.02em] text-zinc-100"
const descCls = "text-[#5e5549]"
const backLinkCls = "text-center text-sm text-[#5e5448] hover:text-amber-400/80 transition-colors"

export function ForgotPasswordForm() {
  const [showForm, setShowForm] = useState(false)

  async function action(_prev: State, formData: FormData): Promise<State> {
    setShowForm(false)
    const parsed = schema.safeParse({ email: formData.get("email") })
    if (!parsed.success) {
      return { cardState: "form", errors: { email: parsed.error.flatten().fieldErrors.email?.[0] } }
    }
    const { error } = await requestPasswordReset({ email: parsed.data.email, redirectTo: "/reset-password" })
    if (error) {
      if (isSocialErr(error.message ?? "")) return { cardState: "socialError" }
      toast.error(error.message ?? "Something went wrong")
      return { cardState: "form" }
    }
    return { cardState: "sent" }
  }

  const [state, formAction, isPending] = useActionState(action, { cardState: "form" })

  const cardState = showForm ? "form" : state.cardState

  if (cardState === "sent") {
    return (
      <Card className={cardCls}>
        <CardHeader className="px-8 pt-8 pb-2">
          <div className="mb-3 flex size-10 items-center justify-center rounded-full bg-amber-500/10 text-amber-400">
            <svg viewBox="0 0 24 24" className="size-5 fill-none stroke-current stroke-[1.5]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
          </div>
          <CardTitle className={titleCls} style={{ fontFamily: "var(--font-syne)" }}>
            Check your email
          </CardTitle>
          <CardDescription className={descCls}>
            We sent a reset link. It expires in 1 hour.
          </CardDescription>
        </CardHeader>
        <CardFooter className="border-0 bg-transparent px-8 pb-8">
          <Link href={"/login" as Route} className={backLinkCls}>← Back to sign in</Link>
        </CardFooter>
      </Card>
    )
  }

  if (cardState === "socialError") {
    return (
      <Card className={cardCls}>
        <CardHeader className="px-8 pt-8 pb-2">
          <CardTitle className={titleCls} style={{ fontFamily: "var(--font-syne)" }}>
            Social account detected
          </CardTitle>
          <CardDescription className={descCls}>
            This email is linked to a social account — no password was set. Sign in with the provider you used originally.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-8 pt-3 pb-2">
          <SocialButtons />
        </CardContent>
        <CardFooter className="border-0 bg-transparent px-8 pb-8">
          <Button
            variant="ghost"
            className="w-full border border-white/[0.08] text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.04] rounded-xl"
            onClick={() => setShowForm(true)}
            disabled={isPending}
          >
            Try a different email
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className={cardCls}>
      <CardHeader className="px-8 pt-8 pb-2">
        <CardTitle className={titleCls} style={{ fontFamily: "var(--font-syne)" }}>
          Reset password
        </CardTitle>
        <CardDescription className={descCls}>
          Enter your email and we&apos;ll send a reset link
        </CardDescription>
      </CardHeader>

      <form action={formAction}>
        <CardContent className="px-8 pt-5 pb-2">
          <FieldGroup>
            <FormField 
              htmlFor="email"
              label="Email"
              name="email"
              type="email"
              autocomplete="email"
              placeholder="you@example.com"
              state={state}
            />
          </FieldGroup>
        </CardContent>

        <CardFooter className="mt-2 flex-col gap-4 border-0 bg-transparent px-8 pb-8">
          <SubmitButton label="Send reset link" pendingLabel="Sending…" />
          <Link href={"/login" as Route} className={backLinkCls}>← Back to sign in</Link>
        </CardFooter>
      </form>
    </Card>
  )
}
