import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { lastLoginMethod } from "better-auth/plugins"
import { BetterAuthEnvSchema } from "@/lib/env"
import prisma from "@/lib/db"
import { sendResetPasswordEmail } from "@/lib/email"

const authEnv = BetterAuthEnvSchema.parse(process.env)

export const auth = betterAuth({
  baseURL: authEnv.BETTER_AUTH_URL,
  secret: authEnv.BETTER_AUTH_SECRET,
  trustedOrigins: [authEnv.BETTER_AUTH_URL, "http://localhost:3000"],
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    async sendResetPassword({ user, url }) {
      await sendResetPasswordEmail({ to: user.email, name: user.name, url })
    },
  },
  plugins: [lastLoginMethod()],
  socialProviders: {
    google: {
      clientId: authEnv.GOOGLE_CLIENT_ID,
      clientSecret: authEnv.GOOGLE_CLIENT_SECRET,
    },
    github: {
      clientId: authEnv.GITHUB_CLIENT_ID,
      clientSecret: authEnv.GITHUB_CLIENT_SECRET,
    },
  },
})
