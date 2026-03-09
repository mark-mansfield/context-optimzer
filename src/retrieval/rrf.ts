export interface RrfOptions {
  /** RRF hyperparameter (default 60). */
  k?: number;
}

export interface RrfResult {
  id: string;
  score: number;
  firstSeenListIndex: number;
  firstSeenRank: number;
}

/**
 * Reciprocal Rank Fusion over ranked ID lists.
 * score(id) = sum(1 / (k + rank)) where rank is 1-based.
 */
export function reciprocalRankFusion(
  rankedLists: ReadonlyArray<ReadonlyArray<string>>,
  options: RrfOptions = {}
): RrfResult[] {
  const k = options.k ?? 60;
  const scoreById = new Map<string, RrfResult>();

  rankedLists.forEach((list, listIndex) => {
    list.forEach((id, zeroBasedRank) => {
      const rank = zeroBasedRank + 1;
      const add = 1 / (k + rank);
      const existing = scoreById.get(id);
      if (!existing) {
        scoreById.set(id, {
          id,
          score: add,
          firstSeenListIndex: listIndex,
          firstSeenRank: rank,
        });
        return;
      }
      existing.score += add;
    });
  });

  return [...scoreById.values()].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (a.firstSeenListIndex !== b.firstSeenListIndex) {
      return a.firstSeenListIndex - b.firstSeenListIndex;
    }
    return a.firstSeenRank - b.firstSeenRank;
  });
}
