"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { students } from "@content/site";
import { cn } from "@/lib/utils";

type Tab = "current" | "alumni";

/** Current scholars / alumni switcher with a sliding pill indicator. */
export function StudentTabs() {
  const [tab, setTab] = useState<Tab>("current");
  const pill = useRef<HTMLSpanElement>(null);
  const btns = useRef<Record<Tab, HTMLButtonElement | null>>({ current: null, alumni: null });
  const list = useRef<HTMLUListElement>(null);

  useLayoutEffect(() => {
    const b = btns.current[tab];
    if (b && pill.current) gsap.to(pill.current, { x: b.offsetLeft, width: b.offsetWidth, duration: 0.6, ease: "expo.out" });
    if (list.current) gsap.fromTo(list.current.children, { opacity: 0, y: 24 }, { opacity: 1, y: 0, stagger: 0.06, duration: 0.8, ease: "expo.out" });
  }, [tab]);

  const rows = tab === "current" ? students.current : students.alumni;

  return (
    <div>
      <div role="tablist" aria-label="Students" className="relative inline-flex rounded-full border border-line bg-surface p-1">
        <span ref={pill} aria-hidden className="absolute left-0 top-1 h-[calc(100%-8px)] rounded-full bg-fg" />
        {(["current", "alumni"] as Tab[]).map((t) => (
          <button
            key={t}
            ref={(el) => {
              btns.current[t] = el;
            }}
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={cn("relative z-10 rounded-full px-5 py-2 text-sm transition-colors duration-300", tab === t ? "text-ink" : "text-muted hover:text-fg")}
          >
            {t === "current" ? `Current (${students.current.length})` : `Alumni (${students.alumni.length})`}
          </button>
        ))}
      </div>

      <ul ref={list} role="tabpanel" className="mt-10 border-t border-line">
        {rows.map((s) => (
          <li key={s.name} className="grid gap-2 border-b border-line py-7 md:grid-cols-[240px_1fr_auto] md:items-baseline md:gap-10">
            <div>
              <p className="text-lg font-medium tracking-tight">{s.name}</p>
              <p className="font-mono text-xs text-dim">
                {s.degree} · {tab === "current" ? `since ${s.since}` : `graduated ${s.since}`}
              </p>
            </div>
            <p className="text-fg/80">{s.topic}</p>
            {"now" in s && <p className="text-sm text-teal">{(s as { now: string }).now}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}
