"use client";

import { useLenis } from "@/components/providers/SmoothScroll";

export function BackToTop() {
  const lenis = useLenis();
  return (
    <button
      type="button"
      onClick={() => (lenis ? lenis.scrollTo(0, { duration: 2 }) : window.scrollTo({ top: 0, behavior: "smooth" }))}
      className="group inline-flex items-center gap-2 text-dim transition-colors hover:text-fg"
    >
      Back to top
      <span className="inline-block transition-transform duration-500 group-hover:-translate-y-1" aria-hidden>
        ↑
      </span>
    </button>
  );
}
