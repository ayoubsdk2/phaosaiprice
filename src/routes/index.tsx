import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Mic, Workflow, Atom, Layers, ArrowRight, Check } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Choose Your Solution — Phaos AI" },
      {
        name: "description",
        content:
          "Pick your Phaos AI growth path: AI Voice Agents, Agentic Workflow Automation, Sunesis quantum research, or fully integrated bundles.",
      },
      { property: "og:title", content: "Choose Your Solution — Phaos AI" },
      {
        property: "og:description",
        content:
          "Tailored AI solutions that grow with your business. Pick a path and we'll match the pricing.",
      },
    ],
  }),
  component: SolutionsPage,
});

type SolutionId = "voice" | "workflow" | "sunesis" | "bundles";

interface Solution {
  id: SolutionId;
  title: string;
  tagline: string;
  description: string;
  icon: typeof Mic;
  bullets: string[];
  cta: string;
  inquirySlug?: string;
}

const SOLUTIONS: Solution[] = [
  {
    id: "voice",
    title: "AI Voice Agents",
    tagline: "Inbound + outbound voice automation",
    description:
      "Deploy intelligent AI agents to manage your call volume — managed minutes, additional lines, and per-band pricing tuned to your operation.",
    icon: Mic,
    bullets: [
      "Managed minutes with per-band overage rates",
      "Call forwarding & AI voice agent lines on demand",
      "Foreign-language add-ons, 24×7 operability",
      "Live customer support within 24 hours",
    ],
    cta: "View Pricing",
  },
  {
    id: "workflow",
    title: "Agentic Workflow Automation",
    tagline: "Replace the manual grind",
    description:
      "End-to-end agentic automation that eliminates multi-step, paper-heavy processes and excessive touchpoints across your operation.",
    icon: Workflow,
    bullets: [
      "Custom-scoped to your workflows",
      "Integrates with your existing tools",
      "Human-free automation with full audit trail",
      "Scales with your business needs",
    ],
    cta: "Request Information",
    inquirySlug: "agentic-workflow-automation",
  },
  {
    id: "sunesis",
    title: "Sunesis",
    tagline: "Quantum-assisted research & intelligence",
    description:
      "Strategically leverage the power of quantum computing for research, modeling, and decision intelligence tailored to your domain.",
    icon: Atom,
    bullets: [
      "Domain-specific research engagements",
      "Quantum-assisted modeling",
      "Decision intelligence dashboards",
      "Confidential, white-glove delivery",
    ],
    cta: "Request Information",
    inquirySlug: "sunesis",
  },
  {
    id: "bundles",
    title: "Bundles",
    tagline: "Combined solutions, tailored to you",
    description:
      "Mix Voice Agents, Agentic Workflows, and Sunesis into a single engagement. We'll architect the right combination and price it accordingly.",
    icon: Layers,
    bullets: [
      "Cross-solution architecture",
      "Single point of contact",
      "Volume-based pricing",
      "Unified onboarding",
    ],
    cta: "Request Information",
    inquirySlug: "bundles",
  },
];

function SolutionsPage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<SolutionId>("voice");
  const current = SOLUTIONS.find((s) => s.id === selected)!;

  const handleContinue = () => {
    if (current.id === "voice") {
      navigate({ to: "/pricing" });
    } else if (current.inquirySlug) {
      navigate({ to: "/inquiry/$solution", params: { solution: current.inquirySlug } });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />

      <main className="flex-1">
        <section className="mx-auto w-full max-w-6xl px-6 pt-20 pb-12 text-center">
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight">
            Choose Your <span className="text-gradient-primary">Solution</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base sm:text-lg text-muted-foreground">
            Tailored solutions that grow with your business. Pick a path and we'll match the pricing.
          </p>
        </section>

        <section className="mx-auto w-full max-w-6xl px-6 pb-20">
          <div className="grid gap-5 lg:grid-cols-2 lg:items-stretch">
            {/* 2x2 cards — total area matches the info panel */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {SOLUTIONS.map((sol) => {
                const Icon = sol.icon;
                const active = selected === sol.id;
                return (
                  <button
                    key={sol.id}
                    onClick={() => setSelected(sol.id)}
                    className={cn(
                      "group text-left rounded-2xl border-2 p-6 transition-all flex flex-col",
                      active
                        ? "gradient-primary border-primary text-primary-foreground shadow-[var(--shadow-purple)]"
                        : "border-primary/60 bg-background hover:border-primary hover:bg-surface/50",
                    )}
                  >
                    <Icon className={cn("h-6 w-6 mb-3", active ? "" : "text-primary")} />
                    <div className="font-semibold text-base">{sol.title}</div>
                    <div
                      className={cn(
                        "text-sm mt-1",
                        active ? "text-primary-foreground/85" : "text-muted-foreground",
                      )}
                    >
                      {sol.tagline}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Info panel */}
            <div className="rounded-2xl border-2 border-primary/60 bg-background p-7 flex flex-col">
              <div className="flex items-center gap-2">
                <current.icon className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-semibold">{current.title}</h2>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{current.description}</p>
              <ul className="mt-5 space-y-2.5">
                {current.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={handleContinue}
                className="mt-auto pt-6 inline-flex items-center justify-center gap-2"
              >
                <span className="inline-flex w-full items-center justify-center gap-2 rounded-xl gradient-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-purple)] transition hover:opacity-95">
                  {current.cta}
                  <ArrowRight className="h-4 w-4" />
                </span>
              </button>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
