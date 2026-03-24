import prisma from "@/lib/db"
import { inngest } from "./client"

// Example function — triggers on "test/hello.world" event
// Replace or extend this with your actual background jobs
export const helloWorld = inngest.createFunction(
  { id: "hello-world", triggers: [{ event: "test/hello.world" }] },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s")
    await step.sleep("wait-a-moment2", "5s")
    await step.run("create workflow", () => {
      return prisma.workflow.create({
        data: {
          name: "Test Workflow",
          userId: "FuPYnu7kXTX651dClSOj6IGAPIvpZLYh"
        } 
      })
      
})
  },
)
