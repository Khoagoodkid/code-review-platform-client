"use client";

import { useEffect, useState } from "react";
import { Cross2Icon, MagicWandIcon, ThickArrowDownIcon, ThickArrowUpIcon } from "@radix-ui/react-icons";
import { Badge } from "@radix-ui/themes";
import { Button } from "@/components/shared/Button";
import type { ReviewComment, ReviewResult } from "@/lib/api/pr";
import { submitReviewFeedback } from "@/lib/api/pr";
import { ReviewCommentList } from "./ReviewCommentList";

type ReviewPanelProps = {
  repoName: string;
  pullNumber: number;
  loading: boolean;
  error: string | null;
  review: ReviewResult | null;
  isAlreadyFeedback?: boolean;
  activeCommentKey?: string | null;
  onCommentClick?: (comment: ReviewComment) => void;
  onClose: () => void;
  onRetry: () => void;
  onFeedbackSubmitted?: () => void;
};

function getRiskColor(riskLabel: string) {
  return riskLabel.toLowerCase() === "high" ? "red" : "green";
}

export function ReviewPanel({
  repoName,
  pullNumber,
  loading,
  error,
  review,
  isAlreadyFeedback = false,
  activeCommentKey = null,
  onCommentClick,
  onClose,
  onRetry,
  onFeedbackSubmitted,
}: ReviewPanelProps) {
  const [feedback, setFeedback] = useState<0 | 1 | null>(null);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);

  useEffect(() => {
    setFeedback(null);
    setFeedbackError(null);
  }, [review?.risk_score, review?.issues.length, review?.risk_label, review?.review_trace_id]);

  const commentCount = review?.issues.length ?? 0;

  const hasSubmittedFeedback = isAlreadyFeedback || feedback !== null;

  async function handleFeedback(value: 0 | 1) {
    if (!review || hasSubmittedFeedback) {
      return;
    }

    setFeedbackLoading(true);
    setFeedbackError(null);

    try {
      await submitReviewFeedback({
        total_files_changed: review.total_files_changed,
        total_lines_added: review.total_lines_added,
        total_lines_deleted: review.total_lines_deleted,
        total_delta: review.total_delta,
        max_delta: review.max_delta,
        avg_delta: review.avg_delta,
        changed_func_count: review.changed_func_count,
        high_delta_count: review.high_delta_count,
        risk_label: review.risk_label,
        review_trace_id: review.review_trace_id,
        feedback: value,
      });
      setFeedback(value);
      onFeedbackSubmitted?.();
    } catch {
      setFeedbackError("Failed to submit feedback. Please try again.");
    } finally {
      setFeedbackLoading(false);
    }
  }

  return (
    <aside className="flex w-full shrink-0 flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] lg:w-[360px] xl:w-[400px]">
      <div className="relative border-b border-white/10 px-4 py-4">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.12),transparent_55%)]"
        />

        <div className="relative z-10 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-indigo-300">
              <MagicWandIcon className="h-4 w-4 shrink-0" />
              <p className="text-xs font-medium uppercase tracking-wide">AI review</p>
            </div>
            <h2 className="mt-2 text-base font-semibold text-white">Code review</h2>
            <p className="mt-1 truncate text-xs text-zinc-500">
              {repoName} · #{pullNumber}
              {commentCount > 0 ? ` · ${commentCount} findings` : ""}
            </p>
          </div>

          <Button
            size="1"
            variant="ghost"
            color="gray"
            onClick={onClose}
            aria-label="Close review panel"
          >
            <Cross2Icon />
          </Button>
        </div>
      </div>

      <div className="flex flex-1 flex-col overflow-hidden p-4">
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-16 animate-pulse rounded-xl border border-white/10 bg-white/[0.03]"
              />
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
            <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-6">
              <p className="text-sm text-red-300">{error}</p>
            </div>
            <Button size="2" color="indigo" variant="soft" onClick={onRetry}>
              Try again
            </Button>
          </div>
        ) : review ? (
          <div className="flex min-h-0 flex-1 flex-col gap-4">
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                    Risk assessment
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge color={getRiskColor(review.risk_label)} variant="soft" radius="full">
                      {review.risk_label} risk
                    </Badge>
                    <span className="text-sm font-medium text-zinc-200">
                      Score {review.risk_score}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <ReviewCommentList
              comments={review.issues}
              activeCommentKey={activeCommentKey}
              onCommentClick={onCommentClick}
            />

            <div className="border-t border-white/10 pt-4">
              {hasSubmittedFeedback ? (
                <p className="text-center text-sm text-zinc-400">
                  Thanks for your feedback.
                </p>
              ) : (
                <>
                  <p className="mb-3 text-center text-sm text-zinc-400">
                    Was this review helpful?
                  </p>
                  <div className="flex gap-2">
                    <Button
                      size="2"
                      color="green"
                      variant="soft"
                      className="flex-1"
                      disabled={feedbackLoading}
                      onClick={() => handleFeedback(1)}
                    >
                      <ThickArrowUpIcon />
                      Helpful
                    </Button>
                    <Button
                      size="2"
                      color="red"
                      variant="soft"
                      className="flex-1"
                      disabled={feedbackLoading}
                      onClick={() => handleFeedback(0)}
                    >
                      <ThickArrowDownIcon />
                      Not helpful
                    </Button>
                  </div>
                  {feedbackError && (
                    <p className="mt-2 text-center text-xs text-red-400">{feedbackError}</p>
                  )}
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center text-center">
            <p className="text-sm text-zinc-500">
              Click Review to generate AI feedback for this pull request.
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
