
// import { caller } from "@/trpc/server";

import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import Client from "./client";

export default function Home() {
  const queryClient = getQueryClient()
  void queryClient.prefetchQuery(trpc.getUsers.queryOptions())
  // const users = await caller.getUsers()
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <HydrationBoundary state={dehydrate(queryClient)}>
          <Client />
        </HydrationBoundary>
      </main>
    </div>
  );
}
