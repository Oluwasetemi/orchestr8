import { z } from "zod/v4"
import { createTRPCRouter, protectedProcedure } from "../init"
import prisma from "@/lib/db"
import { inngest } from "@/inngest/client"

export const workflowRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return prisma.workflow.findMany({
      where: { userId: ctx.auth.user.id },
      orderBy: { createdAt: "desc" },
    })
  }),

  create: protectedProcedure
    .input(z.object({ name: z.string().min(1, "Name is required").max(100) }))
    .mutation(async ({ input, ctx }) => {
      await inngest.send({ name: "test/hello.world", data: { email: "user@example.com" } })
      return { success: true, message: "Job queued" }
    }),
})
