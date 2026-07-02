// Phaos AI Voice Core — month-to-month, usage-based pricing.

export const BASE_MONTHLY = 199; // includes BASE_INCLUDED_MIN minutes
export const BASE_INCLUDED_MIN = 250;
export const IMPLEMENTATION_FEE = 499; // base one-time

export const FORWARDING_LINE_MONTHLY = 10;
export const VOICE_AGENT_LINE_MONTHLY = 50;
export const VOICE_AGENT_LINE_IMPL = 249; // additive to implementation
export const LANGUAGE_MONTHLY = 99;

export const INTEGRATION_MONTHLY = 249;
export const INTEGRATION_IMPL = 499; // additive to implementation

export const BLOCK_MINUTES = 5000;
export const BLOCK_PRICE = 1000; // = $0.20/min prepaid
export const BLOCK_RATE = 0.2;
export const MAX_BLOCKS = 10; // up to 50,000 prepaid minutes

export interface OverageTier {
  upTo: number;
  rate: number;
  label: string;
}

// Graduated standard overage tiers applied to minutes ABOVE BASE_INCLUDED_MIN.
export const OVERAGE_TIERS: OverageTier[] = [
  { upTo: 750, rate: 0.5, label: "251–750" },
  { upTo: 1500, rate: 0.4, label: "751–1,500" },
  { upTo: 3000, rate: 0.35, label: "1,501–3,000" },
  { upTo: Number.POSITIVE_INFINITY, rate: 0.25, label: "3,001+" },
];

export function formatUSD(n: number): string {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: n % 1 === 0 ? 0 : 2,
  });
}

/** Friendly status label derived from minutes — display only, no pricing impact. */
export function statusLabel(minutes: number): string {
  if (minutes <= BASE_INCLUDED_MIN) return "Spark";
  if (minutes <= 750) return "Ignite";
  if (minutes <= 1500) return "Catalyst";
  if (minutes <= 3000) return "Ascend";
  return "Enterprise";
}

/** Standard graduated cost of `overMinutes` (minutes above the included base). */
function graduatedCost(overMinutes: number): number {
  if (overMinutes <= 0) return 0;
  let remaining = overMinutes;
  let cursor = BASE_INCLUDED_MIN; // absolute minute counter
  let total = 0;
  for (const tier of OVERAGE_TIERS) {
    const tierCapacity = Math.max(0, tier.upTo - cursor);
    const take = Math.min(remaining, tierCapacity);
    total += take * tier.rate;
    remaining -= take;
    cursor += take;
    if (remaining <= 0) break;
  }
  return total;
}

/**
 * Usage cost per month for `minutes`. Committed blocks (already prepaid as a
 * one-time line) cover overage at $0 incremental until depleted; anything
 * beyond depleted blocks reverts to the graduated standard tiers.
 */
export function calcUsageCost(minutes: number, blocks: number): number {
  const over = Math.max(0, minutes - BASE_INCLUDED_MIN);
  const blockMin = blocks * BLOCK_MINUTES;
  const beyondBlocks = Math.max(0, over - blockMin);
  if (beyondBlocks === 0) return 0;
  // graduated cost on the minutes after the blocks are consumed
  const start = BASE_INCLUDED_MIN + Math.min(over, blockMin);
  let remaining = beyondBlocks;
  let cursor = start;
  let total = 0;
  for (const tier of OVERAGE_TIERS) {
    if (cursor >= tier.upTo) continue;
    const tierCapacity = tier.upTo - cursor;
    const take = Math.min(remaining, tierCapacity);
    total += take * tier.rate;
    remaining -= take;
    cursor += take;
    if (remaining <= 0) break;
  }
  return total;
}

/** Marginal $/minute of the NEXT minute at the current configuration. */
export function marginalRate(minutes: number, blocks: number): number {
  if (minutes < BASE_INCLUDED_MIN) return 0;
  const over = Math.max(0, minutes - BASE_INCLUDED_MIN);
  const blockMin = blocks * BLOCK_MINUTES;
  if (over < blockMin) return BLOCK_RATE;
  const absolute = minutes;
  for (const tier of OVERAGE_TIERS) {
    if (absolute < tier.upTo) return tier.rate;
  }
  return OVERAGE_TIERS[OVERAGE_TIERS.length - 1].rate;
}

// silence unused-export lint if graduatedCost ends up unused externally
export { graduatedCost };
