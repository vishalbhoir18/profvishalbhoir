"use client";

import { Fragment, useRef, type ElementType } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { cn } from "@/lib/utils";

type Props = {
  text: string;
  as?: ElementType;
  className?: string;
  /** Words wrapped in *asterisks* render in the serif-italic gradient accent. */
  delay?: number;
  /** "load" animates immediately; "scroll" waits until in view. */
  trigger?: "load" | "scroll";
};

/** Headline whose words rise out of masks, one after another. */
export function SplitHeading({ text, as: Tag = "h2", className, delay = 0, trigger = "scroll" }: Props) {
  const ref = useRef<HTMLElement>(null);
  const tokens = text.split(" ");

  useGSAP(
    () => {
      const words = ref.current?.querySelectorAll<HTMLElement>("[data-word]");
      if (!words?.length) return;
      gsap.set(ref.current, { opacity: 1 });
      if (prefersReducedMotion()) return;
      gsap.fromTo(
        words,
        { yPercent: 115, rotate: 4 },
        {
          yPercent: 0,
          rotate: 0,
          duration: 1.25,
          ease: "expo.out",
          stagger: 0.07,
          delay,
          scrollTrigger: trigger === "scroll" ? { trigger: ref.current, start: "top 90%", once: true } : undefined,
        },
      );
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} data-reveal className={className} aria-label={text.replace(/\*/g, "")}>
      {tokens.map((tok, i) => {
        const accent = /^\*.*\*[.,!?]?$/.test(tok);
        const word = tok.replace(/\*/g, "");
        return (
          <Fragment key={i}>
            <span aria-hidden className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-top">
              <span data-word className={cn("inline-block origin-bottom-left will-change-transform", accent && "serif-italic text-gradient pr-[0.06em]")}>
                {word}
              </span>
            </span>
            {i < tokens.length - 1 && " "}
          </Fragment>
        );
      })}
    </Tag>
  );
}
