import { describe, expect, it } from "vitest";
import { sanitizeForIngestion } from "./sanitize";

describe("sanitizeForIngestion", () => {
  it("strips script tags and their content", () => {
    const input = "Hello <script>alert(1)</script> world";
    expect(sanitizeForIngestion(input)).not.toContain("<script>");
    expect(sanitizeForIngestion(input)).not.toContain("alert(1)");
    expect(sanitizeForIngestion(input)).toContain("Hello");
    expect(sanitizeForIngestion(input)).toContain("world");
  });

  it("strips script with attributes", () => {
    const input = "x <script type=\"text/javascript\">evil()</script> y";
    const out = sanitizeForIngestion(input);
    expect(out).not.toMatch(/<script/i);
    expect(out).not.toContain("evil()");
    expect(out).toContain("x");
    expect(out).toContain("y");
  });

  it("strips style tags and their content", () => {
    const input = "text <style>.x { color: red }</style> more";
    const out = sanitizeForIngestion(input);
    expect(out).not.toMatch(/<style/i);
    expect(out).not.toContain("color: red");
    expect(out).toContain("text");
    expect(out).toContain("more");
  });

  it("strips img and other HTML tags", () => {
    const input = "a <img src=x onerror=alert(1)> b";
    const out = sanitizeForIngestion(input);
    expect(out).not.toMatch(/<img/i);
    expect(out).not.toContain("onerror");
    expect(out).toContain("a");
    expect(out).toContain("b");
  });

  it("strips div and generic HTML tags", () => {
    const input = "before <div class=\"x\">inner</div> after";
    const out = sanitizeForIngestion(input);
    expect(out).not.toMatch(/<div/i);
    expect(out).not.toMatch(/<\/div>/i);
    expect(out).toContain("inner");
    expect(out).toContain("before");
    expect(out).toContain("after");
  });

  it("preserves safe Markdown: headers and code blocks", () => {
    const input = "## Header\n\n```js\nconst x = 1;\n```\n\nParagraph.";
    const out = sanitizeForIngestion(input);
    expect(out).toContain("## Header");
    expect(out).toContain("```js");
    expect(out).toContain("const x = 1;");
    expect(out).toContain("Paragraph.");
  });

  it("is deterministic and pure", () => {
    const input = "a <b>c</b> d";
    expect(sanitizeForIngestion(input)).toBe(sanitizeForIngestion(input));
    expect(sanitizeForIngestion(input)).not.toBe(input);
  });

  it("handles empty string", () => {
    expect(sanitizeForIngestion("")).toBe("");
  });

  it("leaves plain text unchanged when no tags", () => {
    const input = "Just plain text.";
    expect(sanitizeForIngestion(input)).toBe(input);
  });
});
