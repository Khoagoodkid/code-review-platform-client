import type { Repository } from "@/lib/api/repos";
import { RepoCard } from "./RepoCard";

type RepoListProps = {
  repos: Repository[];
  loading?: boolean;
};

export function RepoList({ repos, loading = false }: RepoListProps) {
  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-40 animate-pulse rounded-2xl border border-white/10 bg-white/[0.03]"
          />
        ))}
      </div>
    );
  }

  if (repos.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-6 py-12 text-center">
        <p className="text-sm font-medium text-zinc-200">No repositories found</p>
        <p className="mt-2 text-sm text-zinc-500">
          Your GitHub repositories will appear here once available.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {repos.map((repo) => (
        <RepoCard key={repo.id} repo={repo} />
      ))}
    </div>
  );
}
