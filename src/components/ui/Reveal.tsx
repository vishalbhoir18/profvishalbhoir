"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

type Props = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** Animate these descendants (staggered) instead of the wrapper itself. */
  selector?: string;
  delay?: number;
  stagger?: number;
  y?: number;
  blur?: boolean;
  start?: string;
  id?: string;
};

/** Fades + lifts content into view as it scrolls in (Apple-style). */
export function Reveal({
  children,
  as: Tag = "div",
  className,
  selector,
  delay = 0,
  stagger = 0.08,
  y = 48,
  blur = false,
  start = "top 88%",
  id,
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const targets = selector ? Array.from(el.querySelectorAll<HTMLElement>(selector)) : [el];
      if (prefersReducedMotion()) {
        gsap.set([el, ...targets], { opacity: 1 });
        return;
      }
      if (selector) gsap.set(el, { opacity: 1 });
      gsap.fromTo(
        targets,
        { opacity: 0, y, filter: blur ? "blur(10px)" : "none" },
        {
          opacity: 1,
          y: 0,
          filter: blur ? "blur(0px)" : "none",
          duration: 1.3,
          ease: "expo.out",
          stagger,
          delay,
          ...(blur ? { clearProps: "filter" } : {}),
          scrollTrigger: { trigger: el, start, once: true },
        },
      );
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} id={id} data-reveal className={className}>
      {children}
    </Tag>
  );
}
