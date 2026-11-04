import type { Metadata } from "next";
import { getAllPosts } from "@/lib/news";
import { formatDate } from "@/lib/utils";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { TransitionLink } from "@/components/ui/TransitionLink";

export const metadata: Metadata = { title: "News", description: "Lab news, grants, talks and announcements." };

export default function NewsPage() {
  const posts = getAllPosts();
  return (
    <>
      <PageHero eyebrow="News" title="What’s *new.*" intro="Grants, papers, talks and life in the lab." />
      <section className="container-x pb-32">
        <Reveal selector="[data-item]" as="ul" className="border-t border-line">
          {posts.map((p) => (
            <li data-item key={p.slug}>
              <TransitionLink
                href={`/news/${p.slug}/`}
                className="group relative grid gap-3 overflow-hidden border-b border-line py-10 md:grid-cols-[200px_1fr_auto] md:items-center md:gap-10"
              >
                <span aria-hidden className="absolute inset-0 origin-bottom scale-y-0 bg-surface transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-y-100" />
                <time dateTime={p.date} className="relative font-mono text-xs uppercase tracking-[0.15em] text-dim md:pl-4">
                  {formatDate(p.date)}
                </time>
                <span className="relative">
                  <span className="block text-[clamp(1.4rem,2.6vw,2.1rem)] font-semibold leading-tight tracking-[-0.03em] transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:translate-x-2">
                    {p.title}
                  </span>
                  <span className="mt-2 block max-w-2xl text-muted">{p.excerpt}</span>
                </span>
                <span className="relative flex items-center gap-4 md:pr-4">
                  {p.tags.slice(0, 2).map((t) => (
                    <span key={t} className="rounded-full border border-white/12 px-3 py-1 text-xs text-muted">
                      {t}
                    </span>
                  ))}
                  <span className="text-xl transition-transform duration-500 group-hover:translate-x-1">→</span>
                </span>
              </TransitionLink>
            </li>
          ))}
        </Reveal>
        {posts.length === 0 && <p className="py-20 text-muted">No news yet.</p>}
      </section>
    </>
  );
}
