import { Link } from "@tanstack/react-router";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-lg font-bold tracking-tight">
            Phaos{" "}
            <span className="text-gradient-primary italic font-bold inline-block pr-[0.15em]">
              AI
            </span>
          </span>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <Link
            to="/"
            className="rounded-md px-3 py-1.5 text-muted-foreground transition hover:text-foreground"
            activeOptions={{ exact: true }}
            activeProps={{ className: "rounded-md px-3 py-1.5 text-foreground" }}
          >
            Solutions
          </Link>
          <Link
            to="/pricing"
            className="rounded-md px-3 py-1.5 text-muted-foreground transition hover:text-foreground"
            activeProps={{ className: "rounded-md px-3 py-1.5 text-foreground" }}
          >
            Voice Agent Pricing
          </Link>
          <a
            href="https://www.phaosai.com"
            className="rounded-md px-3 py-1.5 text-muted-foreground transition hover:text-foreground"
          >
            phaosai.com ↗
          </a>
        </nav>
      </div>
    </header>
  );
}
