"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowLeftIcon, MagicWandIcon, ReloadIcon } from "@radix-ui/react-icons";
import { Badge } from "@radix-ui/themes";
import { TopNav } from "@/components/shared/TopNav";
import { Button } from "@/components/shared/Button";
import { NotificationModal } from "@/components/shared/NotificationModal";
import {
  getPrDetails,
  getPullRequestFiles,
  getPullRequestReview,
  type PullRequestDetail,
  type PullRequestFile,
  type ReviewComment,
  type ReviewResult,
} from "@/lib/api/pr";
import { getSocket } from "@/lib/socket/socket";
import { useAppStore } from "@/lib/store/app-store";
import { FileList } from "./FileList";
import { FilePatchView } from "./FilePatchView";
import { ReviewPanel } from "./ReviewPanel";

type PrUpdatePayload = {
  repo_name: string;
  pull_number: number;
};

export function PrFilesPage() {
  const searchParams = useSearchParams();
  const { fetchAll } = useAppStore();

  const repoName = searchParams.get("repo_name") ?? "";
  const pullNumber = Number(searchParams.get("pull_number"));

  const [prDetail, setPrDetail] = useState<PullRequestDetail | null>(null);
  const [files, setFiles] = useState<PullRequestFile[]>([]);
  const [selectedFilename, setSelectedFilename] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [review, setReview] = useState<ReviewResult | null>(null);

  const [updateNoticeOpen, setUpdateNoticeOpen] = useState(false);
  const [activeCommentKey, setActiveCommentKey] = useState<string | null>(null);
  const [highlightedLine, setHighlightedLine] = useState<number | null>(null);
  const [highlightSeverity, setHighlightSeverity] = useState<string | null>(null);

  function getCommentKey(comment: ReviewComment) {
    return `${comment.filename}:${comment.line}:${comment.category}:${comment.comment}`;
  }

  function handleCommentClick(comment: ReviewComment) {
    setSelectedFilename(comment.filename);
    setActiveCommentKey(getCommentKey(comment));
    setHighlightedLine(comment.line);
    setHighlightSeverity(comment.severity);
  }

  function handleFileSelect(filename: string) {
    setSelectedFilename(filename);
    setActiveCommentKey(null);
    setHighlightedLine(null);
    setHighlightSeverity(null);
  }

  async function handleReview() {
    setReviewOpen(true);
    setReviewLoading(true);
    setReviewError(null);
    setReview(null);
    setActiveCommentKey(null);
    setHighlightedLine(null);
    setHighlightSeverity(null);

    try {
      const result = await getPullRequestReview(repoName, pullNumber);
      setReview(result);

      const updatedDetail = await getPrDetails(repoName, pullNumber);
      setPrDetail(updatedDetail);
    } catch {
      setReviewError("Failed to generate review. Please try again.");
    } finally {
      setReviewLoading(false);
    }
  }

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  useEffect(() => {
    if (!repoName || Number.isNaN(pullNumber)) {
      return;
    }

    const socket = getSocket();

    function handlePrUpdate(payload: PrUpdatePayload) {
      const isSameRepo = payload?.repo_name === repoName;
      const isSamePr = Number(payload?.pull_number) === pullNumber;

      if (isSameRepo && isSamePr) {
        setUpdateNoticeOpen(true);
      }
    }

    socket.on("pr_update", handlePrUpdate);

    return () => {
      socket.off("pr_update", handlePrUpdate);
    };
  }, [repoName, pullNumber]);

  useEffect(() => {
    if (!repoName || Number.isNaN(pullNumber)) {
      setError("Missing repository or pull request information.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    Promise.all([
      getPrDetails(repoName, pullNumber),
      getPullRequestFiles(repoName, pullNumber),
    ])
      .then(([detail, fileList]) => {
        setPrDetail(detail);
        setFiles(fileList);
        setSelectedFilename(fileList[0]?.filename ?? null);

        if (detail.review && detail.review.issues.length > 0) {
          setReview(detail.review);
          setReviewOpen(true);
        }
      })
      .catch(() => setError("Failed to load pull request."))
      .finally(() => setLoading(false));
  }, [repoName, pullNumber]);

  const selectedFile =
    files.find((file) => file.filename === selectedFilename) ?? null;

  function statusColor(status: string) {
    const normalized = status.toLowerCase();
    if (normalized === "open") return "green" as const;
    if (normalized === "closed") return "gray" as const;
    if (normalized === "merged") return "purple" as const;
    return "blue" as const;
  }

  return (
    <div className="flex min-h-dvh w-full flex-1 flex-col bg-[#070b14] text-zinc-100">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.12),transparent_40%)]"
      />

      <TopNav />

      <main className="relative z-10 mx-auto flex w-full max-w-[1600px] flex-1 flex-col px-6 py-8 sm:px-10">
        <Link
          href="/user"
          className="mb-6 inline-flex w-fit items-center gap-2 text-sm text-zinc-400 transition hover:text-zinc-200"
        >
          <ArrowLeftIcon />
          Back to repositories
        </Link>

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-medium text-indigo-300">
                {repoName}
                {!Number.isNaN(pullNumber) ? ` · #${pullNumber}` : ""}
              </p>
              {prDetail && (
                <Badge color={statusColor(prDetail.status)} variant="soft" radius="full">
                  {prDetail.status}
                </Badge>
              )}
            </div>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              {prDetail?.title ?? "Pull request"}
            </h1>
            {prDetail?.body && (
              <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-400">
                {prDetail.body}
              </p>
            )}
            {prDetail?.url && (
              <Link
                href={prDetail.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-sm text-indigo-300 hover:text-indigo-200"
              >
                View on GitHub
              </Link>
            )}
          </div>

          <Button
            size="3"
            color="indigo"
            onClick={handleReview}
            disabled={reviewLoading || !repoName || Number.isNaN(pullNumber)}
          >
            <MagicWandIcon />
            {reviewLoading ? "Reviewing..." : "Review"}
          </Button>
        </div>

        {loading ? (
          <div className="flex min-h-[480px] flex-1 gap-4">
            <div className="flex-1 animate-pulse rounded-2xl border border-white/10 bg-white/[0.03]" />
            {reviewOpen && (
              <div className="hidden w-[360px] animate-pulse rounded-2xl border border-white/10 bg-white/[0.03] lg:block" />
            )}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-6 py-12 text-center">
            <p className="text-sm text-red-300">{error}</p>
          </div>
        ) : files.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-6 py-12 text-center">
            <p className="text-sm font-medium text-zinc-200">No changed files</p>
            <p className="mt-2 text-sm text-zinc-500">
              This pull request does not have any file changes to display.
            </p>
          </div>
        ) : (
          <div className="flex min-h-[520px] flex-1 flex-col gap-4 lg:flex-row">
            <div className="grid min-h-[520px] flex-1 gap-4 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] lg:grid-cols-[280px_1fr]">
              <aside className="overflow-y-auto border-b border-white/10 lg:border-b-0 lg:border-r">
                <div className="border-b border-white/10 px-4 py-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                    Files changed
                  </p>
                  <p className="mt-1 text-sm text-zinc-300">{files.length} files</p>
                </div>
                <FileList
                  files={files}
                  selectedFilename={selectedFilename}
                  onSelect={handleFileSelect}
                />
              </aside>

              <section className="min-h-[320px] overflow-hidden">
                <FilePatchView
                  file={selectedFile}
                  highlightedLine={highlightedLine}
                  highlightSeverity={highlightSeverity}
                />
              </section>
            </div>

            {reviewOpen && (
              <ReviewPanel
                repoName={repoName}
                pullNumber={pullNumber}
                loading={reviewLoading}
                error={reviewError}
                review={review}
                isAlreadyFeedback={prDetail?.is_already_feedback ?? false}
                activeCommentKey={activeCommentKey}
                onCommentClick={handleCommentClick}
                onClose={() => setReviewOpen(false)}
                onRetry={handleReview}
                onFeedbackSubmitted={() =>
                  setPrDetail((prev) =>
                    prev ? { ...prev, is_already_feedback: true } : prev,
                  )
                }
              />
            )}
          </div>
        )}
      </main>

      <NotificationModal
        open={updateNoticeOpen}
        onOpenChange={setUpdateNoticeOpen}
        icon={<ReloadIcon />}
        title="This pull request was updated"
        description="New changes were detected for this pull request. Reload the page to see the latest files and review."
        confirmLabel="Reload page"
        cancelLabel="Later"
        onConfirm={() => window.location.reload()}
      />
    </div>
  );
}
