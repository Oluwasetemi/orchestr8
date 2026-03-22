// import { z } from "zod/v4"
import { createTRPCRouter, publicProcedure } from "../init"
import prisma from "@/lib/db"

export const appRouter = createTRPCRouter({
  getUsers: publicProcedure
    .query(() => {
      return prisma.user.findMany()
    }),
})

export type AppRouter = typeof appRouter
