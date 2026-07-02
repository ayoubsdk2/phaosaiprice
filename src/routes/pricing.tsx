import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  Minus,
  Plus,
  ArrowRight,
  ArrowLeft,
  Globe,
  Headphones,
  Mail,
  Clock,
  PhoneCall,
  Layers,
  Zap,
  CheckCircle2,
} from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { cn } from "@/lib/utils";
import {
  BASE_MONTHLY,
  BASE_INCLUDED_MIN,
  IMPLEMENTATION_FEE,
  FORWARDING_LINE_MONTHLY,
  VOICE_AGENT_LINE_MONTHLY,
  VOICE_AGENT_LINE_IMPL,
  LANGUAGE_MONTHLY,
  INTEGRATION_MONTHLY,
  INTEGRATION_IMPL,
  BLOCK_MINUTES,
  BLOCK_PRICE,
  BLOCK_RATE,
  MAX_BLOCKS,
  calcUsageCost,
  marginalRate,
  formatUSD,
} from "@/lib/pricing";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "AI Voice Core Pricing — Phaos AI" },
      {
        name: "description",
        content:
          "Phaos AI Voice Core: month-to-month, usage-based pricing. Configure minutes, lines, languages, integrations, and committed capacity blocks to see your live estimate.",
      },
      { property: "og:title", content: "AI Voice Core Pricing — Phaos AI" },
      {
        property: "og:description",
        content:
          "Month-to-month AI voice answering. Pay for what you use, with optional prepaid capacity blocks at $0.20/minute.",
      },
    ],
  }),
  component: PricingPage,
});

const PROBLEMS_SOLVED = [
  "Missed inbound calls and after-hours leads lost to voicemail",
  "Staff pulled off priority work to answer phones across locations",
  "High cost and churn of training receptionists on legacy systems",
  "Manual re-keying of every call into your ERP / CRM",
  "Dirty data from mistyped serials, meter reads, and equipment numbers",
  "8–10 AM morning hold spikes and high call abandonment rates",
  'Repetitive "where is my tech?" status calls clogging service lines',
  "Unbillable tech rolls for issues customers could self-resolve",
  "Toner shipped to out-of-contract or unauthorized devices",
  "After-hours SLA breaches triggering client penalties",
  'Rigid "press 1 for service" IVRs frustrating your customers',
  "No scalable multilingual support for diverse workplaces",
  "Peace of mind to refocus leadership on growth, not phones",
];

