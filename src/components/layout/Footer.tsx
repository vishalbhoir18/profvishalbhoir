import { nav, site } from "@content/site";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { BackToTop } from "./BackToTop";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative border-t border-line bg-ink">
      <div className="container-x grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="text-2xl font-semibold tracking-tight">
            {site.honorific} {site.name}
          </p>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">
            {site.role}, {site.department}, {site.institution}
          </p>
          <a href={`mailto:${site.email}`} className="mt-6 inline-block text-sm text-teal hover:underline">
            {site.email}
          </a>
        </div>
        <div>
          <p className="eyebrow mb-4">Explore</p>
          <ul className="space-y-2 text-sm">
            {nav.map((n) => (
              <li key={n.href}>
                <TransitionLink href={n.href} className="text-muted transition-colors hover:text-fg">
                  {n.label}
                </TransitionLink>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="eyebrow mb-4">Elsewhere</p>
          <ul className="space-y-2 text-sm">
            {site.socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" className="text-muted transition-colors hover:text-fg">
                  {s.label} <span aria-hidden>↗</span>
                </a>
              </li>
            ))}
            <li>
              <a href={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/feed.xml`} className="text-muted transition-colors hover:text-fg">
                RSS feed
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="container-x flex flex-col items-start justify-between gap-4 border-t border-line py-6 text-xs text-dim sm:flex-row sm:items-center">
        <p>
          © {year} {site.honorific} {site.name}. All rights reserved.
        </p>
        <BackToTop />
      </div>
    </footer>
  );
}
