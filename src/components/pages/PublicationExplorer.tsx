"use client";

import { useDeferredValue, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Flip, gsap, prefersReducedMotion } from "@/lib/gsap";
import type { Publication, PubType } from "@/lib/publications";
import { typeLabel } from "@/lib/publications";
import { site } from "@content/site";
import { cn } from "@/lib/utils";

const owner = site.name.split(" ").pop() ?? "";

const apa = (p: Publication) =>
  `${p.authors.join(", ")} (${p.year}). ${p.title}. ${p.venue}.${p.doi ? ` https://doi.org/${p.doi}` : p.url ? ` ${p.url}` : ""}`;

const bibtex = (p: Publication) => {
  const key = `${(p.authors[0] ?? "anon").split(" ").pop()?.toLowerCase()}${p.year}${p.title.split(" ")[0].toLowerCase().replace(/\W/g, "")}`;
  const kind = p.type === "chapter" ? "incollection" : p.type === "conference" ? "inproceedings" : p.type === "patent" ? "misc" : "article";
  const venueField = p.type === "chapter" ? "booktitle" : p.type === "conference" ? "booktitle" : "journal";
  return [
    `@${kind}{${key},`,
    `  title = {${p.title}},`,
    `  author = {${p.authors.join(" and ")}},`,
    `  ${venueField} = {${p.venue}},`,
    `  year = {${p.year}},`,
    p.doi ? `  doi = {${p.doi}},` : null,
    p.url ? `  url = {${p.url}},` : null,
    `}`,
  ]
    .filter(Boolean)
    .join("\n");
};

type Sort = "new" | "old";

