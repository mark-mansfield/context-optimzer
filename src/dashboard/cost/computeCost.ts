import type { ProviderId, PricingConfig } from "./types";
import { DEFAULT_PRICING } from "./pricing";
import { toFiniteNonNegative } from "./normalize";

/**
 * Computes estimated cost in USD for a given provider and token counts.
 *
 * @param provider - Provider id (groq, anthropic, openai).
 * @param inputTokens - Number of input tokens.
 * @param outputTokens - Number of output tokens.
 * @param config - Optional pricing override; uses DEFAULT_PRICING when omitted.
 * @returns Cost in dollars. Returns 0 if provider is unknown or token values are invalid.
 */
export function computeCost(
  provider: ProviderId,
  inputTokens: number,
  outputTokens: number,
  config: PricingConfig = DEFAULT_PRICING
): number {
  const pricing = config[provider as keyof typeof config];
  if (pricing == null) return 0;
  const inT = toFiniteNonNegative(inputTokens);
  const outT = toFiniteNonNegative(outputTokens);
  const inputCost = (inT / 1_000_000) * pricing.inputPerM;
  const outputCost = (outT / 1_000_000) * pricing.outputPerM;
  return inputCost + outputCost;
}
