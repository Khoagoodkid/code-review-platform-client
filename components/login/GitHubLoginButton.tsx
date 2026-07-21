"use client";

import { useState } from "react";
import { GitHubLogoIcon } from "@radix-ui/react-icons";

export function GitHubLoginButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin() {
    try {
      setLoading(true);
      setError(null);
      const url = process.env.NEXT_PUBLIC_BASE_API_URL + "/login";
      window.location.href = url;
    } catch {
      setError("Failed to start GitHub login. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={handleLogin}
        disabled={loading}
        className="group relative flex h-12 w-full items-center justify-center gap-3 overflow-hidden rounded-xl border border-white/10 bg-white text-sm font-medium text-zinc-950 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-70"
      >
        <span
          aria-hidden
          className="absolute inset-0 translate-y-full bg-zinc-200 transition-transform duration-300 group-hover:translate-y-0 group-disabled:translate-y-full"
        />
        <span className="relative flex items-center gap-3">
          {loading ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900" />
          ) : (
            <GitHubLogoIcon className="h-5 w-5" />
          )}
          {loading ? "Redirecting to GitHub..." : "Continue with GitHub"}
        </span>
      </button>

      {error && (
        <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-center text-sm text-red-300">
          {error}
        </p>
      )}
    </div>
  );
}
