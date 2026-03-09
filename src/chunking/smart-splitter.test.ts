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
    const normalize = (s: string) => s.replace(/\n+/g, "\n");
    expect(normalize(got)).toBe(normalize(input));
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
});