function PricingPage() {
  const navigate = useNavigate();
  const [minutes, setMinutes] = useState<number>(500);
  const [forwardingLines, setForwardingLines] = useState(0);
  const [voiceAgentLines, setVoiceAgentLines] = useState(0);
  const [languages, setLanguages] = useState(0);
  const [integrations, setIntegrations] = useState(0);
  const [blocks, setBlocks] = useState(0);
  const [monthlyCalls, setMonthlyCalls] = useState<number>(250);

  // monthly line items
  const usageCost = calcUsageCost(minutes, blocks);
  const forwardingMonthly = forwardingLines * FORWARDING_LINE_MONTHLY;
  const voiceAgentMonthly = voiceAgentLines * VOICE_AGENT_LINE_MONTHLY;
  const languagesMonthly = languages * LANGUAGE_MONTHLY;
  const integrationsMonthly = integrations * INTEGRATION_MONTHLY;
  const monthlyTotal =
    BASE_MONTHLY +
    usageCost +
    forwardingMonthly +
    voiceAgentMonthly +
    languagesMonthly +
    integrationsMonthly;

  // one-time
  const implementationFee =
    IMPLEMENTATION_FEE +
    voiceAgentLines * VOICE_AGENT_LINE_IMPL +
    integrations * INTEGRATION_IMPL;
  const blocksPrepaid = blocks * BLOCK_PRICE;

  const marginal = marginalRate(minutes, blocks);
  

  const estCallMinutes = monthlyCalls * 2;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />

      <main className="flex-1">
        <div className="mx-auto w-full max-w-6xl px-6 pt-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition"
          >
            <ArrowLeft className="h-4 w-4" /> Go Back
          </Link>
        </div>

        <section className="mx-auto w-full max-w-6xl px-6 pt-6 pb-10 text-center">
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight">
            Find Your <span className="text-gradient-primary">Perfect Plan</span>
          </h1>
        </section>

        <section className="mx-auto w-full max-w-6xl px-6 pb-12">
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-[var(--shadow-purple)]">
            <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
              {/* LEFT — Configure */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold">
                    Core Platform Access{" "}
                    <span className="text-muted-foreground font-medium text-lg">
                      (Month-to-Month)
                    </span>
                  </h2>
                </div>

                {/* Minutes slider */}
                <div>
                  <div className="flex items-baseline justify-between mb-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Minutes Per Month
                    </p>
                    <div className="text-right">
                      <span className="text-3xl font-bold tabular-nums text-foreground">
                        {minutes.toLocaleString()}
                      </span>
                      <span className="text-sm text-muted-foreground ml-1">/ mo</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={5000}
                    step={5}
                    value={Math.min(5000, Math.max(5, minutes))}
                    onChange={(e) => setMinutes(Number(e.target.value))}
                    style={{
                      ["--val" as string]: `${((Math.min(5000, Math.max(5, minutes)) - 5) / (5000 - 5)) * 100}%`,
                    }}
                    className="phaos-range w-full"
                    aria-label="Minutes per month"
                  />
                  <div className="mt-2 flex justify-between text-xs text-muted-foreground tabular-nums">
                    <span>5</span>
                    <span>5,000+</span>
                  </div>
                </div>

                {/* Add-ons */}
                <div className="space-y-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Add-on lines & languages
                  </p>

                  <Stepper
                    label="Additional Call Forwarding Lines"
                    sub="$10/mo each"
                    value={forwardingLines}
                    onChange={setForwardingLines}
                    max={20}
                  />

                  <Stepper
                    label="Additional AI Voice Agent Lines"
                    sub="$50/mo each + $249 one-time implementation"
                    value={voiceAgentLines}
                    onChange={setVoiceAgentLines}
                    max={20}
                  />

                  <Stepper
                    label="Foreign Language Add-on"
                    sub="$99/mo per language"
                    value={languages}
                    onChange={setLanguages}
                    max={10}
                    icon={<Globe className="h-4 w-4 text-primary" />}
                  />
                </div>

                {/* Integrations */}
                <div className="space-y-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Integrations
                  </p>
                  <Stepper
                    label="Integrations"
                    sub="$249/mo each + $499 one-time implementation per integration"
                    value={integrations}
                    onChange={setIntegrations}
                    max={20}
                    icon={<Zap className="h-4 w-4 text-primary" />}
                  />
                </div>

                {/* Committed Capacity Blocks */}
                <div className="rounded-3xl border-2 border-primary/50 bg-gradient-to-br from-primary/5 to-transparent p-6 shadow-[var(--shadow-purple)]">
                  <div className="flex items-center gap-2 mb-2">
                    <Layers className="h-5 w-5 text-primary" />
                    <h3 className="font-bold text-lg">Committed Capacity Blocks</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Pre-fund your infrastructure to lock in our lowest rate of{" "}
                    <span className="font-semibold text-foreground">$0.20/minute</span>.
                    Valid for 12 months. Any usage exceeding these blocks reverts
                    to our standard month-to-month usage-based rates.
                  </p>

                  <div className="mt-4">
                    <Stepper
                      label="Capacity Blocks"
                      sub={`Blocks of ${BLOCK_MINUTES.toLocaleString()} minutes at ${formatUSD(
                        BLOCK_PRICE,
                      )} each · up to ${MAX_BLOCKS} (${(
                        MAX_BLOCKS * BLOCK_MINUTES
                      ).toLocaleString()} min)`}
                      value={blocks}
                      onChange={setBlocks}
                      max={MAX_BLOCKS}
                    />
                  </div>

                  {blocks > 0 && (
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full gradient-primary px-3 py-1 text-xs font-bold text-primary-foreground shadow-[var(--shadow-purple)]">
                        <Zap className="h-3.5 w-3.5" />
                        Effective Rate: $0.20/min Locked
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {(blocks * BLOCK_MINUTES).toLocaleString()} prepaid
                        minutes · {formatUSD(blocksPrepaid)} one-time
                      </span>
                    </div>
                  )}
                </div>

                {/* Included */}
                <div className="rounded-2xl border border-border bg-surface p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                    Included with every plan
                  </p>
                  <ul className="grid gap-2 sm:grid-cols-3 text-sm">
                    <li className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-primary" /> Email Forwarding
                    </li>
                    <li className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" /> Customized Answer
                      Times
                    </li>
                    <li className="flex items-center gap-2">
                      <Headphones className="h-4 w-4 text-primary" /> Live Support
                      &lt; 24hrs
                    </li>
                  </ul>
                </div>
              </div>

              {/* RIGHT — Dynamic Estimate */}
              <div className="lg:sticky lg:top-24 self-start space-y-5">
                {/* Estimate card */}
                <div className="rounded-3xl gradient-primary p-6 text-primary-foreground shadow-[var(--shadow-purple)]">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-base font-semibold uppercase tracking-wider text-primary-foreground/90">
                      Estimated Monthly Investment
                    </h3>
                  </div>

                  <div className="mt-4 text-5xl sm:text-6xl font-bold tracking-tight tabular-nums">
                    {formatUSD(Math.round(monthlyTotal))}
                    <span className="text-lg font-medium text-primary-foreground/80">
                      {" "}
                      /mo
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-primary-foreground/85">
                    {minutes.toLocaleString()} minutes selected · base includes{" "}
                    {BASE_INCLUDED_MIN} min
                  </p>

                  <div className="my-5 h-px bg-white/25" />

                  <div className="space-y-2 text-sm">
                    <Row
                      label="Base Platform"
                      value={`${formatUSD(BASE_MONTHLY)}/mo`}
                    />
                    <Row
                      label="Estimated Overage / Usage"
                      value={`${formatUSD(Math.round(usageCost * 100) / 100)}/mo`}
                    />
                    {forwardingMonthly > 0 && (
                      <Row
                        label={`Forwarding lines × ${forwardingLines}`}
                        value={`+${formatUSD(forwardingMonthly)}/mo`}
                      />
                    )}
                    {voiceAgentMonthly > 0 && (
                      <Row
                        label={`Voice agent lines × ${voiceAgentLines}`}
                        value={`+${formatUSD(voiceAgentMonthly)}/mo`}
                      />
                    )}
                    {languagesMonthly > 0 && (
                      <Row
                        label={`Languages × ${languages}`}
                        value={`+${formatUSD(languagesMonthly)}/mo`}
                      />
                    )}
                    {integrationsMonthly > 0 && (
                      <Row
                        label={`Integration Fees × ${integrations}`}
                        value={`+${formatUSD(integrationsMonthly)}/mo`}
                      />
                    )}
                  </div>

                  <div className="my-5 h-px bg-white/25" />

                  <div className="space-y-2 text-sm">
                    <Row
                      label="One-Time Implementation Fee"
                      value={formatUSD(implementationFee)}
                    />
                    {blocksPrepaid > 0 && (
                      <Row
                        label={`Capacity Blocks (prepaid) × ${blocks}`}
                        value={formatUSD(blocksPrepaid)}
                      />
                    )}
                    <Row
                      label="Current Marginal Rate"
                      value={`$${marginal.toFixed(2)}/min`}
                    />
                  </div>

                  <button
                    onClick={() =>
                      navigate({
                        to: "/inquiry/$solution",
                        params: { solution: "voice-core" },
                      })
                    }
                    className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-white/90"
                  >
                    Get Started Now <ArrowRight className="h-4 w-4" />
                  </button>
                </div>

                {/* Calls calculator */}
                <div className="rounded-3xl border-2 border-primary/40 bg-card p-6 shadow-[var(--shadow-purple)]">
                  <div className="flex items-center gap-2 text-primary">
                    <PhoneCall className="h-5 w-5" />
                    <h3 className="font-bold text-lg">
                      Input Your Average Monthly Calls
                    </h3>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    We estimate 2 minutes per call.
                  </p>

                  <div className="mt-4 flex items-center gap-2">
                    <input
                      type="number"
                      min={0}
                      step={10}
                      value={monthlyCalls}
                      onChange={(e) => {
                        const v = Math.max(0, Number(e.target.value) || 0);
                        setMonthlyCalls(v);
                        setMinutes(Math.min(5000, Math.max(5, v * 2)));
                      }}
                      className="w-32 rounded-lg border border-border bg-background px-3 py-2 text-foreground font-semibold tabular-nums focus:outline-none focus:border-primary"
                    />
                    <span className="text-sm text-muted-foreground">
                      calls / month
                    </span>
                  </div>

                  <div className="mt-3 text-sm text-muted-foreground">
                    Estimated minutes / month:{" "}
                    <span className="font-bold text-foreground tabular-nums">
                      {estCallMinutes.toLocaleString()}
                    </span>{" "}
                    — applied to the slider above.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mic-drop: You Are Solving Multiple Problems */}
        <section className="mx-auto w-full max-w-6xl px-6 pb-20">
          <div className="rounded-3xl border-2 border-primary/40 bg-gradient-to-br from-primary/5 via-card to-card p-8 sm:p-12 shadow-[var(--shadow-purple)]">
            <div className="text-center mb-8">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                You Are Solving{" "}
                <span className="text-gradient-primary">Multiple Problems</span>
              </h2>
              <p className="mt-3 text-base text-muted-foreground max-w-2xl mx-auto">
                One platform replaces an entire stack of frustrations — quietly,
                 every hour of every day.
              </p>
            </div>

            <ul className="grid gap-4 sm:grid-cols-2 text-base">
              {PROBLEMS_SOLVED.map((p) => (
                <li key={p} className="flex gap-3 items-start">
                  <CheckCircle2
                    className="h-6 w-6 shrink-0 text-primary mt-0.5"
                    aria-hidden
                  />
                  <span className="text-foreground leading-snug">{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-baseline gap-3">
      <span className="text-primary-foreground/90">{label}</span>
      <span className="font-bold text-primary-foreground tabular-nums whitespace-nowrap">
        {value}
      </span>
    </div>
  );
}

function Stepper({
  label,
  sub,
  value,
  onChange,
  max,
  icon,
}: {
  label: string;
  sub: string;
  value: number;
  onChange: (n: number) => void;
  max: number;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-border bg-surface p-4">
      <div className="min-w-0 pr-3">
        <div className="flex items-center gap-2 font-medium text-sm">
          {icon}
          {label}
        </div>
        <div className="mt-0.5 text-xs text-muted-foreground">{sub}</div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={() => onChange(Math.max(0, value - 1))}
          disabled={value <= 0}
          className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-background transition hover:border-primary/60 hover:text-primary disabled:opacity-40"
          aria-label="Decrease"
        >
          <Minus className="h-4 w-4" />
        </button>
        <div className="w-9 text-center font-semibold tabular-nums">{value}</div>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-background transition hover:border-primary/60 hover:text-primary disabled:opacity-40"
          aria-label="Increase"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
