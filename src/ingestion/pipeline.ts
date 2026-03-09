import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { PDFParse } from "pdf-parse";
import { sanitizeForIngestion } from "./sanitize";
import { smartSplit } from "../chunking/smart-splitter";
import { LanceDbVectorStore, type VectorDocument } from "../retrieval/lancedb-store";
import { Bm25Index } from "../retrieval/bm25-index";

export interface IngestionConfig {
  sourceDir: string;
  outputDir: string;
  userId: string;
  tableName?: string;
  maxChunkSize?: number;
  overlap?: number;
  embeddingDimension?: number;
  embed?: (text: string, dimension: number) => number[];
}

export interface IngestionSummary {
  filesProcessed: number;
  chunksIndexed: number;
  vectorDbPath: string;
  bm25SnapshotPath: string;
}

const SUPPORTED_EXTENSIONS = new Set([".md", ".markdown", ".json", ".pdf", ".txt"]);

function defaultEmbed(text: string, dimension: number): number[] {
  const vec = new Array<number>(dimension).fill(0);
  for (let i = 0; i < text.length; i += 1) {
    const code = text.charCodeAt(i);
    vec[i % dimension] += code / 255;
  }
  return vec;
}

async function collectFiles(root: string): Promise<string[]> {
  const entries = await readdir(root, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const full = path.join(root, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectFiles(full)));
      continue;
    }
    const ext = path.extname(entry.name).toLowerCase();
    if (SUPPORTED_EXTENSIONS.has(ext)) files.push(full);
  }
  return files;
}

async function parseToText(filePath: string): Promise<string> {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".json") {
    const raw = await readFile(filePath, "utf8");
    const parsed = JSON.parse(raw);
    return JSON.stringify(parsed, null, 2);
  }
  if (ext === ".pdf") {
    const buf = await readFile(filePath);
    try {
      const parser = new PDFParse({ data: buf });
      const parsed = await parser.getText();
      await parser.destroy();
      return parsed.text ?? "";
    } catch {
      // Fallback for fixture or malformed pdf; still deterministic.
      return buf.toString("utf8");
    }
  }
  return readFile(filePath, "utf8");
}

export async function ingestKnowledgeBase(config: IngestionConfig): Promise<IngestionSummary> {
  const tableName = config.tableName ?? "chunks";
  const maxChunkSize = config.maxChunkSize ?? 800;
  const overlap = config.overlap ?? 120;
  const embeddingDimension = config.embeddingDimension ?? 16;
  const embed = config.embed ?? defaultEmbed;

  const vectorDbPath = path.join(config.outputDir, "lancedb");
  const bm25SnapshotPath = path.join(config.outputDir, "bm25-index.json");
  await mkdir(config.outputDir, { recursive: true });
  await mkdir(vectorDbPath, { recursive: true });

  const files = await collectFiles(config.sourceDir);
  const vectorDocs: VectorDocument[] = [];
  const lexicalDocs: { chunkId: string; userId: string; text: string }[] = [];

  for (const filePath of files) {
    const raw = await parseToText(filePath);
    const safe = sanitizeForIngestion(raw);
    const chunks = smartSplit(safe, { maxChunkSize, overlap });
    const rel = path.relative(config.sourceDir, filePath);
    chunks.forEach((chunk, idx) => {
      const chunkId = `${rel}:${idx}`;
      const vector = embed(chunk, embeddingDimension);
      vectorDocs.push({ chunkId, userId: config.userId, text: chunk, vector });
      lexicalDocs.push({ chunkId, userId: config.userId, text: chunk });
    });
  }

  const vectorStore = new LanceDbVectorStore({ uri: vectorDbPath, tableName });
  await vectorStore.insert(vectorDocs);

  const bm25 = new Bm25Index();
  bm25.addDocuments(lexicalDocs);
  await writeFile(bm25SnapshotPath, JSON.stringify(bm25.toSnapshot(), null, 2), "utf8");

  return {
    filesProcessed: files.length,
    chunksIndexed: vectorDocs.length,
    vectorDbPath,
    bm25SnapshotPath,
  };
}
