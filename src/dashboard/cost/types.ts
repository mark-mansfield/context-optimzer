/**
 * Supported LLM providers for cost calculation.
 */
export type ProviderId = "groq" | "anthropic" | "openai";

/**
 * Price in USD per 1 million tokens (input and output).
 */
export interface ProviderPricing {
  inputPerM: number;
  outputPerM: number;
}

/**
 * Pricing configuration keyed by provider.
 */
export type PricingConfig = Record<ProviderId, ProviderPricing>;
