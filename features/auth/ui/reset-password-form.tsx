"use client"

import { useActionState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { Route } from "next"
import { z } from "zod/v4"
import { toast } from "sonner"
import { authClient } from "@/lib/auth-client"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { SubmitButton } from "./submit-button"

const schema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirm: z.string().min(1, "Please confirm your password"),
  })
  .refine((d) => d.password === d.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  })

type State = { errors?: { password?: string; confirm?: string } } | null

const inputCls = "h-11 px-4 rounded-xl bg-[#1f1c18] border-white/[0.09] text-zinc-100 placeholder:text-[#3d3830] focus-visible:border-amber-500/50 focus-visible:ring-2 focus-visible:ring-amber-500/10 dark:bg-[#1f1c18]"
const labelCls = "text-[10px] font-bold uppercase tracking-[0.12em] text-[#5a5248]"
const errorCls = "text-rose-400/80 text-xs"

export function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter()

  async function action(_prev: State, formData: FormData): Promise<State> {
    const parsed = schema.safeParse({
      password: formData.get("password"),
      confirm: formData.get("confirm"),
    })
    if (!parsed.success) {
      const f = z.treeifyError(parsed.error).properties!
      return { errors: { password: f.password?.errors?.[0], confirm: f.confirm?.errors?.[0] } }
    }
    const { error } = await authClient.resetPassword({ newPassword: parsed.data.password, token })
    if (error) {
      if (error.message?.toLowerCase().includes("token")) {
        toast.error("This reset link has expired or already been used. Request a new one.")
        return null
      }
      return { errors: { password: error.message ?? "Failed to reset password" } }
    }
    toast.success("Password updated — please sign in.")
    router.push("/login" as Route)
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
          Set new password
        </CardTitle>
        <CardDescription className="text-[#5e5549]">
          Must be at least 8 characters
        </CardDescription>
      </CardHeader>

      <form action={formAction}>
        <CardContent className="px-8 pt-5 pb-2">
          <FieldGroup className="gap-5">
            <Field>
              <FieldLabel htmlFor="password" className={labelCls}>New password</FieldLabel>
              <Input id="password" name="password" type="password" autoComplete="new-password" autoFocus placeholder="••••••••" className={inputCls} />
              <FieldError className={errorCls} errors={[{ message: state?.errors?.password }]} />
            </Field>

            <Field>
              <FieldLabel htmlFor="confirm" className={labelCls}>Confirm password</FieldLabel>
              <Input id="confirm" name="confirm" type="password" autoComplete="new-password" placeholder="••••••••" className={inputCls} />
              <FieldError className={errorCls} errors={[{ message: state?.errors?.confirm }]} />
            </Field>
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
