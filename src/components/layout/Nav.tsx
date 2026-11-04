"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { nav, site } from "@content/site";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { useLenis } from "@/components/providers/SmoothScroll";
import { cn } from "@/lib/utils";

export function Nav() {
  const pathname = usePathname();
  const lenis = useLenis();
  const bar = useRef<HTMLElement>(null);
  const progress = useRef<HTMLDivElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Hide on scroll down, reveal on scroll up; thin progress line.
  useGSAP(
    () => {
      const show = gsap.quickTo(bar.current, "yPercent", { duration: 0.45, ease: "power3.out" });
      const root = document.documentElement;
      let hidden = false;
      const setHidden = (h: boolean) => {
        if (h === hidden) return;
        hidden = h;
        show(h ? -110 : 0);
        // Lets sticky UI (e.g. the publication filters) slide up into the nav's space.
        root.style.setProperty("--nav-offset", h ? "0px" : "var(--nav-h)");
      };
      root.style.setProperty("--nav-offset", "var(--nav-h)");
      const st = ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          setScrolled(self.scroll() > 24);
          if (open) return;
          setHidden(self.direction === 1 && self.scroll() > 240);
          if (progress.current) progress.current.style.transform = `scaleX(${self.progress})`;
        },
      });
      return () => st.kill();
    },
    { dependencies: [open, pathname] },
  );

  // Mobile menu animation.
  useGSAP(
    () => {
      if (!menu.current) return;
      const items = menu.current.querySelectorAll("[data-menu-item]");
      if (open) {
        lenis?.stop();
        gsap.set(menu.current, { visibility: "visible" });
        gsap.fromTo(menu.current, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 0.7, ease: "expo.inOut" });
        gsap.fromTo(items, { yPercent: 110 }, { yPercent: 0, stagger: 0.05, duration: 0.8, delay: 0.25, ease: "expo.out" });
      } else {
        lenis?.start();
        gsap.to(menu.current, {
          clipPath: "inset(0 0 100% 0)",
          duration: 0.55,
          ease: "expo.inOut",
          onComplete: () => {
            if (menu.current) gsap.set(menu.current, { visibility: "hidden" });
          },
        });
      }
    },
    { dependencies: [open] },
  );

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const isActive = (href: string) => pathname.startsWith(href.replace(/\/$/, ""));

  return (
    <>
      <a
        href="#main"
        className="sr-only z-[90] rounded-full bg-fg px-4 py-2 text-sm text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <header
        ref={bar}
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-500",
          scrolled || open ? "glass border-b border-line" : "border-b border-transparent",
        )}
      >
        <nav className="container-x flex h-[var(--nav-h)] items-center justify-between" aria-label="Primary">
          <TransitionLink href="/" className="group flex items-center gap-3" aria-label={`${site.honorific} ${site.name}, home`}>
            <Monogram />
            <span className="hidden text-[15px] font-medium tracking-tight text-fg/90 transition-colors group-hover:text-fg sm:block">
              {site.honorific} {site.name}
            </span>
          </TransitionLink>

          <ul className="hidden items-center gap-1 md:flex">
            {nav.map((item) => (
              <li key={item.href}>
                <TransitionLink
                  href={item.href}
                  className={cn(
                    "relative rounded-full px-3.5 py-1.5 text-[13px] tracking-wide transition-colors",
                    isActive(item.href) ? "text-fg" : "text-muted hover:text-fg",
                  )}
                  aria-current={isActive(item.href) ? "page" : undefined}
                >
                  {isActive(item.href) && <span className="absolute inset-0 -z-10 rounded-full bg-white/[0.08]" />}
                  {item.label}
                </TransitionLink>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="relative grid h-10 w-10 place-items-center md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            <span className={cn("absolute h-px w-5 bg-fg transition-transform duration-500 ease-[var(--ease-out-expo)]", open ? "rotate-45" : "-translate-y-[4px]")} />
            <span className={cn("absolute h-px w-5 bg-fg transition-transform duration-500 ease-[var(--ease-out-expo)]", open ? "-rotate-45" : "translate-y-[4px]")} />
          </button>
        </nav>
        <div className="absolute inset-x-0 bottom-0 h-px overflow-hidden">
          <div ref={progress} className="h-full origin-left scale-x-0 [background:var(--grad)]" />
        </div>
      </header>

      <div
        id="mobile-menu"
        ref={menu}
        className="fixed inset-0 z-40 flex flex-col justify-end bg-ink px-[var(--gutter)] pb-12 pt-24 md:hidden"
        style={{ visibility: "hidden", clipPath: "inset(0 0 100% 0)" }}
        aria-hidden={!open}
      >
        <ul className="space-y-1">
          {[{ label: "Home", href: "/" }, ...nav].map((item, i) => (
            <li key={item.href} className="overflow-hidden">
              <TransitionLink
                data-menu-item
                href={item.href}
                tabIndex={open ? 0 : -1}
                className="flex items-baseline gap-4 py-1 text-[2.6rem] font-semibold leading-tight tracking-[-0.03em]"
              >
                <span className="font-mono text-xs text-dim">{String(i).padStart(2, "0")}</span>
                {item.label}
              </TransitionLink>
            </li>
          ))}
        </ul>
        <p className="mt-10 text-sm text-muted">{site.email}</p>
      </div>
    </>
  );
}

export function Monogram({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative grid h-8 w-8 place-items-center overflow-hidden rounded-[10px] border border-white/15 bg-white/[0.04] text-[11px] font-semibold tracking-[0.04em]",
        className,
      )}
    >
      <span className="absolute inset-0 opacity-70 [background:conic-gradient(from_180deg,#5eead4,#a78bfa,#f472b6,#5eead4)] [mask:radial-gradient(circle_at_70%_20%,black,transparent_65%)]" />
      <span className="relative">{site.shortName}</span>
    </span>
  );
}
