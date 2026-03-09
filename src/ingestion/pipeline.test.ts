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

  it("produces stable chunk IDs using POSIX separators", async () => {
    const sourceDir = await makeTempDir("dco-kb-src-");
    const outputDir = await makeTempDir("dco-kb-out-");

    await writeFile(path.join(sourceDir, "doc.md"), "# Title\n\nSome content.", "utf8");

    const summary = await ingestKnowledgeBase({
      sourceDir,
      outputDir,
      userId: "u1",
      maxChunkSize: 512,
      overlap: 0,
      embeddingDimension: 4,
    });

    const snapshot = JSON.parse(await readFile(summary.bm25SnapshotPath, "utf8")) as Bm25Snapshot;
    // Chunk IDs must use forward slashes, never backslashes
    snapshot.documents.forEach((doc) => {
      expect(doc.chunkId).not.toContain("\\");
      expect(doc.chunkId).toMatch(/^[^\\]+:\d+$/);
    });
  });

  it("produces stable file order across repeated calls", async () => {
    const sourceDir = await makeTempDir("dco-kb-src-");
    const outputDir1 = await makeTempDir("dco-kb-out1-");
    const outputDir2 = await makeTempDir("dco-kb-out2-");

    await writeFile(path.join(sourceDir, "z.md"), "z content", "utf8");
    await writeFile(path.join(sourceDir, "a.md"), "a content", "utf8");
    await writeFile(path.join(sourceDir, "m.md"), "m content", "utf8");

    const s1 = await ingestKnowledgeBase({ sourceDir, outputDir: outputDir1, userId: "u1", embeddingDimension: 4 });
    const s2 = await ingestKnowledgeBase({ sourceDir, outputDir: outputDir2, userId: "u1", embeddingDimension: 4 });

    const snap1 = JSON.parse(await readFile(s1.bm25SnapshotPath, "utf8")) as Bm25Snapshot;
    const snap2 = JSON.parse(await readFile(s2.bm25SnapshotPath, "utf8")) as Bm25Snapshot;

    // Document order must be identical across runs
    expect(snap1.documents.map((d) => d.chunkId)).toEqual(snap2.documents.map((d) => d.chunkId));
    // Files must be in ascending alphabetical order
    const fileOrder = snap1.documents.map((d) => d.chunkId.split(":")[0]);
    const uniqueFiles = [...new Set(fileOrder)];
    expect(uniqueFiles).toEqual([...uniqueFiles].sort());
  });
});
