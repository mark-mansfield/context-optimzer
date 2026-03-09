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
 * Per-user BM25 statistics to ensure tenant isolation.
 * Stats (nDocs, docFreqByTerm, avgDocLength) are computed exclusively
 * over the documents belonging to each user so that one user's corpus
 * cannot influence another user's ranking.
 */
interface UserStats {
  docs: IndexedDoc[];
  docFreqByTerm: Map<string, number>;
  avgDocLength: number;
}

/**
 * Lightweight BM25 lexical index for keyword retrieval.
 * Supports user-scoped top-k search with fully tenant-isolated statistics:
 * IDF/avgDocLength are computed per user so cross-user data never influences scores.
 */
export class Bm25Index {
  private userStats = new Map<string, UserStats>();

  private getOrCreateUserStats(userId: string): UserStats {
    let stats = this.userStats.get(userId);
    if (!stats) {
      stats = { docs: [], docFreqByTerm: new Map(), avgDocLength: 0 };
      this.userStats.set(userId, stats);
    }
    return stats;
  }

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

      const stats = this.getOrCreateUserStats(doc.userId);
      stats.docs.push(indexed);

      for (const term of new Set(tokens)) {
        stats.docFreqByTerm.set(term, (stats.docFreqByTerm.get(term) ?? 0) + 1);
      }

      const totalLength = stats.docs.reduce((sum, d) => sum + d.length, 0);
      stats.avgDocLength = stats.docs.length > 0 ? totalLength / stats.docs.length : 0;
    }
  }

  toSnapshot(): Bm25Snapshot {
    const documents: LexicalDocument[] = [];
    for (const stats of this.userStats.values()) {
      for (const d of stats.docs) {
        documents.push({ chunkId: d.chunkId, userId: d.userId, text: d.text });
      }
    }
    return { documents };
  }

  static fromSnapshot(snapshot: Bm25Snapshot): Bm25Index {
    const index = new Bm25Index();
    index.addDocuments(snapshot.documents);
    return index;
  }

  search(params: Bm25SearchQuery): Bm25SearchResult[] {
    if (params.k <= 0) return [];
    const queryTerms = tokenize(params.query);
    if (queryTerms.length === 0) return [];

    const stats = this.userStats.get(params.userId);
    if (!stats || stats.docs.length === 0) return [];

    const scored: Bm25SearchResult[] = stats.docs
      .map((doc) => ({
        chunkId: doc.chunkId,
        userId: doc.userId,
        text: doc.text,
        score: this.scoreDocument(doc, queryTerms, stats),
      }))
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score);

    return scored.slice(0, params.k);
  }

  private scoreDocument(doc: IndexedDoc, queryTerms: string[], stats: UserStats): number {
    if (doc.length === 0 || stats.avgDocLength === 0) return 0;

    let score = 0;
    const nDocs = stats.docs.length;
    for (const term of queryTerms) {
      const tf = doc.termFreq.get(term) ?? 0;
      if (tf === 0) continue;

      const df = stats.docFreqByTerm.get(term) ?? 0;
      const idf = Math.log(1 + (nDocs - df + 0.5) / (df + 0.5));
      const denom =
        tf + DEFAULT_K1 * (1 - DEFAULT_B + DEFAULT_B * (doc.length / stats.avgDocLength));
      score += idf * ((tf * (DEFAULT_K1 + 1)) / denom);
    }
    return score;
  }
}
