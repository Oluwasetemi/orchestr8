import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { BetterAuthEnvSchema, EmailEnvSchema } from "@/lib/env"
import prisma from "@/lib/db"
import { sendResetPasswordEmail } from "@/lib/email"

const authEnv = BetterAuthEnvSchema.parse(process.env)
const emailEnv = EmailEnvSchema.parse(process.env)

// Silence the unused warning — emailEnv is used inside sendResetPasswordEmail
void emailEnv

export const auth = betterAuth({
  baseURL: authEnv.BETTER_AUTH_URL,
  secret: authEnv.BETTER_AUTH_SECRET,
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    async sendResetPassword({ user, url }) {
      await sendResetPasswordEmail({ to: user.email, name: user.name, url })
    },
  },
})
