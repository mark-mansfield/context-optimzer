import type { PricingConfig } from "./types";

/**
 * Default pricing in USD per 1M tokens.
 * Update from provider docs when rates change.
 *
 * Sources (representative; check latest):
 * - OpenAI: https://platform.openai.com/docs/pricing (e.g. GPT-4o: $2.50/1M in, $10/1M out)
 * - Anthropic: https://www.anthropic.com/pricing (e.g. Claude 3.5: ~$3/1M in, ~$15/1M out)
 * - Groq: https://console.groq.com/docs/pricing (representative rates; often lower)
 */
export const DEFAULT_PRICING: PricingConfig = {
  groq: { inputPerM: 0.05, outputPerM: 0.08 },
  anthropic: { inputPerM: 3, outputPerM: 15 },
  openai: { inputPerM: 2.5, outputPerM: 10 },
};
