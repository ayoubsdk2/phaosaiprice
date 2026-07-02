import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const InquirySchema = z.object({
  solution: z.string().trim().min(1).max(100),
  name: z.string().trim().min(1).max(200),
  company: z.string().trim().max(200).optional().nullable(),
  email: z.string().trim().email().max(320),
  phone: z.string().trim().max(50).optional().nullable(),
  message: z.string().trim().min(10).max(5000),
});

export type InquiryInput = z.infer<typeof InquirySchema>;

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export const submitInquiry = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => InquirySchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { error: insertError } = await supabaseAdmin
      .from("solution_inquiries")
      .insert({
        solution: data.solution,
        name: data.name,
        company: data.company ?? null,
        email: data.email,
        phone: data.phone ?? null,
        message: data.message,
      });

    if (insertError) {
      console.error("Inquiry insert error", insertError);
      throw new Error("Could not save your inquiry. Please try again.");
    }

    const lovableKey = process.env.LOVABLE_API_KEY;
    const resendKey = process.env.RESEND_API_KEY;

    if (lovableKey && resendKey) {
      const html = `
        <div style="font-family:system-ui,sans-serif;line-height:1.5;color:#111">
          <h2 style="margin:0 0 12px">New Phaos AI inquiry — ${escapeHtml(data.solution)}</h2>
          <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
          ${data.company ? `<p><strong>Company:</strong> ${escapeHtml(data.company)}</p>` : ""}
          <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
          ${data.phone ? `<p><strong>Phone:</strong> ${escapeHtml(data.phone)}</p>` : ""}
          <p><strong>Message:</strong></p>
          <div style="white-space:pre-wrap;padding:12px;background:#f5f5f7;border-radius:8px">${escapeHtml(data.message)}</div>
        </div>`;

      try {
        const res = await fetch("https://connector-gateway.lovable.dev/resend/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${lovableKey}`,
            "X-Connection-Api-Key": resendKey,
          },
          body: JSON.stringify({
            from: "Phaos AI <onboarding@resend.dev>",
            to: ["daniel@phaosai.com"],
            reply_to: data.email,
            subject: `New ${data.solution} inquiry from ${data.name}`,
            html,
          }),
        });
        if (!res.ok) {
          console.error("Resend send failed", res.status, await res.text());
        }
      } catch (err) {
        console.error("Resend send error", err);
      }
    } else {
      console.warn("Email not sent: LOVABLE_API_KEY or RESEND_API_KEY missing");
    }

    return { ok: true as const };
  });
