import { describe, expect, it } from "vitest";
import { DualStreamRetriever } from "./dual-stream-retriever";

describe("DualStreamRetriever", () => {
  it("runs semantic and lexical searches in parallel and keeps latency budget", async () => {
    const vectorStore = {
      search: async () => {
        await new Promise((r) => setTimeout(r, 140));
        return [{ chunkId: "v1", userId: "u1", text: "vector", vector: [1, 0], distance: 0.1 }];
      },
    };
    const lexicalStore = {
      search: async () => {
        await new Promise((r) => setTimeout(r, 140));
        return [{ chunkId: "l1", userId: "u1", text: "lexical", score: 1.1 }];
      },
    };
    const retriever = new DualStreamRetriever(vectorStore, lexicalStore);

    const started = Date.now();
    const out = await retriever.retrieve({
      userId: "u1",
      query: "refund policy",
      queryVector: [1, 0],
      streamTopK: 3,
      maxResults: 3,
    });
    const elapsed = Date.now() - started;

    expect(out.length).toBeGreaterThan(0);
    expect(elapsed).toBeLessThan(280);
  });

  it("merges stream outputs with RRF and deduplicates ids", async () => {
    const vectorStore = {
      search: async () => [
        { chunkId: "shared", userId: "u1", text: "shared vector", vector: [1, 0], distance: 0.1 },
        { chunkId: "v-only", userId: "u1", text: "v-only", vector: [0, 1], distance: 0.2 },
      ],
    };
    const lexicalStore = {
      search: () => [
        { chunkId: "shared", userId: "u1", text: "shared lexical", score: 2.0 },
        { chunkId: "l-only", userId: "u1", text: "l-only", score: 1.0 },
      ],
    };

    const retriever = new DualStreamRetriever(vectorStore, lexicalStore);
    const out = await retriever.retrieve({
      userId: "u1",
      query: "query",
      queryVector: [1, 0],
      streamTopK: 5,
      maxResults: 5,
    });

    const ids = out.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids[0]).toBe("shared");
    expect(ids).toContain("v-only");
    expect(ids).toContain("l-only");
  });

  it("propagates user-scoped results from both stores", async () => {
    const vectorStore = {
      search: async ({ userId }: { userId: string }) => [
        { chunkId: `v-${userId}`, userId, text: "v", vector: [1], distance: 0.1 },
      ],
    };
    const lexicalStore = {
      search: ({ userId }: { userId: string }) => [{ chunkId: `l-${userId}`, userId, text: "l", score: 1 }],
    };
    const retriever = new DualStreamRetriever(vectorStore, lexicalStore);
    const out = await retriever.retrieve({
      userId: "alice",
      query: "q",
      queryVector: [1],
      streamTopK: 3,
      maxResults: 3,
    });
    expect(out.every((n) => n.userId === "alice")).toBe(true);
  });
});
