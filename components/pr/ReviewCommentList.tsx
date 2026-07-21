import { Badge } from "@radix-ui/themes";
import type { ReviewComment } from "@/lib/api/pr";

type ReviewCommentItemProps = {
  comment: ReviewComment;
  active?: boolean;
  onClick?: () => void;
};

const severityStyles = {
  high: {
    border: "border-red-500/40",
    background: "bg-red-500/[0.08]",
    active: "ring-2 ring-red-400/60",
    badge: "red" as const,
    label: "text-red-300",
  },
  medium: {
    border: "border-amber-500/40",
    background: "bg-amber-500/[0.08]",
    active: "ring-2 ring-amber-400/60",
    badge: "amber" as const,
    label: "text-amber-300",
  },
  low: {
    border: "border-sky-500/40",
    background: "bg-sky-500/[0.08]",
    active: "ring-2 ring-sky-400/60",
    badge: "blue" as const,
    label: "text-sky-300",
  },
};

const colors = {
  red: "red",
  amber: "amber",
  sky: "sky",
  blue: "blue",
  purple: "purple",
  orange: "orange",
  gray: "gray",
};

const categoryColors: Record<string, keyof typeof colors> = {
  security: "red",
  logic: "amber",
  race_condition: "orange",
  edge_case: "purple",
  testing: "blue",
};

function getSeverityStyle(severity: string) {
  const normalized = severity.toLowerCase();

  if (normalized === "high") return severityStyles.high;
  if (normalized === "medium") return severityStyles.medium;
  if (normalized === "low") return severityStyles.low;

  return severityStyles.medium;
}

function getCategoryColor(category: string) {
  return categoryColors[category.toLowerCase()] ?? "gray";
}

function formatCategory(category: string) {
  return category.replace(/_/g, " ");
}

export function ReviewCommentItem({
  comment,
  active = false,
  onClick,
}: ReviewCommentItemProps) {
  const style = getSeverityStyle(comment.severity);

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full cursor-pointer rounded-xl border p-3 text-left transition hover:brightness-110 ${style.border} ${style.background} ${active ? style.active : ""}`}
    >
      <div className="flex flex-wrap items-center gap-2">
        <Badge color={style.badge} variant="soft" radius="full">
          {comment.severity}
        </Badge>
        <Badge color={getCategoryColor(comment.category)} variant="outline" radius="full">
          {formatCategory(comment.category)}
        </Badge>
        <span className={`text-xs font-medium ${style.label}`}>Line {comment.line}</span>
      </div>

      <p className="mt-2 truncate text-xs text-zinc-500">{comment.filename}</p>
      <p className="mt-2 text-sm leading-6 text-zinc-200">{comment.comment}</p>
    </button>
  );
}

type ReviewCommentListProps = {
  comments: ReviewComment[];
  activeCommentKey?: string | null;
  onCommentClick?: (comment: ReviewComment) => void;
};

function getCommentKey(comment: ReviewComment) {
  return `${comment.filename}:${comment.line}:${comment.category}:${comment.comment}`;
}

export function ReviewCommentList({
  comments,
  activeCommentKey = null,
  onCommentClick,
}: ReviewCommentListProps) {
  if (comments.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center text-center">
        <p className="text-sm text-zinc-500">No review comments returned.</p>
      </div>
    );
  }

  const sorted = [...comments].sort((a, b) => {
    const severityOrder = { high: 0, medium: 1, low: 2 };
    const aOrder =
      severityOrder[a.severity.toLowerCase() as keyof typeof severityOrder] ?? 3;
    const bOrder =
      severityOrder[b.severity.toLowerCase() as keyof typeof severityOrder] ?? 3;

    if (aOrder !== bOrder) {
      return aOrder - bOrder;
    }

    if (a.filename !== b.filename) {
      return a.filename.localeCompare(b.filename);
    }

    return a.line - b.line;
  });

  return (
    <div className="flex flex-1 flex-col gap-3 overflow-auto pr-1">
      {sorted.map((comment) => {
        const key = getCommentKey(comment);

        return (
          <ReviewCommentItem
            key={key}
            comment={comment}
            active={activeCommentKey === key}
            onClick={() => onCommentClick?.(comment)}
          />
        );
      })}
    </div>
  );
}
