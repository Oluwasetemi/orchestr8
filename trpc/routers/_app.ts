import { z } from "zod/v4"
import { createTRPCRouter, publicProcedure } from "../init"
import prisma from "@/lib/db"

export const appRouter = createTRPCRouter({
  getUsers: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(20),
        cursor: z.number().optional(), // last seen id
      }).optional(),
    )
    .query(async ({ input }) => {
      const limit = input?.limit ?? 20
      const cursor = input?.cursor

      const users = await prisma.user.findMany({
        take: limit + 1, // fetch one extra to determine if there is a next page
        cursor: cursor ? { id: cursor } : undefined,
        skip: cursor ? 1 : 0,
        orderBy: { id: "asc" },
      })

      const nextCursor = users.length > limit ? users.pop()!.id : undefined

      return { users, nextCursor }
    }),
})

export type AppRouter = typeof appRouter
