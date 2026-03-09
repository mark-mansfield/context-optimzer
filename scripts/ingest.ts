import path from "node:path";
import { ingestKnowledgeBase } from "../src/ingestion/pipeline";

async function main(): Promise<void> {
  const sourceDir = process.env.KB_SOURCE_DIR ?? path.resolve("docs/knowledge-base");
  const outputDir = process.env.KB_OUTPUT_DIR ?? path.resolve("public/data");
  const userId = process.env.KB_USER_ID ?? "default";

  const summary = await ingestKnowledgeBase({
    sourceDir,
    outputDir,
    userId,
  });

  console.log(
    `Ingestion complete: files=${summary.filesProcessed}, chunks=${summary.chunksIndexed}, output=${outputDir}`
  );
}

main().catch((error) => {
  console.error("KB ingestion failed:", error);
  process.exitCode = 1;
});
