"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { assaySteps } from "@content/site";
import { asset, cn } from "@/lib/utils";

/** Pre-rendered frames (see scripts/render-assets.mjs). */
export const FRAMES = { count: 120, dir: "/frames/assay", width: 1600, height: 900 };
const frameSrc = (i: number) => asset(`${FRAMES.dir}/${String(i + 1).padStart(4, "0")}.webp`);

/**
 * Act II: the Apple "image sequence" technique.
 * A pinned <canvas> paints one of 120 pre-rendered frames of a petri-dish
 * assay according to scroll position: inhibition zones grow as you scroll.
 */
export function FrameSequence() {
  const root = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const images = useRef<HTMLImageElement[]>([]);
  const current = useRef(0);
  const [step, setStep] = useState(0);
  const [loaded, setLoaded] = useState(0);

  const draw = (index: number) => {
    const c = canvas.current;
    const ctx = c?.getContext("2d");
    if (!c || !ctx) return;
    // Nearest frame that has finished loading.
    let img: HTMLImageElement | undefined;
    for (let d = 0; d < FRAMES.count; d++) {
      const a = images.current[index - d];
      const b = images.current[index + d];
      if (a?.complete && a.naturalWidth) { img = a; break; }
      if (b?.complete && b.naturalWidth) { img = b; break; }
    }
    if (!img) return;
    const cw = c.width;
    const ch = c.height;
    const portrait = cw / ch < 1;
    const scale = portrait
      ? (cw * 1.75) / img.naturalWidth
      : Math.max(cw / img.naturalWidth, ch / img.naturalHeight) * 0.92;
    const w = img.naturalWidth * scale;
    const h = img.naturalHeight * scale;
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, cw, ch);
    ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
  };

  // Size the canvas to the viewport (crisp on retina, capped for memory).
  useEffect(() => {
    const c = canvas.current;
    if (!c) return;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      c.width = Math.round(c.clientWidth * dpr);
      c.height = Math.round(c.clientHeight * dpr);
      draw(current.current);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(c);
    return () => ro.disconnect();
  }, []);

  // Progressive preload: first frame now, the rest when we get close.
  useEffect(() => {
    const load = (i: number) =>
      new Promise<void>((res) => {
        if (images.current[i]) return res();
        const img = new Image();
        img.decoding = "async";
        img.src = frameSrc(i);
        images.current[i] = img;
        img.onload = () => {
          setLoaded((n) => n + 1);
          if (Math.abs(i - current.current) < 3) draw(current.current);
          res();
        };
        img.onerror = () => res();
      });
    load(0);
    let started = false;
    const io = new IntersectionObserver(
      async ([e]) => {
        if (!e.isIntersecting || started) return;
        started = true;
        io.disconnect();
        // Coarse pass first (every 8th frame) so scrubbing is never blank, then fill in.
        const order = [...Array(FRAMES.count).keys()].sort((a, b) => (a % 8 === 0 ? -1 : 0) - (b % 8 === 0 ? -1 : 0));
        for (let i = 0; i < order.length; i += 6) await Promise.all(order.slice(i, i + 6).map(load));
      },
      { rootMargin: "150% 0px" },
    );
    if (root.current) io.observe(root.current);
    return () => io.disconnect();
  }, []);

  useGSAP(
    () => {
      const frame = { i: 0 };
      if (prefersReducedMotion()) {
        current.current = Math.round(FRAMES.count * 0.9);
        setStep(assaySteps.length - 1);
        draw(current.current);
        return;
      }
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "+=320%",
          pin: true,
          scrub: 0.5,
          anticipatePin: 1,
          onUpdate: (self) => {
            const p = self.progress;
            let s = 0;
            assaySteps.forEach((st, k) => p >= st.at && (s = k));
            setStep(s);
          },
        },
      });
      tl.to(frame, {
        i: FRAMES.count - 1,
        snap: "i",
        ease: "none",
        duration: 1,
        onUpdate: () => {
          current.current = frame.i;
          draw(frame.i);
        },
      })
        .to("[data-assay-bar]", { scaleX: 1, ease: "none", duration: 1 }, 0)
        .fromTo("[data-assay-title]", { opacity: 1, y: 0 }, { opacity: 0, y: -40, duration: 0.12, ease: "power1.in", immediateRender: false }, 0.2);

      gsap.fromTo(
        "[data-assay-head]",
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, stagger: 0.1, scrollTrigger: { trigger: root.current, start: "top 70%", once: true } },
      );
      ScrollTrigger.refresh();
    },
    { scope: root },
  );

  const ready = loaded > 0;

  return (
    <section ref={root} className="relative h-[100svh] overflow-hidden bg-ink" aria-label="Inside the assay">
      <canvas
        ref={canvas}
        className={cn("absolute inset-0 h-full w-full transition-opacity duration-1000", ready ? "opacity-100" : "opacity-0")}
        role="img"
        aria-label="A petri dish of Candida growing on agar; paper discs with test compounds create clear zones of inhibition."
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 [background:linear-gradient(to_bottom,#000_0%,transparent_22%,transparent_70%,#000_100%)]" />

      <div className="container-x relative flex h-full flex-col justify-between pb-10 pt-[calc(var(--nav-h)+5vh)]">
        <header data-assay-title className="max-w-xl">
          <p data-assay-head className="eyebrow mb-4">
            Inside the assay
          </p>
          <h2 data-assay-head className="text-[clamp(2rem,4.8vw,4.25rem)] font-semibold leading-[1.02] tracking-[-0.04em]">
            Watch a compound <span className="serif-italic text-gradient">hold the line.</span>
          </h2>
        </header>

        <div className="flex items-end justify-between gap-8">
          <ol className="relative grid w-full max-w-md gap-1" aria-label="Assay steps">
            {assaySteps.map((s, i) => (
              <li
                key={s.title}
                className={cn(
                  "glass rounded-2xl border border-line px-5 py-4 transition-all duration-700 ease-[var(--ease-out-expo)]",
                  i === step ? "opacity-100" : "pointer-events-none absolute inset-x-0 bottom-0 translate-y-4 opacity-0",
                )}
                aria-current={i === step ? "step" : undefined}
              >
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-teal">
                  {String(i + 1).padStart(2, "0")} · {s.title}
                </p>
                <p className="mt-1.5 text-[15px] leading-snug text-fg/90">{s.text}</p>
              </li>
            ))}
          </ol>
          <div className="hidden shrink-0 items-center gap-4 md:flex">
            {assaySteps.map((s, i) => (
              <span key={s.title} className={cn("font-mono text-[10px] uppercase tracking-[0.2em] transition-colors duration-500", i <= step ? "text-fg" : "text-dim")}>
                {s.title}
              </span>
            ))}
          </div>
        </div>
        <div className="absolute inset-x-[var(--gutter)] bottom-5 h-px bg-white/10">
          <div data-assay-bar className="h-full origin-left scale-x-0 [background:var(--grad)]" />
        </div>
      </div>
    </section>
  );
}
