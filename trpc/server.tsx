import "server-only"

import { createTRPCOptionsProxy, type TRPCQueryOptions } from "@trpc/tanstack-react-query"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { headers } from "next/headers"
import { cache } from "react"
import { makeQueryClient } from "./query-client"
import { appRouter } from "./routers/_app"
import { createTRPCContext } from "./init"

// Stable per-request query client — same instance throughout one RSC render
export const getQueryClient = cache(makeQueryClient)

export const trpc = createTRPCOptionsProxy({
  // Use the shared context builder so proxy and caller stay consistent
  ctx: async () => createTRPCContext({ headers: await headers() }),
  router: appRouter,
  queryClient: getQueryClient,
})

// Convenience wrapper: dehydrates the query client into a HydrationBoundary
export function HydrateClient(props: { children: React.ReactNode }) {
  const queryClient = getQueryClient()
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {props.children}
    </HydrationBoundary>
  )
}

// Convenience helper: prefetch a single query or infinite query
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- TRPCQueryOptions requires `any`; no narrower type is available in tRPC v11
export function prefetch<T extends ReturnType<TRPCQueryOptions<any>>>(
  queryOptions: T,
) {
  const queryClient = getQueryClient()
  if (queryOptions.queryKey[1]?.type === "infinite") {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- tRPC v11 infinite query options types require this cast
    void queryClient.prefetchInfiniteQuery(queryOptions as any)
  } else {
    void queryClient.prefetchQuery(queryOptions)
  }
}

// Server-side caller — uses real request headers so auth/cookies are available
export const caller = appRouter.createCaller(async () => {
  const h = await headers()
  return createTRPCContext({ headers: h })
})
