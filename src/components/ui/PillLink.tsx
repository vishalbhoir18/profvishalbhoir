"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { TransitionLink } from "./TransitionLink";
import { cn, isInternal } from "@/lib/utils";

type Props = {
  href: string;
  children: ReactNode;
  variant?: "solid" | "ghost";
  className?: string;
  magnetic?: boolean;
  download?: boolean;
};

/** Pill button with an arrow and an optional magnetic hover. */
export function PillLink({ href, children, variant = "solid", className, magnetic = true, download }: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || !magnetic || window.matchMedia("(hover: none)").matches) return;
      const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "elastic.out(1, 0.4)" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "elastic.out(1, 0.4)" });
      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        xTo((e.clientX - (r.left + r.width / 2)) * 0.25);
        yTo((e.clientY - (r.top + r.height / 2)) * 0.35);
      };
      const leave = () => {
        xTo(0);
        yTo(0);
      };
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", leave);
      return () => {
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerleave", leave);
      };
    },
    { scope: ref },
  );

  const cls = cn(
    "group relative inline-flex items-center gap-3 overflow-hidden rounded-full px-6 py-3.5 text-[15px] font-medium tracking-tight transition-colors duration-300",
    variant === "solid" ? "bg-fg text-ink hover:bg-white" : "border border-white/20 text-fg hover:border-white/50",
    className,
  );
  const inner = (
    <>
      <span className="relative">{children}</span>
      <span className="relative grid h-6 w-6 place-items-center overflow-hidden rounded-full bg-current/10" aria-hidden>
        <span className="absolute transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-6">→</span>
        <span className="absolute -translate-x-6 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-0">→</span>
      </span>
    </>
  );

  return (
    <span ref={ref} className="inline-block">
      {isInternal(href) && !download ? (
        <TransitionLink href={href} className={cls}>
          {inner}
        </TransitionLink>
      ) : (
        <a
          href={href}
          className={cls}
          download={download || undefined}
          {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {inner}
        </a>
      )}
    </span>
  );
}
