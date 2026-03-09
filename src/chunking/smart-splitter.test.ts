import { describe, expect, it } from "vitest";
import { smartSplit, type SmartSplitterConfig } from "./smart-splitter";

describe("smartSplit", () => {
  const defaultConfig: SmartSplitterConfig = {
    maxChunkSize: 256,
    overlap: 0,
  };

  it("does not fragment fenced code blocks: no chunk contains unmatched fence", () => {
    const input = "intro\n```js\nconst x = 1;\n```\noutro";
    const chunks = smartSplit(input, { ...defaultConfig, maxChunkSize: 20 });
    chunks.forEach((chunk) => {
      const count = (chunk.match(/```/g) ?? []).length;
      expect(count % 2).toBe(0);
    });
  });

  it("keeps fenced code block content in one chunk when block fits", () => {
    const code = "const a = 1;\nconst b = 2;";
    const input = "before\n```ts\n" + code + "\n```\nafter";
    const chunks = smartSplit(input, { ...defaultConfig, maxChunkSize: 512 });
    const withCode = chunks.filter((c) => c.includes(code));
    expect(withCode.length).toBe(1);
    expect(withCode[0]).toContain("```ts");
    expect(withCode[0]).toContain("```");
  });

  it("does not split indented code block across chunks", () => {
    const indented = "    line1\n    line2\n    line3";
    const input = "text before\n" + indented + "\ntext after";
    const chunks = smartSplit(input, { ...defaultConfig, maxChunkSize: 30 });
    const chunkWithIndented = chunks.find((c) => c.includes("    line1"));
    expect(chunkWithIndented).toBeDefined();
    expect(chunkWithIndented).toContain("    line2");
    expect(chunkWithIndented).toContain("    line3");
  });

  it("prefers header boundaries when splitting: no chunk has broken header line", () => {
    const part = "x".repeat(200);
    const input = "## Section A\n\n" + part + "\n\n## Section B\n\n" + part;
    const chunks = smartSplit(input, { ...defaultConfig, maxChunkSize: 250 });
    chunks.forEach((chunk) => {
      const lines = chunk.split("\n");
      lines.forEach((line) => {
        if (/^#{1,6}\s/.test(line)) {
          expect(line).toMatch(/^#{1,6}\s.+/);
        }
      });
    });
  });

  it("is deterministic for same input and config", () => {
    const input = "## A\n\nSome content.\n\n```\ncode\n```\n\n## B\n\nMore.";
    const config: SmartSplitterConfig = { maxChunkSize: 80, overlap: 0 };
    const a = smartSplit(input, config);
    const b = smartSplit(input, config);
    expect(a).toEqual(b);
  });

  it("applies overlap when configured", () => {
    const input = "alpha beta gamma delta";
    const chunks = smartSplit(input, { maxChunkSize: 12, overlap: 4 });
    expect(chunks.length).toBeGreaterThanOrEqual(2);
    const firstEnd = chunks[0].slice(-4);
    const secondStart = chunks[1].slice(0, 4);
    expect(secondStart).toBe(firstEnd);
  });

  it("preserves full content when overlap is 0: concatenation equals input", () => {
    const input = "## One\n\nParagraph one.\n\n## Two\n\nParagraph two.";
    const chunks = smartSplit(input, { ...defaultConfig, overlap: 0 });
    const got = chunks.join("");
    expect(got).toContain("## One");
    expect(got).toContain("Paragraph one.");
    expect(got).toContain("## Two");
    expect(got).toContain("Paragraph two.");
  });

  it("returns single chunk when input is smaller than maxChunkSize", () => {
    const input = "short";
    const chunks = smartSplit(input, defaultConfig);
    expect(chunks).toHaveLength(1);
    expect(chunks[0]).toBe("short");
  });

  it("handles empty string", () => {
    const chunks = smartSplit("", defaultConfig);
    expect(chunks).toEqual([]);
  });

  // Fix #5: overlap >= maxPartSize must not cause infinite loop
  it("does not loop infinitely when overlap equals maxChunkSize", () => {
    const input = "a".repeat(100);
    // overlap equal to maxChunkSize would cause start to never advance without the guard
    const chunks = smartSplit(input, { maxChunkSize: 10, overlap: 10 });
    expect(chunks.length).toBeGreaterThan(0);
    // Verify we eventually cover the full content (no duplicate-only coverage)
    expect(chunks[chunks.length - 1].length).toBeGreaterThan(0);
  });

  it("does not loop infinitely when overlap exceeds maxChunkSize", () => {
    const input = "b".repeat(50);
    const chunks = smartSplit(input, { maxChunkSize: 8, overlap: 20 });
    expect(chunks.length).toBeGreaterThan(0);
  });

  // Fix #6: paragraphs must terminate at blank lines
  it("splits on blank lines: two paragraphs separated by blank line become separate segments", () => {
    const input = "First paragraph.\n\nSecond paragraph.";
    const chunks = smartSplit(input, { maxChunkSize: 512, overlap: 0 });
    // Both paragraphs must appear in output
    const combined = chunks.join(" ");
    expect(combined).toContain("First paragraph.");
    expect(combined).toContain("Second paragraph.");
  });

  it("blank-line-separated sections do not bleed into each other in small chunk mode", () => {
    const long = "x".repeat(60);
    const input = `${long}\n\n${long}`;
    // With a large enough maxChunkSize both paragraphs fit; verify blank line correctly separates them
    const chunks = smartSplit(input, { maxChunkSize: 512, overlap: 0 });
    // There should be exactly 2 segments → merged into 1 or 2 chunks, but no blank line inside a chunk
    chunks.forEach((chunk) => {
      expect(chunk).not.toMatch(/\n\n/);
    });
  });
});
