export type PatchLineInfo = {
  index: number;
  content: string;
  newLineNumber: number | null;
  type: "hunk" | "addition" | "deletion" | "context" | "meta";
};

export function parsePatchLines(patch: string): PatchLineInfo[] {
  const lines = patch.split("\n");
  const result: PatchLineInfo[] = [];
  let newLine = 0;

  for (let index = 0; index < lines.length; index++) {
    const content = lines[index];

    if (content.startsWith("@@")) {
      const match = content.match(/\+(\d+)/);
      newLine = match ? Number.parseInt(match[1], 10) : newLine;
      result.push({ index, content, newLineNumber: null, type: "hunk" });
      continue;
    }

    if (content.startsWith("+++") || content.startsWith("---")) {
      result.push({ index, content, newLineNumber: null, type: "meta" });
      continue;
    }

    if (content.startsWith("+")) {
      result.push({ index, content, newLineNumber: newLine, type: "addition" });
      newLine += 1;
      continue;
    }

    if (content.startsWith("-")) {
      result.push({ index, content, newLineNumber: null, type: "deletion" });
      continue;
    }

    if (content.startsWith(" ") || content.length > 0) {
      result.push({ index, content, newLineNumber: newLine, type: "context" });
      newLine += 1;
      continue;
    }

    result.push({ index, content, newLineNumber: null, type: "meta" });
  }

  return result;
}

export function findPatchLineIndex(
  patch: string,
  targetLine: number,
): number | null {
  const parsed = parsePatchLines(patch);
  const match = parsed.find((line) => line.newLineNumber === targetLine);
  return match?.index ?? null;
}
