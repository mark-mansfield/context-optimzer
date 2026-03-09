import { afterEach, describe, expect, it } from "vitest";
import { mkdtemp, rm, writeFile, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { ingestKnowledgeBase } from "./pipeline";
import { LanceDbVectorStore } from "@/retrieval/lancedb-store";
import { Bm25Index, type Bm25Snapshot } from "@/retrieval/bm25-index";

const tempDirs: string[] = [];

async function makeTempDir(prefix: string): Promise<string> {
  const dir = await mkdtemp(path.join(tmpdir(), prefix));
  tempDirs.push(dir);
  return dir;
}

describe("ingestKnowledgeBase", () => {
  afterEach(async () => {
    await Promise.all(tempDirs.map((dir) => rm(dir, { recursive: true, force: true })));
    tempDirs.length = 0;
  });

  it("parses MD/JSON/PDF, sanitizes, chunks, and writes dual indexes", async () => {
    const sourceDir = await makeTempDir("dco-kb-src-");
    const outputDir = await makeTempDir("dco-kb-out-");

    await writeFile(path.join(sourceDir, "a.md"), "## Header\n\n<script>x()</script> refund policy", "utf8");
    await writeFile(
      path.join(sourceDir, "b.json"),
      JSON.stringify({ title: "returns", body: "return item within 30 days" }),
      "utf8"
    );
    await writeFile(path.join(sourceDir, "c.pdf"), "PDF-like text: refund workflow", "utf8");

    const summary = await ingestKnowledgeBase({
      sourceDir,
      outputDir,
      userId: "demo-user",
      maxChunkSize: 120,
      overlap: 20,
      embeddingDimension: 8,
    });

    expect(summary.filesProcessed).toBe(3);
    expect(summary.chunksIndexed).toBeGreaterThan(0);
    expect(existsSync(summary.bm25SnapshotPath)).toBe(true);
    expect(existsSync(summary.vectorDbPath)).toBe(true);

    const vectorStore = new LanceDbVectorStore({ uri: summary.vectorDbPath, tableName: "chunks" });
    const vectorResults = await vectorStore.search({
      userId: "demo-user",
      vector: [1, 0, 0, 0, 0, 0, 0, 0],
      k: 5,
    });
    expect(vectorResults.length).toBeGreaterThan(0);
    expect(vectorResults.every((r) => r.userId === "demo-user")).toBe(true);

    const snapshot = JSON.parse(await readFile(summary.bm25SnapshotPath, "utf8")) as Bm25Snapshot;
    const bm25 = Bm25Index.fromSnapshot(snapshot);
    const lexical = bm25.search({ userId: "demo-user", query: "refund return", k: 5 });
    expect(lexical.length).toBeGreaterThan(0);
    expect(lexical.every((r) => r.userId === "demo-user")).toBe(true);
  });
});
