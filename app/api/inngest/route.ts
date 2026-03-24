import { serve } from "inngest/next"
import { inngest } from "@/inngest/client"
import { helloWorld } from "@/inngest/functions"

// Inngest communicates with this endpoint:
// - GET  → syncs function definitions with the Dev Server / Cloud
// - POST → invokes a function (Inngest calls this when an event fires)
// - PUT  → used during deployment to register functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    helloWorld,
    // add new functions here
  ],
})
