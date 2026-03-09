/**
 * Sanitize raw content for ingestion: strip HTML and script/style tags
 * to reduce Indirect Prompt Injection risk (ASI-01). Safe for use before chunking.
 */

/**
 * Remove all HTML markup from `raw` in a single pipeline:
 * 1. Replace complete <script>…</script> blocks (including content) with a space.
 * 2. Replace complete <style>…</style> blocks (including content) with a space.
 * 3. Strip all remaining HTML tags so no tag fragments remain.
 *
 * Using `[^>]*` for closing-tag attributes handles whitespace variants like
 * `</script  >` and `</SCRIPT>` in addition to the standard form.
 */
function removeAllHtml(html: string): string {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script[^>]*>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style[^>]*>/gi, " ")
    .replace(/<[^>]*>/g, " ");
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
  return normalizeSpaces(removeAllHtml(raw));
}

