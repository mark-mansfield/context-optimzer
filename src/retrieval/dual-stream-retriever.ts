import type { RetrievalFilter } from "./types";
import type { VectorSearchResult } from "./lancedb-store";
import type { Bm25SearchResult } from "./bm25-index";
import { reciprocalRankFusion } from "./rrf";

export interface DualStreamQuery extends RetrievalFilter {
  query: string;
  queryVector: number[];
  streamTopK?: number;
  maxResults?: number;
  rrfK?: number;
}

export interface RetrievalNode {
  id: string;
  text: string;
  userId: string;
  fusedScore: number;
  vectorDistance?: number;
  lexicalScore?: number;
}

export interface VectorStoreLike {
  search(params: { vector: number[]; userId: string; k: number }): Promise<VectorSearchResult[]>;
}

export interface LexicalStoreLike {
  search(params: { query: string; userId: string; k: number }): Bm25SearchResult[] | Promise<Bm25SearchResult[]>;
}

/**
 * Runs semantic and lexical retrieval in parallel and fuses with RRF.
 */
export class DualStreamRetriever {
  constructor(
    private readonly vectorStore: VectorStoreLike,
    private readonly lexicalStore: LexicalStoreLike
  ) {}

  async retrieve(input: DualStreamQuery): Promise<RetrievalNode[]> {
    const streamTopK = input.streamTopK ?? 10;
    const maxResults = input.maxResults ?? streamTopK;

    const [vectorResults, lexicalResults] = await Promise.all([
      this.vectorStore.search({
        vector: input.queryVector,
        userId: input.userId,
        k: streamTopK,
      }),
      Promise.resolve(
        this.lexicalStore.search({
          query: input.query,
          userId: input.userId,
          k: streamTopK,
        })
      ),
    ]);

    const fused = reciprocalRankFusion(
      [vectorResults.map((r) => r.chunkId), lexicalResults.map((r) => r.chunkId)],
      { k: input.rrfK ?? 60 }
    );

    const byId = new Map<string, RetrievalNode>();
    for (const v of vectorResults) {
      byId.set(v.chunkId, {
        id: v.chunkId,
        text: v.text,
        userId: v.userId,
        fusedScore: 0,
        vectorDistance: v.distance,
      });
    }
    for (const l of lexicalResults) {
      const existing = byId.get(l.chunkId);
      if (existing) {
        existing.lexicalScore = l.score;
      } else {
        byId.set(l.chunkId, {
          id: l.chunkId,
          text: l.text,
          userId: l.userId,
          fusedScore: 0,
          lexicalScore: l.score,
        });
      }
    }

    return fused.slice(0, maxResults).map((entry) => {
      const base = byId.get(entry.id);
      if (!base) {
        throw new Error(`Missing fused node payload for id '${entry.id}'`);
      }
      return { ...base, fusedScore: entry.score };
    });
  }
}
