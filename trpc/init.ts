import { auth } from "@/lib/auth"
import { initTRPC, TRPCError } from "@trpc/server"
import { headers } from "next/headers"

export const createTRPCContext = async (opts: { headers: Headers }) => {
  return { headers: opts.headers }
}

const t = initTRPC
  .context<Awaited<ReturnType<typeof createTRPCContext>>>()
  .create()

export const createTRPCRouter = t.router
export const publicProcedure = t.procedure
export const protectedProcedure = publicProcedure.use(async ({ ctx, next }) => {
  const session = await auth.api.getSession({
    headers: await headers()
  })
  
  if (!session) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Unauthorized"
    })
  }
  
  return next({ ctx: {...ctx, auth: session }})
})

