"use client"

import { useRouter } from "next/navigation"
import type { Route } from "next"
import { Button } from "@/components/ui/button"
import { signOut } from "@/lib/auth-client"
import { useTRPC } from "@/trpc/client"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export default function Client() {
  const router = useRouter()
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const { data: workflows } = useQuery(trpc.workflow.getAll.queryOptions())

  const { mutate: createWorkflow, isPending } = useMutation(
    trpc.workflow.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.workflow.getAll.queryFilter())
        toast.success("Workflow created")
      },
      onError: (err) => toast.error(err.message),
    })
  )

  const { mutate: testAI, isPending: isTestingAI } = useMutation(
    trpc.workflow.testAI.mutationOptions({
      onSuccess: () => toast.success("AI job queued — check Inngest Dev Server at localhost:8288"),
      onError: (err) => toast.error(err.message),
    })
  )

  async function handleSignOut() {
    try {
      await signOut()
      router.push("/login" as Route)
    } catch (error) {
      console.error("Sign out failed:", error)
    }
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Workflows</h1>
        <div className="flex gap-2">
          <Button
            onClick={() => createWorkflow({ name: "New Workflow" })}
            disabled={isPending}
          >
            {isPending ? "Creating…" : "Create Workflow"}
          </Button>
          <Button
            variant="outline"
            onClick={() => testAI({})}
            disabled={isTestingAI}
          >
            {isTestingAI ? "Queuing…" : "Test AI"}
          </Button>
          <Button variant="destructive" onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>
      </div>

      {workflows?.length === 0 ? (
        <p className="text-sm text-muted-foreground">No workflows yet. Create one to get started.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {workflows?.map((w) => (
            <li key={w.id} className="rounded-lg border px-4 py-3 text-sm">
              <span className="font-medium">{w.name}</span>
              <span className="ml-3 text-xs text-muted-foreground">{w.id}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
