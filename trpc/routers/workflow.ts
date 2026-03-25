import { z } from "zod/v4"
import { createTRPCRouter, protectedProcedure } from "../init"
import prisma from "@/lib/db"
import { inngest } from "@/inngest/client"
import { DEFAULT_AI_QUESTION } from "@/inngest/constants"

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
      return prisma.workflow.create({
        data: { name: input.name, userId: ctx.auth.user.id },
      })
    }),

  testAI: protectedProcedure
    .input(z.object({ question: z.string().min(1).optional() }))
    .mutation(async ({ input }) => {
      await inngest.send({
        name: "workflow/execute",
        data: { question: input.question ?? DEFAULT_AI_QUESTION },
      })
      return { queued: true }
    }),
})
