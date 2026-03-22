import {
  defaultShouldDehydrateQuery,
  QueryClient,
} from "@tanstack/react-query"

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Prevent immediate refetch on client after SSR hydration
        staleTime: 30 * 1000,
      },
      dehydrate: {
        // Include pending queries so streaming SSR works correctly
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === "pending",
      },
    },
  })
}
