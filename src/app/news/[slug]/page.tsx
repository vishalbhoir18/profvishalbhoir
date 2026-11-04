import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPosts, getPost } from "@/lib/news";
import { formatDate } from "@/lib/utils";
import { site } from "@content/site";
import { SplitHeading } from "@/components/ui/SplitHeading";
import { Reveal } from "@/components/ui/Reveal";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { Prose } from "@/components/pages/Prose";
import { GlowField } from "@/components/ui/GlowField";

type Params = { slug: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { type: "article", title: post.title, description: post.excerpt, publishedTime: post.date },
  };
}

export default async function PostPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  const all = getAllPosts();
  const i = all.findIndex((p) => p.slug === slug);
  const newer = all[i - 1];
  const older = all[i + 1];

  return (
    <article>
      <header className="relative overflow-hidden pb-14 pt-[calc(var(--nav-h)+12vh)]">
        <GlowField />
        <div className="container-x relative max-w-4xl">
          <Reveal>
            <TransitionLink href="/news/" className="eyebrow inline-flex items-center gap-2 hover:text-fg">
              ← All news
            </TransitionLink>
          </Reveal>
          <SplitHeading as="h1" trigger="load" delay={0.1} text={post.title} className="mt-8 text-[clamp(2.4rem,5.5vw,4.75rem)] font-semibold leading-[1.02] tracking-[-0.045em] text-balance" />
          <Reveal delay={0.4} className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span>{post.readingMinutes} min read</span>
            <span>
              {site.honorific} {site.name}
            </span>
            <span className="flex gap-2">
              {post.tags.map((t) => (
                <span key={t} className="rounded-full border border-white/12 px-3 py-0.5 text-xs">
                  {t}
                </span>
              ))}
            </span>
          </Reveal>
        </div>
      </header>
      <div className="container-x max-w-4xl pb-24">
        <Reveal delay={0.5} y={30}>
          <Prose html={post.html} />
        </Reveal>
        <nav className="mt-20 grid gap-4 border-t border-line pt-10 sm:grid-cols-2" aria-label="More news">
          {older ? (
            <TransitionLink href={`/news/${older.slug}/`} className="group rounded-2xl border border-line p-6 transition-colors hover:border-white/25">
              <span className="eyebrow">← Previous</span>
              <span className="mt-3 block font-medium leading-snug tracking-tight group-hover:text-teal">{older.title}</span>
            </TransitionLink>
          ) : (
            <span />
          )}
          {newer && (
            <TransitionLink href={`/news/${newer.slug}/`} className="group rounded-2xl border border-line p-6 text-right transition-colors hover:border-white/25">
              <span className="eyebrow">Next →</span>
              <span className="mt-3 block font-medium leading-snug tracking-tight group-hover:text-teal">{newer.title}</span>
            </TransitionLink>
          )}
        </nav>
      </div>
    </article>
  );
}
