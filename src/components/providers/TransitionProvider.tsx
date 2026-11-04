"use client";

import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { nav, site } from "@content/site";
import { useLenis } from "./SmoothScroll";

type Navigate = (href: string) => void;
const TransitionContext = createContext<Navigate>(() => {});
export const usePageTransition = () => useContext(TransitionContext);

const normalise = (p: string) => (p.endsWith("/") ? p : p + "/");
const titleFor = (href: string) => {
  const path = normalise(href.split(/[?#]/)[0]);
  if (path === "/") return site.name;
  const hit = nav.find((n) => path.startsWith(n.href));
  return hit?.label ?? site.name;
};

/**
 * Cinematic page transitions for the App Router:
 *  1. a curtain sweeps up and covers the page (showing the destination title),
 *  2. the route changes underneath,
 *  3. the curtain lifts away and the new page animates in.
 */
export function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const lenis = useLenis();
  const curtain = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const pending = useRef<string | null>(null);
  const busy = useRef(false);

  const reveal = useCallback(() => {
    const el = curtain.current;
    if (!el) return;
    lenis?.scrollTo(0, { immediate: true, force: true });
    window.scrollTo(0, 0);
    // Let the new route paint and measure before lifting the curtain.
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      gsap
        .timeline({
          onComplete: () => {
            busy.current = false;
            lenis?.start();
            gsap.set(el, { visibility: "hidden" });
          },
        })
        .to(label.current, { yPercent: -120, opacity: 0, duration: 0.45, ease: "power3.in" })
        .to(el, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.85, ease: "expo.inOut" }, "-=0.15");
    });
  }, [lenis]);

  // Route committed → lift the curtain.
  useEffect(() => {
    if (pending.current !== null) {
      pending.current = null;
      reveal();
    }
  }, [pathname, reveal]);

  const navigate = useCallback<Navigate>(
    (href) => {
      const target = normalise(href.split(/[?#]/)[0]);
      if (target === normalise(pathname) && !href.includes("#")) {
        lenis?.scrollTo(0, { duration: 1.2 });
        return;
      }
      if (busy.current) return;
      if (prefersReducedMotion() || !curtain.current) {
        router.push(href);
        return;
      }
      busy.current = true;
      lenis?.stop();
      const el = curtain.current;
      if (label.current) label.current.textContent = titleFor(href);
      gsap
        .timeline({
          onComplete: () => {
            pending.current = href;
            router.push(href, { scroll: false });
          },
        })
        .set(el, { visibility: "visible", clipPath: "inset(100% 0% 0% 0%)" })
        .set(label.current, { yPercent: 120, opacity: 0 })
        .to(el, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.7, ease: "expo.inOut" })
        .to(label.current, { yPercent: 0, opacity: 1, duration: 0.5, ease: "power3.out" }, "-=0.25");
      // Warm the route while the curtain moves.
      router.prefetch(href);
    },
    [pathname, router, lenis],
  );

  return (
    <TransitionContext.Provider value={navigate}>
      {children}
      <div
        ref={curtain}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[70] flex items-center justify-center bg-[#050506]"
        style={{ visibility: "hidden", clipPath: "inset(100% 0% 0% 0%)" }}
      >
        <div className="absolute inset-0 opacity-60 [background:radial-gradient(60%_50%_at_50%_60%,rgba(94,234,212,0.10),transparent_70%)]" />
        <span className="overflow-hidden px-6 py-2">
          <span
            ref={label}
            className="block text-[clamp(2.5rem,8vw,6rem)] font-semibold tracking-[-0.04em] text-fg"
          />
        </span>
      </div>
    </TransitionContext.Provider>
  );
}
