"use client"

import { useActionState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { Route } from "next"
import { z } from "zod/v4"
import { toast } from "sonner"
import { signUp } from "@/lib/auth-client"
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

const schema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.email("Enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirm: z.string().min(1, "Please confirm your password"),
  })
  .refine((d) => d.password === d.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  })

type State = { errors?: { name?: string; email?: string; password?: string; confirm?: string } } | null

const inputCls = "h-11 px-4 rounded-xl bg-[#1f1c18] border-white/[0.09] text-zinc-100 placeholder:text-[#3d3830] focus-visible:border-amber-500/50 focus-visible:ring-2 focus-visible:ring-amber-500/10 dark:bg-[#1f1c18]"
const labelCls = "text-[10px] font-bold uppercase tracking-[0.12em] text-[#5a5248]"
const errorCls = "text-rose-400/80 text-xs"

export function RegisterForm() {
  const router = useRouter()
  const { lastUsed } = useLastUsedAuth()

  async function action(_prev: State, formData: FormData): Promise<State> {
    const parsed = schema.safeParse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirm: formData.get("confirm"),
    })
    if (!parsed.success) {
      const f = z.treeifyError(parsed.error).properties ?? {}
      return {
        errors: {
          name: f.name?.errors?.[0],
          email: f.email?.errors?.[0],
          password: f.password?.errors?.[0],
          confirm: f.confirm?.errors?.[0],
        },
      }
    }
    const { name, email, password } = parsed.data
    const { error } = await signUp.email({ name, email, password })
    if (error) {
      const msg = error.message ?? ""
      if (msg.toLowerCase().includes("already")) return { errors: { email: "An account with this email already exists" } }
      if (msg.toLowerCase().includes("password")) return { errors: { password: msg } }
      if (msg.toLowerCase().includes("name")) return { errors: { name: msg } }
      toast.error(msg || "Sign up failed")
      return null
    }
    toast.success("Account created! Please sign in.")
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
          Create account
        </CardTitle>
        <CardDescription className="text-[#5e5549]">
          Enter your details to get started
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
              <FieldLabel htmlFor="name" className={labelCls}>Full name</FieldLabel>
              <Input id="name" name="name" type="text" autoComplete="name" placeholder="Jane Smith" className={inputCls} />
              <FieldError className={errorCls} errors={[{ message: state?.errors?.name }]} />
            </Field>

            <Field>
              <FieldLabel htmlFor="email" className={labelCls}>Email</FieldLabel>
              <Input id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" className={inputCls} />
              <FieldError className={errorCls} errors={[{ message: state?.errors?.email }]} />
            </Field>

            <Field>
              <FieldLabel htmlFor="password" className={labelCls}>Password</FieldLabel>
              <Input id="password" name="password" type="password" autoComplete="new-password" placeholder="min. 8 characters" className={inputCls} />
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
          <SubmitButton label="Create account" pendingLabel="Creating account…" />
          <FieldSeparator className="[&_[data-slot=field-separator-content]]:bg-[#1b1815] [&_[data-slot=field-separator-content]]:text-[#3e3830] text-[10px] uppercase tracking-widest">
            or
          </FieldSeparator>
          <SocialButtons />
          <p className="text-center text-sm text-[#4a4238]">
            Already have an account?{" "}
            <Link href={"/login" as Route} className="text-amber-400/60 hover:text-amber-400/90 transition-colors">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}
