import type { PullRequestFile } from "@/lib/api/pr";

type FileListProps = {
  files: PullRequestFile[];
  selectedFilename: string | null;
  onSelect: (filename: string) => void;
};

function statusColor(status: string) {
  const normalized = status.toLowerCase();

  if (normalized === "added") return "text-emerald-300";
  if (normalized === "removed") return "text-red-300";
  if (normalized === "modified") return "text-amber-300";
  return "text-zinc-300";
}

export function FileList({ files, selectedFilename, onSelect }: FileListProps) {
  return (
    <ul className="flex flex-col gap-1 p-2">
      {files.map((file) => {
        const isSelected = file.filename === selectedFilename;

        return (
          <li key={file.sha}>
            <button
              type="button"
              onClick={() => onSelect(file.filename)}
              className={`w-full rounded-xl border px-3 py-3 text-left transition ${
                isSelected
                  ? "border-indigo-500/40 bg-indigo-500/10"
                  : "border-transparent bg-transparent hover:border-white/10 hover:bg-white/[0.03]"
              }`}
            >
              <p className="truncate text-sm font-medium text-white">{file.filename}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                <span className={`font-medium capitalize ${statusColor(file.status)}`}>
                  {file.status}
                </span>
                <span className="text-emerald-400">+{file.additions}</span>
                <span className="text-red-400">-{file.deletions}</span>
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
