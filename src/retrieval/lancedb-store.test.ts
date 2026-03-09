import { afterEach, describe, expect, it } from "vitest";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { LanceDbVectorStore, type VectorDocument } from "./lancedb-store";

const createdDirs: string[] = [];

async function makeTempDbDir(): Promise<string> {
  const dir = await mkdtemp(path.join(tmpdir(), "dco-lancedb-"));
  createdDirs.push(dir);
  return dir;
}

describe("LanceDbVectorStore", () => {
  afterEach(async () => {
    await Promise.all(createdDirs.map((dir) => rm(dir, { recursive: true, force: true })));
    createdDirs.length = 0;
  });

  it("inserts vectors and returns top-k nearest rows", async () => {
    const dbPath = await makeTempDbDir();
    const store = new LanceDbVectorStore({ uri: dbPath, tableName: "chunks" });
    const docs: VectorDocument[] = [
      { chunkId: "a-1", userId: "u-a", text: "A1", vector: [1, 0] },
      { chunkId: "a-2", userId: "u-a", text: "A2", vector: [0, 1] },
      { chunkId: "b-1", userId: "u-b", text: "B1", vector: [1, 0] },
    ];

    await store.insert(docs);

    const results = await store.search({
      userId: "u-a",
      vector: [0.95, 0.05],
      k: 2,
    });

    expect(results).toHaveLength(2);
    expect(results[0].chunkId).toBe("a-1");
    expect(results[1].chunkId).toBe("a-2");
  });

  it("enforces user_id filtering at query time", async () => {
    const dbPath = await makeTempDbDir();
    const store = new LanceDbVectorStore({ uri: dbPath, tableName: "chunks" });

    await store.insert([
      { chunkId: "a-1", userId: "u-a", text: "A1", vector: [1, 0] },
      { chunkId: "b-1", userId: "u-b", text: "B1", vector: [1, 0] },
    ]);

    const userA = await store.search({ userId: "u-a", vector: [1, 0], k: 10 });
    const userB = await store.search({ userId: "u-b", vector: [1, 0], k: 10 });

    expect(userA).toHaveLength(1);
    expect(userA[0].userId).toBe("u-a");
    expect(userA[0].chunkId).toBe("a-1");

    expect(userB).toHaveLength(1);
    expect(userB[0].userId).toBe("u-b");
    expect(userB[0].chunkId).toBe("b-1");
  });
});
