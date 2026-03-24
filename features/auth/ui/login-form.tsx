"use client"

import { useActionState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { Route } from "next"
import { z } from "zod/v4"
import { toast } from "sonner"
import { signIn } from "@/lib/auth-client"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { SocialButtons } from "./social-buttons"
import { LastUsedBanner } from "./last-used-banner"
import { useLastUsedAuth } from "../hooks/use-last-used-auth"
import { SubmitButton } from "./submit-button"

const schema = z.object({
  email: z.email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
})

type State = { errors?: { email?: string; password?: string } } | null

export function LoginForm() {
  const router = useRouter()
  const { lastUsed } = useLastUsedAuth()

  async function action(_prev: State, formData: FormData): Promise<State> {
    const parsed = schema.safeParse({
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
    router.push("/" as Route)
    return null
  }

  const [state, formAction] = useActionState(action, null)

  return (
    <Card className="w-full rounded-none rounded-b-xl border-0 bg-[#1b1815] shadow-[0_0_0_1px_rgba(255,255,255,0.07),0_24px_56px_rgba(0,0,0,0.55)]">
      <CardHeader className="px-8 pt-8 pb-2">
        <CardTitle
          className="text-[1.45rem] font-bold tracking-[-0.02em] text-zinc-100"
          style={{ fontFamily: "var(--font-syne)" }}
        >
          Welcome back
        </CardTitle>
        <CardDescription className="text-[#5e5549]">
          Sign in to your account to continue
        </CardDescription>
      </CardHeader>

      <form action={formAction}>
        <CardContent className="px-8 pt-5 pb-2">
          {lastUsed && (
            <div className="mb-5">
              <LastUsedBanner lastUsed={lastUsed} />
            </div>
          )}

          <FieldGroup className="gap-5">
            <Field>
              <FieldLabel
                htmlFor="email"
                className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#5a5248]"
              >
                Email
              </FieldLabel>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                className="h-11 px-4 rounded-xl bg-[#1f1c18] border-white/[0.09] text-zinc-100 placeholder:text-[#3d3830] focus-visible:border-amber-500/50 focus-visible:ring-2 focus-visible:ring-amber-500/10 dark:bg-[#1f1c18]"
              />
              <FieldError className="text-rose-400/80 text-xs" errors={[{ message: state?.errors?.email }]} />
            </Field>

            <Field>
              <div className="flex items-center justify-between">
                <FieldLabel
                  htmlFor="password"
                  className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#5a5248]"
                >
                  Password
                </FieldLabel>
                <Link
                  href={"/forgot-password" as Route}
                  className="text-[10px] tracking-wide text-[#5e5448] hover:text-amber-400/80 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                className="h-11 px-4 rounded-xl bg-[#1f1c18] border-white/[0.09] text-zinc-100 placeholder:text-[#3d3830] focus-visible:border-amber-500/50 focus-visible:ring-2 focus-visible:ring-amber-500/10 dark:bg-[#1f1c18]"
              />
              <FieldError className="text-rose-400/80 text-xs" errors={[{ message: state?.errors?.password }]} />
            </Field>
          </FieldGroup>
        </CardContent>

        <CardFooter className="mt-2 flex-col gap-4 border-0 bg-transparent px-8 pb-8">
          <SubmitButton label="Sign in" pendingLabel="Signing in…" />
          <FieldSeparator className="[&_[data-slot=field-separator-content]]:bg-[#1b1815] [&_[data-slot=field-separator-content]]:text-[#3e3830] text-[10px] uppercase tracking-widest">
            or
          </FieldSeparator>
          <SocialButtons />
          <p className="text-center text-sm text-[#4a4238]">
            No account?{" "}
            <Link
              href={"/register" as Route}
              className="text-amber-400/60 hover:text-amber-400/90 transition-colors"
            >
              Sign up
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}
