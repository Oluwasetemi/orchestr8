"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { Route } from "next"
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
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

type FieldErrors = { name?: string; email?: string; password?: string }

export function RegisterForm() {
  const router = useRouter()
  const [pending, setPending] = useState(false)
  const [errors, setErrors] = useState<FieldErrors>({})

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const name = form.get("name") as string
    const email = form.get("email") as string
    const password = form.get("password") as string

    setErrors({})
    setPending(true)

    const { error } = await signUp.email({ name, email, password })

    setPending(false)

    if (error) {
      const msg = error.message ?? ""
      if (msg.toLowerCase().includes("already")) {
        setErrors({ email: "An account with this email already exists" })
      } else if (msg.toLowerCase().includes("password")) {
        setErrors({ password: msg })
      } else if (msg.toLowerCase().includes("name")) {
        setErrors({ name: msg })
      } else {
        toast.error(msg || "Sign up failed")
      }
      return
    }

    toast.success("Account created! Please sign in.")
    router.push("/login" as Route)
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>Enter your details to get started</CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                placeholder="Jane Smith"
              />
              <FieldError errors={errors.name ? [{ message: errors.name }] : []} />
            </Field>

            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@example.com"
              />
              <FieldError errors={errors.email ? [{ message: errors.email }] : []} />
            </Field>

            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                placeholder="••••••••"
              />
              <FieldError errors={errors.password ? [{ message: errors.password }] : []} />
            </Field>
          </FieldGroup>
        </CardContent>

        <CardFooter className="flex-col gap-3">
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Creating account…" : "Create account"}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href={"/login" as Route}
              className="text-foreground underline-offset-4 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}
