# Pricing Refactor: Dynamic Usage-Based Model

Move Phaos AI Voice Core to a single month-to-month, usage-based product. Remove all tier identity (Spark/Ignite/Catalyst/Ascend/Custom) from UI and pricing math. Replace with a continuous minutes slider, an integrations counter, committed capacity blocks, and a live-recalculating estimate card.

## 1. Fix logo clipping (`SiteHeader.tsx`, `SiteFooter.tsx`)

- Change `Phaos <span italic>AI</span>` → `<strong>Phaos <em class="text-gradient-primary not-italic font-bold italic">AI</em></strong>` style: bold weight, add `pr-0.5` / `inline-block` and `leading-tight` on the gradient span so the italic right edge of "I" isn't clipped by the gradient text bounding box. Use `pr-[0.15em]` on the italic span (gradient text clipping fix).

## 2. Rewrite `src/lib/pricing.ts`

Delete `BANDS`, `Commitment`, `calcPricing`, `recommendBandIndexForMinutes`, `estimateMonthlyForMinutes`, all band/forwarding/agent/language constants tied to bands.

New module:

```ts
export const BASE_MONTHLY = 199;          // includes 250 min
export const BASE_INCLUDED_MIN = 250;
export const IMPLEMENTATION_FEE = 499;    // base one-time
export const VOICE_AGENT_LINE_MONTHLY = 50;
export const VOICE_AGENT_LINE_IMPL = 249; // additive to impl fee
export const FORWARDING_LINE_MONTHLY = 10;
export const LANGUAGE_MONTHLY = 99;
export const INTEGRATION_MONTHLY = 249;
export const INTEGRATION_IMPL = 499;
export const BLOCK_MINUTES = 5000;
export const BLOCK_PRICE = 1000;          // $0.20/min
export const BLOCK_RATE = 0.20;
export const MAX_BLOCKS = 10;             // 50,000 minutes

// Graduated standard overage tiers (per minute over 250 included)
export const OVERAGE_TIERS = [
  { upTo: 750,  rate: 0.50, label: "251–750"   },
  { upTo: 1500, rate: 0.40, label: "751–1,500" },
  { upTo: 3000, rate: 0.35, label: "1,501–3,000" },
  { upTo: Infinity, rate: 0.25, label: "3,001+" },
];

export function statusLabel(minutes: number): string { /* Spark/Ignite/... derived from minutes for badge only */ }
export function marginalRate(minutes: number, blocksRemaining: number): number;
export function calcUsageCost(minutes: number, blocks: number): number;  // applies block override then graduated
export function formatUSD(n: number): string;
```

Status label is for the badge only (e.g. ≤250 Spark, ≤750 Ignite, ≤1500 Catalyst, ≤3000 Ascend, >3000 Enterprise). No pricing depends on it.

## 3. Rewrite `src/routes/pricing.tsx`

Remove: BandPicker, commitment toggles, `Commitment` references, problems list narrow column, plan comparison table & FEATURES data, Black Ops One display font usage for tier names, sticky right column tier branding, all per-band caps.

State:

```ts
const [minutes, setMinutes] = useState(500);          // 0..5000 step 5
const [forwardingLines, setForwardingLines] = useState(0);
const [voiceAgentLines, setVoiceAgentLines] = useState(0);
const [languages, setLanguages] = useState(0);
const [integrations, setIntegrations] = useState(0);
const [blocks, setBlocks] = useState(0);              // 0..10
const [monthlyCalls, setMonthlyCalls] = useState(200);
```

Calls input drives `minutes = calls * 2` when changed (but slider can override; bidirectional — calls input writes minutes, slider writes minutes; we display estMinutes derived from calls separately).

Layout (two columns on lg):

### Left: Configure Your Plan

- H2 "Core Platform Access (Month-to-Month)"
- Continuous slider: native `<input type="range" min=5 max=5000 step=5>` styled with Tailwind (purple track + thumb). Show numeric current value above slider, end labels "5" / "5,000+". No tier milestones.
- Stepper: Additional Call Forwarding Lines ($10/mo)
- Stepper: Additional AI Voice Agent Lines ($50/mo + $249 implementation each)
- Stepper: Foreign Language Add-on ($99/mo)
- **New section** H3 "Integrations" — Stepper: $249/mo + $499 one-time each
- **New premium card** "Committed Capacity Blocks": description, Stepper (0..10) × 5,000 min @ $1,000; if `blocks>0` show purple badge "Effective Rate: $0.20/min Locked".
- Keep "Included with every plan" card.

### Right (sticky): Estimated Monthly Investment

Dynamic purple card:
- Header "Estimated Monthly Investment"
- Badge "Status: {statusLabel(minutes)}"
- Large `formatUSD(monthlyTotal)` `/mo`
- Line items:
  - Base Platform: $199/mo (includes 250 min)
  - Estimated Overage/Usage: $X.XX
  - Forwarding lines / Voice agent lines / Languages (when >0)
  - Integration Fees: $X/mo (when >0)
  - One-Time Implementation Fee: $X (= 499 + 249·agents + 499·integrations)
  - Current Marginal Rate: $0.XX/min
- CTA button → `/inquiry/voice-core`

Usage cost math:
1. `over = max(0, minutes - 250)`
2. `blockMin = blocks * 5000`
3. If `blockMin > 0`: consume `min(over, blockMin)` at $0.20 — but blocks are *pre-funded* (already paid via one-time? or monthly?). Per spec: blocks are pre-funded infrastructure valid 12 months. Treat block purchase as separate one-time line: "Capacity Blocks (prepaid): $X" shown under Implementation. Minutes covered by remaining blocks contribute $0 to monthly overage. Remaining minutes beyond blocks use graduated standard tiers.
4. Marginal rate = rate of the next minute (block rate if blocks remain, else graduated tier rate at current minutes).

### Below the card: Input Your Average Monthly Calls (kept)

Same component — writing calls updates `minutes` (`setMinutes(calls*2)`). Remove "Recommended plan" tier name; show "Estimated minutes: N → drives slider above."

### Bottom: "You Are Solving Multiple Problems" — full-width mic-drop section

- Full width (outside grid), 2-column responsive grid of bullets
- Each bullet: custom inline SVG checkmark in Phaos purple (`text-primary`) — render as a circle-check (Lucide `CheckCircle2` with `className="text-primary"`) instead of green emoji
- Larger typography, generous spacing, subtle purple gradient background panel

### Removed entirely

- Commitment toggle row
- BandPicker
- Plan comparison `FEATURES` table and all its rendering
- Black Ops One display font usage for tier names (font import in `__root.tsx` can stay or be removed; remove the `font-display` usages)

## 4. Inquiry route param

Update CTA target from `ai-voice-agents-{band.id}` / `custom-voice-agent-plan` to a single `voice-core` slug. `src/routes/inquiry.$solution.tsx` already accepts arbitrary slug — verify no hardcoded switch needed (will check during implementation; add label mapping if present).

## Files touched

- `src/components/SiteHeader.tsx` — logo clipping fix
- `src/components/SiteFooter.tsx` — logo clipping fix
- `src/lib/pricing.ts` — full rewrite
- `src/routes/pricing.tsx` — full rewrite of body; keep route meta, SiteHeader/Footer, Stepper helper

## Out of scope

- Landing page (`index.tsx`)
- Inquiry form behavior / backend
- Styling tokens in `styles.css` (keep light theme)
