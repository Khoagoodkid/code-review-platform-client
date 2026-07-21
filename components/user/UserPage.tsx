"use client";

import { useEffect } from "react";
import { TopNav } from "@/components/shared/TopNav";
import { useAppStore } from "@/lib/store/app-store";
import { RepoList } from "./RepoList";

export function UserPage() {
  const {
    user,
    repos,
    addedRepos,
    loading,
    error,
    fetchAll,
  } = useAppStore();

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return (
    <div className="flex min-h-dvh w-full flex-1 flex-col bg-[#070b14] text-zinc-100">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.12),transparent_40%)]"
      />

      <TopNav />

      <main className="relative z-10 mx-auto w-full max-w-6xl flex-1 px-6 py-10 sm:px-10">
        {error ? (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-6 py-12 text-center">
            <p className="text-sm text-red-300">{error}</p>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-medium text-indigo-300">Your workspace</p>
                <h1 className="mt-1 text-3xl font-semibold tracking-tight text-white">
                  {loading ? "Repositories" : `${user?.username}'s repositories`}
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
                  Repositories connected to the platform. AI reviews run on open pull
                  requests in each repo.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-zinc-400">
                {loading ? (
                  <span className="inline-block h-4 w-24 animate-pulse rounded bg-white/10" />
                ) : (
                  <>
                    <span className="font-medium text-emerald-300">
                      {addedRepos.length}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium text-white">{repos.length}</span>{" "}
                    connected
                  </>
                )}
              </div>
            </div>

            <section className="mt-8">
              <RepoList repos={repos} loading={loading} />
            </section>
          </>
        )}
      </main>
    </div>
  );
}
