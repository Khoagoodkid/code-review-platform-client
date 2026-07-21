"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@radix-ui/themes";
import type { PullRequest } from "@/lib/api/pr";

type PullRequestItemProps = {
  pr: PullRequest;
};

function formatDate(isoDate: string) {
  return new Date(isoDate).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function statusColor(status: string) {
  const normalized = status.toLowerCase();

  if (normalized === "open") return "green" as const;
  if (normalized === "closed") return "gray" as const;
  if (normalized === "merged") return "purple" as const;
  return "blue" as const;
}

export function PullRequestItem({ pr }: PullRequestItemProps) {
  const router = useRouter();

  const href = `/pr?repo_name=${encodeURIComponent(pr.repo_name)}&pull_number=${pr.number}`;

  return (
    <article
      role="link"
      tabIndex={0}
      onClick={() => router.push(href)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          router.push(href);
        }
      }}
      className="cursor-pointer rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-white/20 hover:bg-white/[0.05]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-medium text-zinc-300">
              #{pr.number}
            </span>
            <Badge color={statusColor(pr.status)} variant="soft" radius="full">
              {pr.status}
            </Badge>
          </div>
          <h3 className="mt-3 text-sm font-semibold text-white">{pr.title}</h3>
          {pr.body && (
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-zinc-400">{pr.body}</p>
          )}
          <p className="mt-3 text-xs text-zinc-500">Opened {formatDate(pr.created_at)}</p>
        </div>
      </div>

      <Link
        href={pr.url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(event) => event.stopPropagation()}
        className="mt-4 inline-block text-xs font-medium text-indigo-300 hover:text-indigo-200"
      >
        View on GitHub
      </Link>
    </article>
  );
}
