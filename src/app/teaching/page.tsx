import type { Metadata } from "next";
import { courses, openings, resources, site } from "@content/site";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { SplitHeading } from "@/components/ui/SplitHeading";
import { PillLink } from "@/components/ui/PillLink";
import { StudentTabs } from "@/components/pages/StudentTabs";
import { asset } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Teaching",
  description: "Courses, research scholars, alumni, openings and learning resources.",
};

const levelColor: Record<string, string> = { "B.Sc.": "#38bdf8", "M.Sc.": "#5eead4", "Ph.D.": "#a78bfa" };

export default function TeachingPage() {
  return (
    <>
      <PageHero
        eyebrow="Teaching & students"
        title="Good scientists are *made,* not found."
        intro="I teach microbiology from first principles to the research frontier, and supervise scholars working on real problems in medical mycology and drug discovery."
      />

      <section className="pb-28">
        <div className="container-x">
          <p className="eyebrow mb-8">Courses</p>
          <Reveal selector="[data-item]" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((c) => (
              <article
                data-item
                key={c.code}
                className="group relative overflow-hidden rounded-[24px] border border-line bg-surface p-7 transition-[border-color,transform] duration-500 hover:-translate-y-1 hover:border-white/25"
              >
                <span
                  aria-hidden
                  className="absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-40"
                  style={{ background: levelColor[c.level] ?? "#5eead4" }}
                />
                <div className="relative flex items-center justify-between font-mono text-[11px] tracking-[0.15em]">
                  <span className="text-dim">{c.code}</span>
                  <span style={{ color: levelColor[c.level] }}>{c.level}</span>
                </div>
                <h3 className="relative mt-10 text-2xl font-semibold leading-tight tracking-[-0.03em]">{c.title}</h3>
                <p className="relative mt-3 text-sm leading-relaxed text-muted">{c.blurb}</p>
              </article>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="border-t border-line py-28">
        <div className="container-x grid gap-16 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="eyebrow mb-4">Research scholars</p>
            <SplitHeading text="The people *behind* the data." className="text-[length:var(--text-section)] font-semibold leading-[1] tracking-[-0.045em]" />
          </div>
          <StudentTabs />
        </div>
      </section>

      {openings.open && (
        <section className="py-20">
          <div className="container-x">
            <Reveal className="relative overflow-hidden rounded-[32px] p-px [background:var(--grad)]">
              <div className="relative rounded-[31px] bg-ink p-10 md:p-16">
                <div aria-hidden className="absolute inset-0 opacity-50 [background:radial-gradient(70%_80%_at_100%_0%,rgba(94,234,212,0.15),transparent)]" />
                <div className="relative grid gap-10 md:grid-cols-[1.4fr_auto] md:items-end">
                  <div>
                    <p className="eyebrow mb-4 !text-teal">Openings</p>
                    <h2 className="text-[clamp(2.2rem,5vw,4rem)] font-semibold leading-[1] tracking-[-0.045em]">{openings.title}</h2>
                    <p className="mt-6 max-w-2xl text-lg leading-relaxed text-fg/80">{openings.text}</p>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    <PillLink href={`mailto:${site.email}?subject=${encodeURIComponent("Prospective student enquiry")}`} magnetic>
                      Email me
                    </PillLink>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      <section className="py-28">
        <div className="container-x grid gap-12 md:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="eyebrow mb-4">For students</p>
            <h2 className="text-[clamp(2rem,4vw,3.25rem)] font-semibold leading-[1.02] tracking-[-0.04em]">Resources</h2>
            {site.cvPath && (
              <div className="mt-8">
                <PillLink href={asset(site.cvPath)} variant="ghost" download>
                  Download CV
                </PillLink>
              </div>
            )}
          </div>
          <Reveal selector="[data-item]" as="ul" className="border-t border-line">
            {resources.map((r) => (
              <li data-item key={r.title}>
                <a href={r.href} className="group flex items-center justify-between gap-6 border-b border-line py-6">
                  <span className="text-lg tracking-tight transition-colors group-hover:text-teal">{r.title}</span>
                  <span className="flex items-center gap-4">
                    <span className="font-mono text-xs text-dim">{r.type}</span>
                    <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
                  </span>
                </a>
              </li>
            ))}
          </Reveal>
        </div>
      </section>
    </>
  );
}
