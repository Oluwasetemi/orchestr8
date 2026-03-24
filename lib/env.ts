import { config } from "dotenv"
import { expand } from "dotenv-expand"
import path from "node:path"
import { z } from "zod/v4"

expand(
  config({
    path: path.resolve(
      process.cwd(),
      process.env.NODE_ENV === "test" ? ".env.test" : ".env",
    ),
  }),
)

// Core — always required at startup
const CoreEnvSchema = z.object({
  NODE_ENV: z.string().default("development"),
  DATABASE_URL: z.string().min(1),
})

// Better Auth — validated when auth module is imported
export const BetterAuthEnvSchema = z.object({
  BETTER_AUTH_URL: z.url(),
  BETTER_AUTH_SECRET: z.string().min(32),
  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
  GITHUB_CLIENT_ID: z.string().min(1),
  GITHUB_CLIENT_SECRET: z.string().min(1),
})

// Email — validated when email module is imported
export const EmailEnvSchema = z.object({
  RESEND_API_KEY: z.string().min(1),
})

export type CoreEnv = z.infer<typeof CoreEnvSchema>
export type BetterAuthEnv = z.infer<typeof BetterAuthEnvSchema>
export type EmailEnv = z.infer<typeof EmailEnvSchema>

const { data: coreEnv, error } = CoreEnvSchema.safeParse(process.env)

if (error) {
  console.error("❌ Invalid env:")
  console.error(JSON.stringify(z.treeifyError(error), null, 2))
  throw new Error(
    "Invalid environment variables — fix the errors above and restart",
  )
}

export default coreEnv!