export function PublicationExplorer({ items }: { items: Publication[] }) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<PubType | "all">("all");
  const [topic, setTopic] = useState<string>("all");
  const [sort, setSort] = useState<Sort>("new");
  const [open, setOpen] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const q = useDeferredValue(query);

  const list = useRef<HTMLDivElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const types = useMemo(() => Array.from(new Set(items.map((p) => p.type))), [items]);
  const topics = useMemo(() => Array.from(new Set(items.flatMap((p) => p.topics))).sort(), [items]);

  const filtered = useMemo(() => {
    const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    const res = items.filter((p) => {
      if (type !== "all" && p.type !== type) return false;
      if (topic !== "all" && !p.topics.includes(topic)) return false;
      if (!terms.length) return true;
      const hay = `${p.title} ${p.authors.join(" ")} ${p.venue} ${p.year} ${p.topics.join(" ")} ${p.abstract ?? ""}`.toLowerCase();
      return terms.every((t) => hay.includes(t));
    });
    return res.sort((a, b) => (sort === "new" ? b.year - a.year : a.year - b.year) || a.title.localeCompare(b.title));
  }, [items, q, type, topic, sort]);

  const groups = useMemo(() => {
    const m = new Map<number, Publication[]>();
    filtered.forEach((p) => m.set(p.year, [...(m.get(p.year) ?? []), p]));
    return Array.from(m.entries());
  }, [filtered]);

  /** Capture layout before a state change so Flip can animate to the new one. */
  const capture = () => {
    if (!list.current || prefersReducedMotion()) return;
    flipState.current = Flip.getState(list.current.querySelectorAll("[data-flip-id]"));
  };

  useLayoutEffect(() => {
    if (!flipState.current) return;
    Flip.from(flipState.current, {
      duration: 0.7,
      ease: "expo.out",
      nested: true,
      prune: true,
      onEnter: (els) => gsap.fromTo(els, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.03, ease: "expo.out" }),
    });
    flipState.current = null;
  }, [filtered, open]);

  // Initial reveal.
  useLayoutEffect(() => {
    if (!list.current || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo("[data-pub]", { opacity: 0, y: 40 }, { opacity: 1, y: 0, stagger: 0.04, duration: 1, ease: "expo.out", delay: 0.4 });
    }, list);
    return () => ctx.revert();
  }, []);

  const copy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setToast(`${label} copied to clipboard`);
    } catch {
      setToast("Couldn't access the clipboard");
    }
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  };

  const chip = (active: boolean) =>
    cn(
      "rounded-full border px-3.5 py-1.5 text-[13px] transition-colors duration-300",
      active ? "border-fg bg-fg text-ink" : "border-white/15 text-muted hover:border-white/40 hover:text-fg",
    );

  const reset = () => {
    capture();
    setQuery("");
    setType("all");
    setTopic("all");
  };

  return (
    <div className="container-x pb-32">
      {/* Controls */}
      <div className="sticky top-[var(--nav-offset,var(--nav-h))] z-20 transition-[top] duration-500 ease-[var(--ease-out-expo)] -mx-[var(--gutter)] border-b border-line bg-ink/80 px-[var(--gutter)] py-5 backdrop-blur-xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <label className="relative block w-full lg:max-w-md">
            <span className="sr-only">Search publications</span>
            <svg aria-hidden viewBox="0 0 24 24" className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-dim" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(e) => {
                capture();
                setQuery(e.target.value);
              }}
              placeholder="Search title, author, journal, topic…"
              className="w-full rounded-full border border-white/12 bg-surface-2 py-3 pl-11 pr-4 text-[15px] text-fg placeholder:text-dim focus:border-teal/60 focus:outline-none"
            />
          </label>
          <div className="flex items-center gap-3 text-sm text-muted">
            <span aria-live="polite" className="tabular-nums">
              {filtered.length} of {items.length}
            </span>
            <span className="h-4 w-px bg-white/15" />
            <button
              type="button"
              onClick={() => {
                capture();
                setSort((s) => (s === "new" ? "old" : "new"));
              }}
              className="rounded-full px-3 py-1.5 transition-colors hover:bg-white/5 hover:text-fg"
            >
              {sort === "new" ? "Newest first ↓" : "Oldest first ↑"}
            </button>
          </div>
        </div>
        <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto pb-1">
          <button type="button" className={chip(type === "all")} onClick={() => (capture(), setType("all"))}>
            All types
          </button>
          {types.map((t) => (
            <button key={t} type="button" className={chip(type === t)} onClick={() => (capture(), setType(t))} aria-pressed={type === t}>
              {typeLabel[t]}
            </button>
          ))}
        </div>
        <div className="no-scrollbar mt-2 flex gap-2 overflow-x-auto pb-1">
          <button type="button" className={chip(topic === "all")} onClick={() => (capture(), setTopic("all"))}>
            All topics
          </button>
          {topics.map((t) => (
            <button key={t} type="button" className={chip(topic === t)} onClick={() => (capture(), setTopic(t))} aria-pressed={topic === t}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div ref={list} className="relative mt-6">
        {groups.length === 0 && (
          <div className="py-24 text-center">
            <p className="text-2xl font-semibold tracking-tight">No matching publications.</p>
            <button type="button" onClick={reset} className="mt-4 text-teal hover:underline">
              Clear filters
            </button>
          </div>
        )}
        {groups.map(([year, pubs]) => (
          <section key={year} data-flip-id={`y-${year}`} className="grid gap-2 border-b border-line py-8 md:grid-cols-[160px_1fr] md:gap-10">
            <h2 className="text-4xl font-semibold tracking-[-0.04em] text-dim md:sticky md:top-[calc(var(--nav-offset,var(--nav-h))+13rem)] md:self-start md:transition-[top] md:duration-500">{year}</h2>
            <ul className="space-y-2">
              {pubs.map((p) => (
                <li key={p.id} data-flip-id={p.id} data-pub className="group rounded-2xl border border-transparent p-5 transition-colors duration-300 hover:border-line hover:bg-surface md:p-6">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-white/[0.06] px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.15em] text-muted">{typeLabel[p.type]}</span>
                    {p.featured && <span className="rounded-full bg-teal/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.15em] text-teal">Featured</span>}
                  </div>
                  <h3 className="text-lg font-semibold leading-snug tracking-[-0.015em] md:text-xl">{p.title}</h3>
                  <p className="mt-2 text-sm text-muted">
                    {p.authors.map((a, k) => (
                      <span key={k} className={a.includes(owner) ? "font-medium text-fg" : undefined}>
                        {a}
                        {k < p.authors.length - 1 ? ", " : ""}
                      </span>
                    ))}
                  </p>
                  <p className="mt-1 text-sm italic text-dim">{p.venue}</p>

                  {open === p.id && p.abstract && <p className="mt-4 max-w-3xl border-l-2 border-teal/50 pl-4 text-[15px] leading-relaxed text-fg/80">{p.abstract}</p>}

                  <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px]">
                    {p.abstract && (
                      <button
                        type="button"
                        onClick={() => {
                          capture();
                          setOpen((o) => (o === p.id ? null : p.id));
                        }}
                        aria-expanded={open === p.id}
                        className="text-fg/80 hover:text-teal"
                      >
                        {open === p.id ? "Hide abstract" : "Abstract"}
                      </button>
                    )}
                    <button type="button" onClick={() => copy(apa(p), "APA citation")} className="text-fg/80 hover:text-teal">
                      Cite
                    </button>
                    <button type="button" onClick={() => copy(bibtex(p), "BibTeX")} className="text-fg/80 hover:text-teal">
                      BibTeX
                    </button>
                    {p.doi && (
                      <a href={`https://doi.org/${p.doi}`} target="_blank" rel="noopener noreferrer" className="text-teal hover:underline">
                        DOI ↗
                      </a>
                    )}
                    {p.url && !p.doi && (
                      <a href={p.url} target="_blank" rel="noopener noreferrer" className="text-teal hover:underline">
                        Link ↗
                      </a>
                    )}
                    <span className="ml-auto hidden gap-2 md:flex">
                      {p.topics.map((t) => (
                        <span key={t} className="text-dim">
                          #{t.toLowerCase().replace(/\s+/g, "-")}
                        </span>
                      ))}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <div
        role="status"
        className={cn(
          "glass fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full border border-line px-5 py-3 text-sm transition-all duration-500 ease-[var(--ease-out-expo)]",
          toast ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0",
        )}
      >
        {toast}
      </div>
    </div>
  );
}
