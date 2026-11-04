"use client";

import { useRef, useState, type FormEvent } from "react";
import { gsap } from "@/lib/gsap";
import { site } from "@content/site";
import { cn } from "@/lib/utils";

type Status = "idle" | "sending" | "sent" | "error";
const topics = ["Research collaboration", "Ph.D. / M.Sc. admission", "Invited talk / event", "Media", "Something else"];

/**
 * Static-host-friendly contact form.
 * With `site.formspreeId` set it posts to Formspree (no server needed);
 * otherwise it opens the visitor's mail app with everything pre-filled.
 */
export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [topic, setTopic] = useState(topics[0]);
  const form = useRef<HTMLFormElement>(null);
  const done = useRef<HTMLDivElement>(null);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    if (data.get("_gotcha")) return; // bot honeypot
    data.set("topic", topic);

    if (!site.formspreeId) {
      const body = `${data.get("message")}\n\n— ${data.get("name")} (${data.get("email")})${data.get("affiliation") ? `, ${data.get("affiliation")}` : ""}`;
      window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(`[Website] ${topic}`)}&body=${encodeURIComponent(body)}`;
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch(`https://formspree.io/f/${site.formspreeId}`, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("sent");
      requestAnimationFrame(() => {
        gsap.fromTo(done.current, { opacity: 0, scale: 0.96, y: 20 }, { opacity: 1, scale: 1, y: 0, duration: 1, ease: "expo.out" });
        gsap.fromTo("[data-check]", { strokeDashoffset: 60 }, { strokeDashoffset: 0, duration: 1, delay: 0.3, ease: "power3.inOut" });
      });
      form.current?.reset();
    } catch {
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <div ref={done} className="flex min-h-[420px] flex-col items-start justify-center rounded-[28px] border border-line bg-surface p-10">
        <svg viewBox="0 0 48 48" className="h-14 w-14" fill="none" stroke="#5eead4" strokeWidth="2.5" aria-hidden>
          <circle cx="24" cy="24" r="22" stroke="rgba(94,234,212,0.3)" />
          <path data-check d="M14 25l7 7 13-15" strokeDasharray="60" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <p className="mt-6 text-3xl font-semibold tracking-[-0.03em]">Message sent.</p>
        <p className="mt-2 text-muted">Thank you. I usually reply within a few working days.</p>
        <button type="button" onClick={() => setStatus("idle")} className="mt-8 text-sm text-teal hover:underline">
          Send another message
        </button>
      </div>
    );
  }

  const field =
    "peer w-full rounded-2xl border border-white/12 bg-surface-2 px-5 pb-3 pt-7 text-[15px] text-fg placeholder-transparent transition-colors focus:border-teal/60 focus:outline-none";
  const label =
    "pointer-events-none absolute left-5 top-2.5 text-xs text-dim transition-all peer-placeholder-shown:top-[1.15rem] peer-placeholder-shown:text-[15px] peer-focus:top-2.5 peer-focus:text-xs peer-focus:text-teal";

  return (
    <form ref={form} onSubmit={onSubmit} className="space-y-4" noValidate={false}>
      <fieldset>
        <legend className="eyebrow mb-4">What’s it about?</legend>
        <div className="flex flex-wrap gap-2">
          {topics.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTopic(t)}
              aria-pressed={topic === t}
              className={cn(
                "rounded-full border px-4 py-2 text-sm transition-colors duration-300",
                topic === t ? "border-fg bg-fg text-ink" : "border-white/15 text-muted hover:border-white/40 hover:text-fg",
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </fieldset>
      <div className="grid gap-4 pt-4 sm:grid-cols-2">
        <div className="relative">
          <input id="cf-name" name="name" required autoComplete="name" placeholder="Name" className={field} />
          <label htmlFor="cf-name" className={label}>
            Your name
          </label>
        </div>
        <div className="relative">
          <input id="cf-email" name="email" type="email" required autoComplete="email" placeholder="Email" className={field} />
          <label htmlFor="cf-email" className={label}>
            Email address
          </label>
        </div>
      </div>
      <div className="relative">
        <input id="cf-aff" name="affiliation" autoComplete="organization" placeholder="Affiliation" className={field} />
        <label htmlFor="cf-aff" className={label}>
          Institution / organisation (optional)
        </label>
      </div>
      <div className="relative">
        <textarea id="cf-msg" name="message" required rows={6} placeholder="Message" className={cn(field, "resize-y")} />
        <label htmlFor="cf-msg" className={label}>
          Your message
        </label>
      </div>
      <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <div className="flex flex-wrap items-center gap-6 pt-2">
        <button
          type="submit"
          disabled={status === "sending"}
          className="group inline-flex items-center gap-3 rounded-full bg-fg px-7 py-4 text-[15px] font-medium text-ink transition-all hover:bg-white disabled:opacity-60"
        >
          {status === "sending" ? "Sending…" : site.formspreeId ? "Send message" : "Compose email"}
          <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
        </button>
        {status === "error" && (
          <p role="alert" className="text-sm text-pink">
            Something went wrong. Please email{" "}
            <a className="underline" href={`mailto:${site.email}`}>
              {site.email}
            </a>
            .
          </p>
        )}
      </div>
    </form>
  );
}
