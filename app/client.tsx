"use client"

import { useRouter } from "next/navigation"
import type { Route } from "next"
import { Button } from "@/components/ui/button"
import { signOut } from "@/lib/auth-client"
import { useTRPC } from "@/trpc/client"
import { useSuspenseQuery } from "@tanstack/react-query"

export default function Client() {
  const router = useRouter()
  const trpc = useTRPC()
  const { data } = useSuspenseQuery(trpc.getUsers.queryOptions())

  async function handleSignOut() {
    await signOut()
    router.push("/login" as Route)
  }

  return (
    <div>
      <pre>{JSON.stringify(data.users, null, 2)}</pre>
      <Button variant="destructive" onClick={handleSignOut}>
        Sign Out
      </Button>
    </div>
  )
}
