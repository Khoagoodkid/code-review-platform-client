"use client";

import Link from "next/link";
import { useState } from "react";
import { CheckIcon, EyeOpenIcon, PlusIcon, TrashIcon } from "@radix-ui/react-icons";
import { Avatar, Badge } from "@radix-ui/themes";
import { Button } from "@/components/shared/Button";
import type { Repository } from "@/lib/api/repos";
import { useAppStore } from "@/lib/store/app-store";
import { RepoPullRequestsDialog } from "./RepoPullRequestsDialog";

type RepoCardProps = {
  repo: Repository;
};

export function RepoCard({ repo }: RepoCardProps) {
  const { isRepoAdded, addRepo, removeRepo } = useAppStore();
  const [loading, setLoading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prDialogOpen, setPrDialogOpen] = useState(false);

  const added = isRepoAdded(repo.name);

  async function handleAdd() {
    try {
      setLoading(true);
      setError(null);
      await addRepo(repo.name);
    } catch {
      setError("Failed to add repository.");
    } finally {
      setLoading(false);
    }
  }

  async function handleRemove() {
    try {
      setRemoving(true);
      setError(null);
      await removeRepo(repo.name);
    } catch {
      setError("Failed to remove repository.");
    } finally {
      setRemoving(false);
    }
  }

  return (
    <>
      <article
        className={`rounded-2xl border p-5 transition ${
          added
            ? "border-emerald-500/40 bg-emerald-500/[0.06] shadow-[0_0_0_1px_rgba(16,185,129,0.08)]"
            : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]"
        }`}
      >
        <div className="flex items-start gap-3">
          <Avatar
            size="1"
            radius="full"
            src={repo.owner.avatar_url}
            fallback={repo.owner.login.slice(0, 2).toUpperCase()}
            className="mt-0.5 shrink-0"
          />

          <div className="min-w-0 flex-1">
            <Link
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block break-words text-base font-semibold leading-snug text-white hover:text-indigo-300"
            >
              {repo.full_name}
            </Link>
            <p className="mt-1 text-xs text-zinc-500">{repo.owner.login}</p>

            <div className="mt-2 flex flex-wrap items-center gap-2">
              {added && (
                <Badge color="green" variant="soft" radius="full">
                  <CheckIcon />
                  Connected
                </Badge>
              )}
              {repo.private && (
                <Badge color="amber" variant="soft" radius="full">
                  Private
                </Badge>
              )}
              {repo.fork && (
                <Badge color="gray" variant="soft" radius="full">
                  Fork
                </Badge>
              )}
            </div>

            <p className="mt-3 line-clamp-2 text-sm leading-6 text-zinc-400">
              {repo.description || "No description"}
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/5 pt-4">
          <div className="flex min-w-0 flex-wrap items-center gap-3 text-xs text-zinc-500">
            <span
              className={`max-w-full truncate rounded-full border px-2.5 py-1 ${
                added
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
                  : "border-white/10 bg-white/5 text-zinc-300"
              }`}
            >
              {repo.name}
            </span>
            <Link
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 text-indigo-300 hover:text-indigo-200"
            >
              View on GitHub
            </Link>
          </div>

          <div className="flex shrink-0 flex-col items-end gap-1">
            {added ? (
              <div className="flex items-center gap-2">
                <Button
                  size="2"
                  color="red"
                  variant="soft"
                  onClick={handleRemove}
                  disabled={removing}
                >
                  <TrashIcon />
                  {removing ? "Removing..." : "Remove"}
                </Button>
                <Button
                  size="2"
                  color="indigo"
                  variant="soft"
                  onClick={() => setPrDialogOpen(true)}
                >
                  <EyeOpenIcon />
                  View
                </Button>
              </div>
            ) : (
              <Button
                size="2"
                color="indigo"
                onClick={handleAdd}
                disabled={loading}
              >
                <PlusIcon />
                {loading ? "Adding..." : "Add"}
              </Button>
            )}
            {error && <p className="text-xs text-red-400">{error}</p>}
          </div>
        </div>
      </article>

      <RepoPullRequestsDialog
        repoName={repo.name}
        open={prDialogOpen}
        onOpenChange={setPrDialogOpen}
      />
    </>
  );
}
