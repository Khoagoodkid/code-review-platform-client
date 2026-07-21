import { api } from "./axios";

export type PullRequest = {
  id: string;
  repo_name: string;
  user_id: string;
  number: number;
  status: string;
  title: string;
  body: string | null;
  url: string;
  pr_id: string;
  created_at: string;
};

export type ReviewComment = {
  filename: string;
  severity: "high" | "medium" | "low" | string;
  line: number;
  category:
    | "logic"
    | "security"
    | "race_condition"
    | "edge_case"
    | "testing"
    | string;
  comment: string;
};

export type ReviewResult = {
  issues: ReviewComment[];
  risk_label: "high" | "low" | string;
  risk_score: number;
  review_trace_id: string;
  total_files_changed: number;
  total_lines_added: number;
  total_lines_deleted: number;
  total_delta: number;
  max_delta: number;
  avg_delta: number;
  changed_func_count: number;
  high_delta_count: number;
};

export type ReviewFeedbackPayload = {
  total_files_changed: number;
  total_lines_added: number;
  total_lines_deleted: number;
  total_delta: number;
  max_delta: number;
  avg_delta: number;
  changed_func_count: number;
  high_delta_count: number;
  risk_label: string;
  review_trace_id: string;
  feedback: 0 | 1;
};

export type PullRequestDetail = PullRequest & {
  review: ReviewResult | null;
  is_already_feedback: boolean;
};

function isReviewComment(value: unknown): value is ReviewComment {
  if (!value || typeof value !== "object") {
    return false;
  }

  const record = value as Record<string, unknown>;
  return (
    typeof record.filename === "string" &&
    typeof record.severity === "string" &&
    typeof record.line === "number" &&
    typeof record.category === "string" &&
    typeof record.comment === "string"
  );
}

function toNumber(value: unknown, fallback = 0) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function toString(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function toBoolean(value: unknown, fallback = false) {
  return typeof value === "boolean" ? value : fallback;
}

export function parseReviewResult(data: unknown): ReviewResult | null {
  if (!data || typeof data !== "object") {
    return null;
  }

  const record = data as Record<string, unknown>;

  if (Array.isArray(record.issues)) {
    return {
      issues: record.issues.filter(isReviewComment),
      risk_label: toString(record.risk_label, "low"),
      risk_score: toNumber(record.risk_score),
      review_trace_id: toString(record.review_trace_id),
      total_files_changed: toNumber(record.total_files_changed),
      total_lines_added: toNumber(record.total_lines_added),
      total_lines_deleted: toNumber(record.total_lines_deleted),
      total_delta: toNumber(record.total_delta),
      max_delta: toNumber(record.max_delta),
      avg_delta: toNumber(record.avg_delta),
      changed_func_count: toNumber(record.changed_func_count),
      high_delta_count: toNumber(record.high_delta_count),
    };
  }

  if (Array.isArray(data)) {
    return {
      issues: data.filter(isReviewComment),
      risk_label: "low",
      risk_score: 0,
      review_trace_id: "",
      total_files_changed: 0,
      total_lines_added: 0,
      total_lines_deleted: 0,
      total_delta: 0,
      max_delta: 0,
      avg_delta: 0,
      changed_func_count: 0,
      high_delta_count: 0,
    };
  }

  const nested = record.review ?? record.comments ?? record.items;
  if (nested) {
    return parseReviewResult(nested);
  }

  return null;
}

export async function getPrDetails(
  repoName: string,
  pullNumber: number,
): Promise<PullRequestDetail> {
  const { data } = await api.get<
    PullRequest & { review?: unknown; is_already_feedback?: unknown }
  >(`/pr/${encodeURIComponent(repoName)}/${pullNumber}`);

  return {
    ...data,
    review: data.review ? parseReviewResult(data.review) : null,
    is_already_feedback: toBoolean(data.is_already_feedback),
  };
}

export type GetPullRequestsParams = {
  repo_name: string;
};

export async function getPullRequests(repoName: string): Promise<PullRequest[]> {
  const params: GetPullRequestsParams = { repo_name: repoName };
  const { data } = await api.get<PullRequest[]>("/pr", { params });
  return data;
}

export type PullRequestFile = {
  sha: string;
  filename: string;
  status: string;
  additions: number;
  deletions: number;
  changes: number;
  blob_url: string;
  raw_url: string;
  contents_url: string;
  patch: string;
};

export type GetPullRequestFilesParams = {
  repo_name: string;
  pull_number: number;
};

export async function getPullRequestFiles(
  repoName: string,
  pullNumber: number,
): Promise<PullRequestFile[]> {
  const params: GetPullRequestFilesParams = {
    repo_name: repoName,
    pull_number: pullNumber,
  };
  const { data } = await api.get<PullRequestFile[]>("/pr/files", { params });
  return data;
}

export type GetPullRequestReviewParams = {
  repo_name: string;
  pull_number: number;
};

export async function getPullRequestReview(
  repoName: string,
  pullNumber: number,
): Promise<ReviewResult> {
  const params: GetPullRequestReviewParams = {
    repo_name: repoName,
    pull_number: pullNumber,
  };
  const { data } = await api.get<unknown>("/pr/review", { params });
  return (
    parseReviewResult(data) ?? {
      issues: [],
      risk_label: "low",
      risk_score: 0,
      review_trace_id: "",
      total_files_changed: 0,
      total_lines_added: 0,
      total_lines_deleted: 0,
      total_delta: 0,
      max_delta: 0,
      avg_delta: 0,
      changed_func_count: 0,
      high_delta_count: 0,
    }
  );
}

export async function submitReviewFeedback(
  payload: ReviewFeedbackPayload,
): Promise<void> {
  await api.post("/review-feedback", payload);
}

export type MergePullRequestPayload = {
  repo_name: string;
  pull_number: number;
};

export async function mergePullRequest(
  payload: MergePullRequestPayload,
): Promise<void> {
  await api.post("/pr/merge", payload);
}
