import { getAllPosts } from "@/lib/news";
import { formatDate } from "@/lib/utils";
import { Reveal } from "@/components/ui/Reveal";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { PillLink } from "@/components/ui/PillLink";

export function NewsTeaser() {
  const posts = getAllPosts().slice(0, 3);
  if (!posts.length) return null;
  return (
    <section className="relative bg-ink py-[clamp(5rem,14vh,9rem)]" aria-label="Latest news">
      <div className="container-x">
        <div className="mb-12 flex items-end justify-between gap-6">
          <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-semibold leading-none tracking-[-0.04em]">Latest news</h2>
          <PillLink href="/news/" variant="ghost">
            All news
          </PillLink>
        </div>
        <Reveal selector="[data-item]" className="grid gap-5 md:grid-cols-3">
          {posts.map((p) => (
            <TransitionLink
              data-item
              key={p.slug}
              href={`/news/${p.slug}/`}
              className="group relative flex min-h-[18rem] flex-col justify-between overflow-hidden rounded-[24px] border border-line bg-surface p-7 transition-colors duration-500 hover:border-white/25"
            >
              <span aria-hidden className="absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100 [background:radial-gradient(80%_60%_at_100%_0%,rgba(94,234,212,0.12),transparent)]" />
              <div className="relative flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.18em] text-dim">
                <time dateTime={p.date}>{formatDate(p.date)}</time>
                <span>{p.tags[0]}</span>
              </div>
              <div className="relative">
                <h3 className="text-xl font-semibold leading-snug tracking-[-0.02em]">{p.title}</h3>
                <p className="mt-3 line-clamp-2 text-sm text-muted">{p.excerpt}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm text-fg/80">
                  Read <span className="transition-transform duration-500 group-hover:translate-x-1.5">→</span>
                </span>
              </div>
            </TransitionLink>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
