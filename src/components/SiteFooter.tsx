export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 py-10 mt-20">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-6 text-center">
        <div className="text-xl font-bold tracking-tight">
          Phaos{" "}
          <span className="text-gradient-primary italic font-bold inline-block pr-[0.15em]">
            AI
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          AI Voice, Agentic Workflows & Quantum Research
        </p>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Phaos AI. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
