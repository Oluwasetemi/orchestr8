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
import { FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { SubmitButton } from "./submit-button"
import { useResetPassword } from "../../../hooks/useResetPassword"
import { FormField } from "../../../components/form/form-field"


export function ResetPasswordForm({ token }: { token: string }) {

  const {state, formAction} = useResetPassword()

  if (!token) {
    return (
      <p>
        Your reset link is invalid or expired. 
        <Link href="/forgot-password">Request a new one</Link>
      </p>
    )
  }

  return (
    <Card className="w-full rounded-none rounded-b-xl border-0 bg-[#1b1815] shadow-[0_0_0_1px_rgba(255,255,255,0.07),0_24px_56px_rgba(0,0,0,0.55)]">
      <CardHeader className="px-8 pt-8 pb-2">
        <CardTitle
          className="text-[1.45rem] font-bold tracking-[-0.02em] text-zinc-100"
          style={{ fontFamily: "var(--font-syne)" }}
        >
          Set new password
        </CardTitle>
        <CardDescription className="text-[#5e5549]">
          Must be at least 8 characters
        </CardDescription>
      </CardHeader>

      <form action={formAction}>
        <CardContent className="px-8 pt-5 pb-2">
          <FieldGroup className="gap-5">
            <FormField 
              htmlFor="password"
              label="New Password"
              name="password"
              type="password"
              autocomplete="new-password"
              placeholder="••••••••"
              state={state}
            />

            <Input name="token" type="hidden" value={token} />

            <FormField 
              htmlFor="confirm"
              label="Confirm Password"
              name="confirm"
              type="password"
              autocomplete="new-password"
              placeholder="••••••••"
              state={state}
            />
          </FieldGroup>
        </CardContent>

        <CardFooter className="mt-2 flex-col gap-4 border-0 bg-transparent px-8 pb-8">
          <SubmitButton label="Update password" pendingLabel="Updating…" />
          <Link
            href={"/login" as Route}
            className="text-center text-sm text-[#5e5448] hover:text-amber-400/80 transition-colors"
          >
            ← Back to sign in
          </Link>
        </CardFooter>
      </form>
    </Card>
  )
}
