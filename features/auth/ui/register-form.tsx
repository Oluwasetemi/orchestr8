"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import type { Route } from "next"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
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
import { Button } from "@/components/ui/button"
import { SocialButtons } from "./social-buttons"

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

type FormValues = z.infer<typeof schema>

export function RegisterForm() {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  async function onSubmit({ name, email, password }: FormValues) {
    const { error } = await signUp.email({ name, email, password })

    if (error) {
      const msg = error.message ?? ""
      if (msg.toLowerCase().includes("already")) {
        setError("email", { message: "An account with this email already exists" })
      } else if (msg.toLowerCase().includes("password")) {
        setError("password", { message: msg })
      } else if (msg.toLowerCase().includes("name")) {
        setError("name", { message: msg })
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

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input
                id="name"
                type="text"
                autoComplete="name"
                placeholder="Jane Smith"
                {...register("name")}
              />
              <FieldError errors={[{ message: errors.name?.message }]} />
            </Field>

            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                {...register("email")}
              />
              <FieldError errors={[{ message: errors.email?.message }]} />
            </Field>

            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                {...register("password")}
              />
              <FieldError errors={[{ message: errors.password?.message }]} />
            </Field>
          </FieldGroup>
        </CardContent>

        <CardFooter className="flex-col gap-3">
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Creating account…" : "Create account"}
          </Button>
          <FieldSeparator>or</FieldSeparator>
          <SocialButtons />
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
