import { describe, expect, it } from "vitest";
import { toFiniteNonNegative } from "./normalize";

describe("toFiniteNonNegative", () => {
  it("returns value when it is a finite non-negative number", () => {
    expect(toFiniteNonNegative(0)).toBe(0);
    expect(toFiniteNonNegative(100)).toBe(100);
    expect(toFiniteNonNegative(1.5)).toBe(1.5);
  });

  it("returns fallback for NaN", () => {
    expect(toFiniteNonNegative(NaN)).toBe(0);
    expect(toFiniteNonNegative(NaN, 42)).toBe(42);
  });

  it("returns fallback for null or undefined", () => {
    expect(toFiniteNonNegative(null)).toBe(0);
    expect(toFiniteNonNegative(undefined)).toBe(0);
    expect(toFiniteNonNegative(undefined, 10)).toBe(10);
  });

  it("returns fallback for negative numbers", () => {
    expect(toFiniteNonNegative(-1)).toBe(0);
    expect(toFiniteNonNegative(-100, 5)).toBe(5);
  });

  it("returns fallback for Infinity", () => {
    expect(toFiniteNonNegative(Infinity)).toBe(0);
    expect(toFiniteNonNegative(-Infinity)).toBe(0);
  });

  it("coerces numeric strings to number when finite and non-negative", () => {
    expect(toFiniteNonNegative("100")).toBe(100);
    expect(toFiniteNonNegative("0")).toBe(0);
  });

  it("returns fallback for non-numeric strings", () => {
    expect(toFiniteNonNegative("abc")).toBe(0);
    expect(toFiniteNonNegative("")).toBe(0);
  });
});
