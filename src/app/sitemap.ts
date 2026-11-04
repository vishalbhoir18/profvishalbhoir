import type { MetadataRoute } from "next";
import { site, nav } from "@content/site";
import { getAllPosts } from "@/lib/news";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url.replace(/\/$/, "");
  const pages = ["/", ...nav.map((n) => n.href)].map((p) => ({ url: `${base}${p}`, changeFrequency: "monthly" as const, priority: p === "/" ? 1 : 0.8 }));
  const posts = getAllPosts().map((p) => ({ url: `${base}/news/${p.slug}/`, lastModified: p.date, priority: 0.6 }));
  return [...pages, ...posts];
}
