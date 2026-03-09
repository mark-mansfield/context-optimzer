import * as lancedb from "@lancedb/lancedb";
import type { Connection, Table } from "@lancedb/lancedb";
import type { RetrievalFilter } from "./types";

export interface VectorDocument {
  chunkId: string;
  userId: string;
  text: string;
  vector: number[];
}

export interface VectorSearchQuery extends RetrievalFilter {
  vector: number[];
  k: number;
}

export interface VectorSearchResult extends VectorDocument {
  distance?: number;
}

export interface LanceDbVectorStoreOptions {
  uri: string;
  tableName: string;
}

type LanceRow = {
  chunk_id: string;
  user_id: string;
  text: string;
  vector: number[];
  _distance?: number;
};

function escapeSqlStringLiteral(value: string): string {
  return value.replace(/'/g, "''");
}

/**
 * LanceDB-backed semantic store for dense vector retrieval.
 * Stores vectors and metadata and supports user-scoped top-k search.
 */
export class LanceDbVectorStore {
  private connectionPromise: Promise<Connection> | null = null;
  private table: Table | null = null;

  constructor(private readonly options: LanceDbVectorStoreOptions) {}

  async insert(documents: VectorDocument[]): Promise<void> {
    if (documents.length === 0) return;

    const rows = documents.map((doc) => ({
      chunk_id: doc.chunkId,
      user_id: doc.userId,
      text: doc.text,
      vector: doc.vector,
    }));

    const { table, created } = await this.getOrCreateTable(rows);
    if (!created) {
      await table.add(rows);
    }
  }

  async search(query: VectorSearchQuery): Promise<VectorSearchResult[]> {
    if (query.k <= 0) return [];

    const table = await this.getTableIfExists();
    if (!table) return [];

    const safeUserId = escapeSqlStringLiteral(query.userId);
    const rows = (await table
      .vectorSearch(query.vector)
      .where(`user_id = '${safeUserId}'`)
      .limit(query.k)
      .toArray()) as LanceRow[];

    return rows.map((row) => ({
      chunkId: row.chunk_id,
      userId: row.user_id,
      text: row.text,
      vector: row.vector,
      distance: row._distance,
    }));
  }

  private async getConnection(): Promise<Connection> {
    if (!this.connectionPromise) {
      this.connectionPromise = lancedb.connect(this.options.uri);
    }
    return this.connectionPromise;
  }

  private async getTableIfExists(): Promise<Table | null> {
    if (this.table) return this.table;

    const connection = await this.getConnection();
    try {
      this.table = await connection.openTable(this.options.tableName);
      return this.table;
    } catch {
      return null;
    }
  }

  private async getOrCreateTable(
    initialRows: LanceRow[]
  ): Promise<{ table: Table; created: boolean }> {
    if (this.table) return { table: this.table, created: false };

    const connection = await this.getConnection();
    let created = false;
    try {
      this.table = await connection.openTable(this.options.tableName);
    } catch {
      this.table = await connection.createTable(this.options.tableName, initialRows);
      created = true;
    }
    if (!this.table) {
      throw new Error(`Failed to open or create LanceDB table '${this.options.tableName}'`);
    }
    return { table: this.table, created };
  }
}
