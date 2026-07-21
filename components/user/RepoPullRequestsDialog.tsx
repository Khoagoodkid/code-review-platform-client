"use client";

import { useEffect, useState } from "react";
import { Dialog, Flex } from "@radix-ui/themes";
import { getPullRequests, type PullRequest } from "@/lib/api/pr";
import { PullRequestItem } from "./PullRequestItem";

type RepoPullRequestsDialogProps = {
  repoName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function RepoPullRequestsDialog({
  repoName,
  open,
  onOpenChange,
}: RepoPullRequestsDialogProps) {
  const [pullRequests, setPullRequests] = useState<PullRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    setLoading(true);
    setError(null);

    getPullRequests(repoName)
      .then(setPullRequests)
      .catch(() => setError("Failed to load pull requests."))
      .finally(() => setLoading(false));
  }, [open, repoName]);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content
        maxWidth="560px"
        className="relative overflow-hidden border border-white/10 bg-[#070b14] p-6 text-zinc-100 shadow-[0_24px_80px_rgba(0,0,0,0.55)]"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.14),transparent_45%)]"
        />

        <div className="relative z-10">
          <p className="text-sm font-medium text-indigo-300">Repository</p>
          <Dialog.Title className="mt-1 text-xl font-semibold tracking-tight text-white">
            Pull requests
          </Dialog.Title>
          <Dialog.Description className="mt-2 text-sm leading-6 text-zinc-400">
            Pull requests tracked for{" "}
            <span className="font-medium text-white">{repoName}</span>.
          </Dialog.Description>

          <div className="mt-6">
            {loading ? (
              <Flex direction="column" gap="3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-24 animate-pulse rounded-2xl border border-white/10 bg-white/[0.03]"
                  />
                ))}
              </Flex>
            ) : error ? (
              <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-6 py-8 text-center">
                <p className="text-sm text-red-300">{error}</p>
              </div>
            ) : pullRequests.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-6 py-10 text-center">
                <p className="text-sm font-medium text-zinc-200">No pull requests yet</p>
                <p className="mt-2 text-sm text-zinc-500">
                  Open a pull request on this repository to start AI-assisted reviews.
                </p>
              </div>
            ) : (
              <Flex
                direction="column"
                gap="3"
                maxHeight="420px"
                className="pr-1"
                style={{ overflowY: "auto" }}
              >
                {pullRequests.map((pr) => (
                  <PullRequestItem key={pr.id} pr={pr} />
                ))}
              </Flex>
            )}
          </div>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
}
