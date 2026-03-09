import { describe, expect, it } from "vitest";
import { Bm25Index, type LexicalDocument } from "./bm25-index";

describe("Bm25Index", () => {
  it("returns top-k ranked results for a keyword query", () => {
    const index = new Bm25Index();
    const docs: LexicalDocument[] = [
      { chunkId: "c1", userId: "u1", text: "apple apple banana" },
      { chunkId: "c2", userId: "u1", text: "apple banana banana banana" },
      { chunkId: "c3", userId: "u1", text: "orange pear" },
    ];
    index.addDocuments(docs);

    const results = index.search({ query: "apple", userId: "u1", k: 2 });
    expect(results).toHaveLength(2);
    expect(results[0].chunkId).toBe("c1");
    expect(results[1].chunkId).toBe("c2");
    expect(results[0].score).toBeGreaterThan(results[1].score);
  });

  it("enforces user_id filter at query time", () => {
    const index = new Bm25Index();
    index.addDocuments([
      { chunkId: "a", userId: "user-a", text: "refund policy return item" },
      { chunkId: "b", userId: "user-b", text: "refund policy return item" },
    ]);

    const aOnly = index.search({ query: "refund return", userId: "user-a", k: 10 });
    const bOnly = index.search({ query: "refund return", userId: "user-b", k: 10 });

    expect(aOnly).toHaveLength(1);
    expect(aOnly[0].chunkId).toBe("a");
    expect(aOnly[0].userId).toBe("user-a");

    expect(bOnly).toHaveLength(1);
    expect(bOnly[0].chunkId).toBe("b");
    expect(bOnly[0].userId).toBe("user-b");
  });

  it("BM25 scores are computed from per-user stats: other users' documents do not influence ranking", () => {
    // user-a has 2 docs; user-b has 10 docs
    // If stats were global, avgDocLength would be skewed by user-b's docs.
    // With per-user stats, user-a's scores must be independent of user-b's corpus.
    const index = new Bm25Index();

    index.addDocuments([
      { chunkId: "a1", userId: "user-a", text: "refund return policy" },
      { chunkId: "a2", userId: "user-a", text: "order shipped" },
    ]);

    // Build a separate index with only user-a docs for comparison.
    const isolatedIndex = new Bm25Index();
    isolatedIndex.addDocuments([
      { chunkId: "a1", userId: "user-a", text: "refund return policy" },
      { chunkId: "a2", userId: "user-a", text: "order shipped" },
    ]);

    // Now add many user-b docs to the main index.
    const userBDocs: LexicalDocument[] = Array.from({ length: 10 }, (_, i) => ({
      chunkId: `b${i}`,
      userId: "user-b",
      text: `completely unrelated content document number ${i}`,
    }));
    index.addDocuments(userBDocs);

    const scoreWithOtherUser = index.search({ query: "refund return", userId: "user-a", k: 10 });
    const scoreIsolated = isolatedIndex.search({ query: "refund return", userId: "user-a", k: 10 });

    // Scores must be identical because user-b's docs must not affect user-a's stats.
    expect(scoreWithOtherUser.map((r) => ({ id: r.chunkId, score: r.score }))).toEqual(
      scoreIsolated.map((r) => ({ id: r.chunkId, score: r.score }))
    );
  });

  it("snapshot round-trip preserves all documents and scores", () => {
    const index = new Bm25Index();
    index.addDocuments([
      { chunkId: "x1", userId: "u1", text: "hello world" },
      { chunkId: "x2", userId: "u2", text: "world peace" },
    ]);
    const snapshot = index.toSnapshot();
    const restored = Bm25Index.fromSnapshot(snapshot);

    const orig = index.search({ query: "world", userId: "u1", k: 5 });
    const rest = restored.search({ query: "world", userId: "u1", k: 5 });
    expect(rest).toEqual(orig);
  });
});
