import { describe, expect, it } from "vitest";
import { reciprocalRankFusion } from "./rrf";

describe("reciprocalRankFusion", () => {
  it("computes fused scores with default k=60", () => {
    const a = ["x", "y", "z"];
    const b = ["y", "x", "w"];
    const result = reciprocalRankFusion([a, b]);

    const x = result.find((r) => r.id === "x");
    const y = result.find((r) => r.id === "y");
    const z = result.find((r) => r.id === "z");

    expect(x?.score).toBeCloseTo(1 / 61 + 1 / 62, 10);
    expect(y?.score).toBeCloseTo(1 / 62 + 1 / 61, 10);
    expect(z?.score).toBeCloseTo(1 / 63, 10);
  });

  it("supports configurable k", () => {
    const a = ["a", "b"];
    const b = ["b", "a"];
    const result = reciprocalRankFusion([a, b], { k: 10 });

    const aRow = result.find((r) => r.id === "a");
    const bRow = result.find((r) => r.id === "b");
    expect(aRow?.score).toBeCloseTo(1 / 11 + 1 / 12, 10);
    expect(bRow?.score).toBeCloseTo(1 / 12 + 1 / 11, 10);
  });

  it("ranks overlapping items above single-list items", () => {
    const a = ["shared", "solo-a"];
    const b = ["shared", "solo-b"];
    const fused = reciprocalRankFusion([a, b], { k: 60 });
    expect(fused[0].id).toBe("shared");
  });

  it("is deterministic and deduplicated", () => {
    const lists = [
      ["a", "b", "c"],
      ["c", "a"],
      ["a", "d"],
    ];
    const first = reciprocalRankFusion(lists);
    const second = reciprocalRankFusion(lists);
    expect(first).toEqual(second);
    const ids = first.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
