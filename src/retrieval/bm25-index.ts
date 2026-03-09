import type { RetrievalFilter } from "./types";

export interface LexicalDocument {
  chunkId: string;
  userId: string;
  text: string;
}

export interface Bm25SearchQuery extends RetrievalFilter {
  query: string;
  k: number;
}

export interface Bm25SearchResult extends LexicalDocument {
  score: number;
}

interface IndexedDoc extends LexicalDocument {
  length: number;
  termFreq: Map<string, number>;
}

export interface Bm25Snapshot {
  documents: LexicalDocument[];
}

const DEFAULT_K1 = 1.5;
const DEFAULT_B = 0.75;

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-z0-9]+/g)
    .filter((t) => t.length > 0);
}

/**
 * Lightweight BM25 lexical index for keyword retrieval.
 * Supports user-scoped top-k search for dual-stream retrieval.
 */
export class Bm25Index {
  private docs: IndexedDoc[] = [];
  private docFreqByTerm = new Map<string, number>();
  private avgDocLength = 0;

  addDocuments(documents: LexicalDocument[]): void {
    if (documents.length === 0) return;

    for (const doc of documents) {
      const tokens = tokenize(doc.text);
      const termFreq = new Map<string, number>();
      for (const token of tokens) {
        termFreq.set(token, (termFreq.get(token) ?? 0) + 1);
      }

      const indexed: IndexedDoc = {
        ...doc,
        length: tokens.length,
        termFreq,
      };
      this.docs.push(indexed);

      for (const term of new Set(tokens)) {
        this.docFreqByTerm.set(term, (this.docFreqByTerm.get(term) ?? 0) + 1);
      }
    }

    const totalLength = this.docs.reduce((sum, d) => sum + d.length, 0);
    this.avgDocLength = this.docs.length > 0 ? totalLength / this.docs.length : 0;
  }

  toSnapshot(): Bm25Snapshot {
    return {
      documents: this.docs.map((d) => ({
        chunkId: d.chunkId,
        userId: d.userId,
        text: d.text,
      })),
    };
  }

  static fromSnapshot(snapshot: Bm25Snapshot): Bm25Index {
    const index = new Bm25Index();
    index.addDocuments(snapshot.documents);
    return index;
  }

  search(params: Bm25SearchQuery): Bm25SearchResult[] {
    if (params.k <= 0 || this.docs.length === 0) return [];
    const queryTerms = tokenize(params.query);
    if (queryTerms.length === 0) return [];

    const filtered = this.docs.filter((d) => d.userId === params.userId);
    const scored: Bm25SearchResult[] = filtered
      .map((doc) => ({
        chunkId: doc.chunkId,
        userId: doc.userId,
        text: doc.text,
        score: this.scoreDocument(doc, queryTerms),
      }))
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score);

    return scored.slice(0, params.k);
  }

  private scoreDocument(doc: IndexedDoc, queryTerms: string[]): number {
    if (doc.length === 0 || this.avgDocLength === 0) return 0;

    let score = 0;
    const nDocs = this.docs.length;
    for (const term of queryTerms) {
      const tf = doc.termFreq.get(term) ?? 0;
      if (tf === 0) continue;

      const df = this.docFreqByTerm.get(term) ?? 0;
      const idf = Math.log(1 + (nDocs - df + 0.5) / (df + 0.5));
      const denom = tf + DEFAULT_K1 * (1 - DEFAULT_B + DEFAULT_B * (doc.length / this.avgDocLength));
      score += idf * ((tf * (DEFAULT_K1 + 1)) / denom);
    }
    return score;
  }
}
