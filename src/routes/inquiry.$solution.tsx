import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { submitInquiry } from "@/lib/inquiry.functions";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/inquiry/$solution")({
  head: ({ params }) => {
    const title = prettySolution(params.solution);
    return {
      meta: [
        { title: `${title} — Inquire · Phaos AI` },
        {
          name: "description",
          content: `Tell us about your ${title} needs and our team will get back to you.`,
        },
        { property: "og:title", content: `${title} — Phaos AI Inquiry` },
      ],
    };
  },
  component: InquiryPage,
});

function prettySolution(slug: string): string {
  return slug
    .split("-")
    .map((w) => (w.length <= 3 ? w.toUpperCase() : w[0].toUpperCase() + w.slice(1)))
    .join(" ");
}

function InquiryPage() {
  const { solution } = Route.useParams();
  const navigate = useNavigate();
  const title = prettySolution(solution);
  const submit = useServerFn(submitInquiry);

  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    message: "",
  });
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: async () => {
      return submit({
        data: {
          solution: title,
          name: form.name,
          company: form.company || null,
          email: form.email,
          phone: form.phone || null,
          message: form.message,
        },
      });
    },
    onError: (e: Error) => setError(e.message ?? "Something went wrong."),
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (form.name.trim().length < 1) return setError("Please enter your name.");
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) return setError("Please enter a valid email.");
    if (form.message.trim().length < 10)
      return setError("Tell us a bit more — at least 10 characters.");

    mutation.mutate();
  };

  if (mutation.isSuccess) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <SiteHeader />
        <main className="flex-1 mx-auto w-full max-w-2xl px-6 py-24 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full gradient-primary shadow-[var(--shadow-purple)]">
            <CheckCircle2 className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="mt-6 text-3xl font-bold">Inquiry sent</h1>
          <p className="mt-3 text-muted-foreground">
            Thanks, {form.name.split(" ")[0] || "friend"}. Daniel and the Phaos AI team will be in touch shortly.
          </p>
          <button
            onClick={() => navigate({ to: "/" })}
            className="mt-8 inline-flex items-center gap-2 rounded-xl gradient-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-purple)]"
          >
            <ArrowLeft className="h-4 w-4" /> Back to solutions
          </button>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1 mx-auto w-full max-w-3xl px-6 pt-16 pb-12">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to solutions
        </Link>

        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full gradient-primary px-4 py-1.5 text-xs font-medium text-primary-foreground shadow-[var(--shadow-purple)]">
            <Sparkles className="h-3.5 w-3.5" /> Inquiry
          </div>
          <h1 className="mt-5 text-4xl sm:text-5xl font-bold tracking-tight">
            Let's talk <span className="text-gradient-primary">{title}</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Tell us what you're looking to accomplish. The more detail you share, the sharper our
            response.
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="mt-10 space-y-5 rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-2xl"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="Full name *"
              value={form.name}
              onChange={(v) => setForm((f) => ({ ...f, name: v }))}
              placeholder="Jane Doe"
              required
            />
            <Field
              label="Company"
              value={form.company}
              onChange={(v) => setForm((f) => ({ ...f, company: v }))}
              placeholder="Acme Inc."
            />
            <Field
              label="Email *"
              value={form.email}
              onChange={(v) => setForm((f) => ({ ...f, email: v }))}
              placeholder="you@company.com"
              type="email"
              required
            />
            <Field
              label="Phone"
              value={form.phone}
              onChange={(v) => setForm((f) => ({ ...f, phone: v }))}
              placeholder="+1 555 555 5555"
              type="tel"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Tell us what you're looking to accomplish *
            </label>
            <textarea
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              placeholder="What are the workflows, volumes, integrations, timelines, or outcomes you're targeting? The more detail the better."
              rows={10}
              maxLength={5000}
              required
              className="w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 resize-y min-h-[220px]"
            />
            <div className="mt-1 text-right text-xs text-muted-foreground">
              {form.message.length} / 5000
            </div>
          </div>

          {error && (
            <div className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive-foreground">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={mutation.isPending}
            className={cn(
              "inline-flex w-full items-center justify-center gap-2 rounded-xl gradient-primary px-5 py-4 text-base font-semibold text-primary-foreground shadow-[var(--shadow-purple)] transition",
              mutation.isPending ? "opacity-70" : "hover:opacity-95",
            )}
          >
            {mutation.isPending ? "Sending…" : "Let's Do This!"}
            {!mutation.isPending && <ArrowRight className="h-5 w-5" />}
          </button>

          <p className="text-center text-xs text-muted-foreground">
            Your message goes straight to daniel@phaosai.com.
          </p>
        </form>
      </main>
      <SiteFooter />
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
      />
    </label>
  );
}
