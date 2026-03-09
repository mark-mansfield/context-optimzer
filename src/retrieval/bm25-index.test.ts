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
});
