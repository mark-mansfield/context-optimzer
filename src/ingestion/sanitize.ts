/**
 * Sanitize raw content for ingestion: strip HTML and script/style tags
 * to reduce Indirect Prompt Injection risk (ASI-01). Safe for use before chunking.
 */

/**
 * Remove script and style elements (including their content) case-insensitively.
 */
function removeScriptAndStyle(html: string): string {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "");
}

/**
 * Remove all remaining HTML tags (e.g. <div>, <img>, </span>).
 */
function stripHtmlTags(text: string): string {
  return text.replace(/<[^>]+>/g, " ");
}

/**
 * Collapse multiple spaces/newlines into one space, trim.
 */
function normalizeSpaces(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

/**
 * Sanitize raw string content for ingestion: strip HTML tags, remove script/style
 * tag contents. Plain text and safe Markdown (headers, code blocks) are preserved.
 * Deterministic and pure.
 */
export function sanitizeForIngestion(raw: string): string {
  if (raw.length === 0) return "";
  const withoutScriptStyle = removeScriptAndStyle(raw);
  const withoutTags = stripHtmlTags(withoutScriptStyle);
  return normalizeSpaces(withoutTags);
}
