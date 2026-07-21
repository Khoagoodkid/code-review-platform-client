"use client";

import { useEffect, useRef } from "react";
import type { PullRequestFile } from "@/lib/api/pr";
import { findPatchLineIndex, parsePatchLines } from "@/lib/patch/line-map";

type FilePatchViewProps = {
  file: PullRequestFile | null;
  highlightedLine?: number | null;
  highlightSeverity?: string | null;
};

const highlightBySeverity = {
  high: "ring-2 ring-red-400/80 bg-red-500/25 animate-pulse",
  medium: "ring-2 ring-amber-400/80 bg-amber-500/20",
  low: "ring-2 ring-sky-400/80 bg-sky-500/20",
};

function getHighlightClass(severity: string | null | undefined) {
  const normalized = severity?.toLowerCase();
  if (normalized === "high") return highlightBySeverity.high;
  if (normalized === "medium") return highlightBySeverity.medium;
  if (normalized === "low") return highlightBySeverity.low;
  return "ring-2 ring-indigo-400/80 bg-indigo-500/20";
}

type PatchLineProps = {
  content: string;
  lineNumber: number | null;
  isHighlighted: boolean;
  highlightSeverity?: string | null;
};

function PatchLine({
  content,
  lineNumber,
  isHighlighted,
  highlightSeverity,
}: PatchLineProps) {
  let className = "text-zinc-300";

  if (content.startsWith("+++") || content.startsWith("---")) {
    className = "text-sky-300";
  } else if (content.startsWith("@@")) {
    className = "text-indigo-300";
  } else if (content.startsWith("+")) {
    className = "bg-emerald-500/10 text-emerald-200";
  } else if (content.startsWith("-")) {
    className = "bg-red-500/10 text-red-200";
  }

  if (isHighlighted) {
    className = `${className} ${getHighlightClass(highlightSeverity)}`;
  }

  return (
    <div
      data-patch-line={lineNumber ?? undefined}
      className={`flex px-2 py-0.5 font-mono text-xs leading-6 ${className}`}
    >
      <span className="w-10 shrink-0 select-none pr-3 text-right text-zinc-600">
        {lineNumber ?? ""}
      </span>
      <span className="min-w-0 flex-1 whitespace-pre-wrap break-all">{content}</span>
    </div>
  );
}

export function FilePatchView({
  file,
  highlightedLine = null,
  highlightSeverity = null,
}: FilePatchViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const highlightedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (highlightedRef.current) {
      highlightedRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [file?.filename, highlightedLine]);

  if (!file) {
    return (
      <div className="flex h-full items-center justify-center p-8 text-center">
        <p className="text-sm text-zinc-500">Select a file to view its changes.</p>
      </div>
    );
  }

  const parsedLines = file.patch ? parsePatchLines(file.patch) : [];
  const highlightedPatchIndex =
    file.patch && highlightedLine != null
      ? findPatchLineIndex(file.patch, highlightedLine)
      : null;

  const lineFound = highlightedLine != null && highlightedPatchIndex != null;

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-white/10 px-5 py-4">
        <p className="text-sm font-medium text-white">{file.filename}</p>
        <p className="mt-1 text-xs text-zinc-500">
          <span className="text-emerald-400">+{file.additions}</span>{" "}
          <span className="text-red-400">-{file.deletions}</span>{" "}
          <span className="text-zinc-500">({file.changes} changes)</span>
        </p>
        {highlightedLine != null && (
          <p
            className={`mt-2 text-xs ${
              lineFound ? "text-indigo-300" : "text-amber-300"
            }`}
          >
            {lineFound
              ? `Highlighting line ${highlightedLine}`
              : `Line ${highlightedLine} is not visible in this diff`}
          </p>
        )}
      </div>

      <div ref={containerRef} className="flex-1 overflow-auto bg-[#05080f] py-4">
        {parsedLines.length > 0 ? (
          parsedLines.map((line) => {
            const isHighlighted = line.index === highlightedPatchIndex;

            return (
              <div
                key={`${file.sha}-${line.index}`}
                ref={isHighlighted ? highlightedRef : undefined}
              >
                <PatchLine
                  content={line.content}
                  lineNumber={line.newLineNumber}
                  isHighlighted={isHighlighted}
                  highlightSeverity={highlightSeverity}
                />
              </div>
            );
          })
        ) : (
          <p className="px-5 text-sm text-zinc-500">No patch available for this file.</p>
        )}
      </div>
    </div>
  );
}
