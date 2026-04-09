"use client"

import Link from "next/link"
import type { Route } from "next"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  FieldGroup,
  FieldSeparator,
} from "@/components/ui/field"
import { SocialButtons } from "./social-buttons"
import { LastUsedBanner } from "./last-used-banner"
import { useLastUsedAuth } from "../hooks/use-last-used-auth"
import { SubmitButton } from "./submit-button"
import { useLogin } from "@/hooks/useLogin"
import { FormField } from "@/components/form/form-field"



export function LoginForm() {
  const { lastUsed } = useLastUsedAuth()
  const { state, formAction, isLoggingIn} = useLogin()

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
            <FormField
              htmlFor="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              label="Email"
              autocomplete="email"
              state={state}
            />

            <FormField 
              forgetPasswordLink
              htmlFor="password"
              label="Password"
              name="password"
              type="password"
              autocomplete="current-password"
              placeholder="••••••••"
              state={state}
            />
          </FieldGroup>
        </CardContent>

        <CardFooter className="mt-2 flex-col gap-4 border-0 bg-transparent px-8 pb-8">
          <SubmitButton label="Sign in" pendingLabel="Signing in…" />
          <FieldSeparator className="[&_[data-slot=field-separator-content]]:bg-[#1b1815] [&_[data-slot=field-separator-content]]:text-[#3e3830] text-[10px] uppercase tracking-widest">
            or
          </FieldSeparator>
          <SocialButtons isSubmitting={isLoggingIn} />
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
