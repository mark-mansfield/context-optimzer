import { afterEach, describe, expect, it } from "vitest";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { LanceDbVectorStore } from "./lancedb-store";
import { Bm25Index } from "./bm25-index";

const createdDirs: string[] = [];

async function makeTempDbDir(): Promise<string> {
  const dir = await mkdtemp(path.join(tmpdir(), "dco-filter-"));
  createdDirs.push(dir);
  return dir;
}

describe("retrieval user_id filtering contract", () => {
  afterEach(async () => {
    await Promise.all(createdDirs.map((dir) => rm(dir, { recursive: true, force: true })));
    createdDirs.length = 0;
  });

  it("never leaks alice records to bob in both vector and lexical retrieval", async () => {
    const dbPath = await makeTempDbDir();
    const vectorStore = new LanceDbVectorStore({ uri: dbPath, tableName: "chunks" });
    const bm25 = new Bm25Index();

    const docs = [
      { chunkId: "alice-1", userId: "alice", text: "refund return policy", vector: [1, 0] },
      { chunkId: "bob-1", userId: "bob", text: "refund return policy", vector: [1, 0] },
    ];

    await vectorStore.insert(docs);
    bm25.addDocuments(docs);

    const bobVector = await vectorStore.search({ userId: "bob", vector: [1, 0], k: 10 });
    const bobLexical = bm25.search({ userId: "bob", query: "refund return", k: 10 });

    expect(bobVector.every((r) => r.userId === "bob")).toBe(true);
    expect(bobVector.some((r) => r.userId === "alice")).toBe(false);

    expect(bobLexical.every((r) => r.userId === "bob")).toBe(true);
    expect(bobLexical.some((r) => r.userId === "alice")).toBe(false);
  });
});
