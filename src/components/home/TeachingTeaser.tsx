import { courses, openings, students } from "@content/site";
import { Reveal } from "@/components/ui/Reveal";
import { PillLink } from "@/components/ui/PillLink";
import { SplitHeading } from "@/components/ui/SplitHeading";

export function TeachingTeaser() {
  return (
    <section className="relative bg-ink py-[clamp(6rem,16vh,10rem)]" aria-label="Teaching and mentoring">
      <div className="container-x grid gap-16 lg:grid-cols-[1.1fr_1fr] lg:gap-24">
        <div>
          <p className="eyebrow mb-4">Teaching & mentoring</p>
          <SplitHeading
            text="Teaching is research, *shared.*"
            className="text-[length:var(--text-section)] font-semibold leading-[1] tracking-[-0.045em]"
          />
          <Reveal delay={0.2}>
            <p className="mt-8 max-w-md text-lg leading-relaxed text-muted">
              From first-year microbiology to doctoral supervision, I help students learn to ask sharp questions and to design experiments that answer them.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <PillLink href="/teaching/">Courses & students</PillLink>
            </div>
            {openings.open && (
              <p className="mt-10 inline-flex items-center gap-3 rounded-full border border-teal/30 bg-teal/[0.06] px-4 py-2 text-sm text-teal">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-teal opacity-75 motion-safe:animate-ping" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-teal" />
                </span>
                Now accepting Ph.D. & M.Sc. students
              </p>
            )}
          </Reveal>
        </div>

        <Reveal selector="[data-item]" stagger={0.08}>
          <ul className="border-t border-line">
            {courses.slice(0, 4).map((c) => (
              <li data-item key={c.code} className="group flex items-baseline justify-between gap-6 border-b border-line py-6">
                <div>
                  <p className="text-xl font-medium tracking-tight transition-colors group-hover:text-teal">{c.title}</p>
                  <p className="mt-1 text-sm text-muted">{c.blurb}</p>
                </div>
                <span className="shrink-0 font-mono text-xs text-dim">{c.level}</span>
              </li>
            ))}
          </ul>
          <div data-item className="mt-10 grid grid-cols-2 gap-6">
            <div>
              <p className="text-5xl font-semibold tracking-[-0.04em]">{students.current.length}</p>
              <p className="mt-2 text-sm text-muted">Current research scholars</p>
            </div>
            <div>
              <p className="text-5xl font-semibold tracking-[-0.04em]">{students.alumni.length}+</p>
              <p className="mt-2 text-sm text-muted">Alumni in academia & industry</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
