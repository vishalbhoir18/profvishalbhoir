"use client";

import { useRef, type MouseEvent } from "react";
import { usePageTransition } from "@/components/providers/TransitionProvider";
import { basePath } from "@/lib/utils";

/** Renders post HTML; internal links use the animated page transition. */
export function Prose({ html }: { html: string }) {
  const navigate = usePageTransition();
  const ref = useRef<HTMLDivElement>(null);
  const onClick = (e: MouseEvent) => {
    const a = (e.target as HTMLElement).closest("a[data-internal]") as HTMLAnchorElement | null;
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    const href = a.getAttribute("href") ?? "/";
    navigate(basePath && href.startsWith(basePath) ? href.slice(basePath.length) || "/" : href);
  };
  return (
    <div
      ref={ref}
      onClick={onClick}
      className="prose prose-invert prose-site prose-lg max-w-none prose-headings:tracking-[-0.03em] prose-h2:mt-14 prose-p:leading-relaxed"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
