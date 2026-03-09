/**
 * Smart Splitter: chunks raw document text for embedding/BM25 indexing
 * while respecting code blocks and headers so chunks are semantically coherent.
 */

export interface SmartSplitterConfig {
  /** Maximum character count per chunk. */
  maxChunkSize: number;
  /** Number of characters to overlap between consecutive chunks (default 0). */
  overlap?: number;
}

export type Segment =
  | { type: "fenced"; text: string }
  | { type: "indented"; text: string }
  | { type: "header"; text: string }
  | { type: "paragraph"; text: string };

/**
 * Segment input into fenced blocks, indented blocks, header lines, and paragraphs.
 * Code blocks and headers are never split; paragraphs can be split by size later.
 * A paragraph is terminated by a blank line, a fenced/indented code block, or a header.
 */
function segment(text: string): Segment[] {
  const segments: Segment[] = [];
  const lines = text.split(/\r?\n/);
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Fenced code block: ``` optional lang \n ... \n ```
    const fenceMatch = line.match(/^(`{3,})\s*(\w*)\s*$/);
    if (fenceMatch) {
      const fence = fenceMatch[1];
      const blockLines: string[] = [line];
      i += 1;
      while (i < lines.length && !lines[i].startsWith(fence)) {
        blockLines.push(lines[i]);
        i += 1;
      }
      if (i < lines.length) blockLines.push(lines[i]);
      i += 1;
      segments.push({ type: "fenced", text: blockLines.join("\n") });
      continue;
    }

    // Indented code block (4 spaces or tab)
    const indentedRe = /^(    |\t)/;
    if (indentedRe.test(line)) {
      const blockLines: string[] = [];
      while (i < lines.length && (indentedRe.test(lines[i]) || lines[i] === "")) {
        blockLines.push(lines[i]);
        i += 1;
      }
      segments.push({ type: "indented", text: blockLines.join("\n") });
      continue;
    }

    // ATX header: # to ######
    if (/^#{1,6}\s/.test(line)) {
      segments.push({ type: "header", text: line });
      i += 1;
      continue;
    }

    // Paragraph: collect until blank line, fenced/indented block, or header
    const paraLines: string[] = [];
    while (i < lines.length) {
      const l = lines[i];
      if (l === "") break;
      if (l.match(/^(`{3,})\s*(\w*)\s*$/) || indentedRe.test(l)) break;
      if (/^#{1,6}\s/.test(l)) break;
      paraLines.push(l);
      i += 1;
    }
    // Skip the blank line(s) that terminated the paragraph
    while (i < lines.length && lines[i] === "") {
      i += 1;
    }
    if (paraLines.length > 0) {
      segments.push({ type: "paragraph", text: paraLines.join("\n") });
    }
  }

  return segments;
}

/**
 * Build chunks from segments: never split a segment; when adding the next
 * segment would exceed maxChunkSize, flush and optionally carry overlap.
 */
function buildChunks(segments: Segment[], config: SmartSplitterConfig): string[] {
  const { maxChunkSize, overlap = 0 } = config;
  const chunks: string[] = [];
  let current: string[] = [];
  let currentLen = 0;
  let overlapBuffer = "";

  const sep = (arr: string[], _next: string) =>
    arr.length > 0 && !arr[arr.length - 1].endsWith("\n") ? "\n" : "";

  for (const seg of segments) {
    const text = seg.text;
    const extra = sep(current, text);
    const len = text.length + extra.length;

    if (currentLen + len <= maxChunkSize) {
      if (extra) current.push(extra);
      current.push(text);
      currentLen += len;
      overlapBuffer = text.slice(-overlap);
      continue;
    }

    if (current.length > 0) {
      chunks.push(current.join(""));
      current = [];
      currentLen = 0;
      if (overlap > 0 && overlapBuffer.length > 0) {
        current.push(overlapBuffer);
        currentLen = overlapBuffer.length;
      }
    }

    if (seg.type === "fenced" || seg.type === "indented" || seg.type === "header") {
      const extraAtom = sep(current, text);
      if (extraAtom) current.push(extraAtom);
      current.push(text);
      currentLen += extraAtom.length + text.length;
      chunks.push(current.join(""));
      current = [];
      currentLen = 0;
      overlapBuffer = text.slice(-overlap);
      continue;
    }

    // Paragraph: can split by size if needed
    const parts = splitParagraphBySize(text, maxChunkSize - currentLen, overlap);
    for (let p = 0; p < parts.length; p++) {
      const part = parts[p];
      const partExtra = sep(current, part);
      const partLen = part.length + partExtra.length;
      if (currentLen + partLen <= maxChunkSize) {
        if (partExtra) current.push(partExtra);
        current.push(part);
        currentLen += partLen;
        overlapBuffer = part.slice(-overlap);
      } else {
        if (current.length > 0) chunks.push(current.join(""));
        current = [part];
        currentLen = part.length;
        overlapBuffer = part.slice(-overlap);
      }
    }
  }

  // Fix #4: use join("") for consistency with earlier chunks (separators are already elements).
  if (current.length > 0) chunks.push(current.join(""));
  return chunks;
}

function splitParagraphBySize(
  text: string,
  maxPartSize: number,
  overlap: number
): string[] {
  if (maxPartSize <= 0) return [text];
  if (text.length <= maxPartSize) return [text];

  // Fix #5: clamp overlap so it is always less than maxPartSize,
  // guaranteeing that `start` advances each iteration.
  const safeOverlap = overlap > 0 ? Math.min(overlap, maxPartSize - 1) : 0;

  const parts: string[] = [];
  let start = 0;
  while (start < text.length) {
    let end = Math.min(start + maxPartSize, text.length);
    if (end < text.length) {
      const lastNewline = text.lastIndexOf("\n", end);
      if (lastNewline > start) end = lastNewline + 1;
    }
    parts.push(text.slice(start, end));
    start = safeOverlap > 0 && end < text.length ? end - safeOverlap : end;
  }
  return parts;
}

/**
 * Split raw document text into chunks suitable for embedding and BM25 indexing.
 * Respects Markdown code blocks (fenced and indented) and headers; boundaries
 * align to semantic structure. Deterministic for the same input and config.
 */
export function smartSplit(text: string, config: SmartSplitterConfig): string[] {
  if (text.length === 0) return [];
  const segments = segment(text);
  return buildChunks(segments, config);
}
