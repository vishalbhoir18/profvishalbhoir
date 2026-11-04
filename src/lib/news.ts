import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { Marked } from "marked";
import { basePath } from "./utils";

export type Post = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  cover?: string;
  html: string;
  readingMinutes: number;
};

const DIR = path.join(process.cwd(), "content", "news");

const marked = new Marked({
  gfm: true,
  renderer: {
    // Make internal links respect the deploy basePath.
    link({ href, title, tokens }) {
      const text = this.parser.parseInline(tokens);
      const internal = href.startsWith("/") && !href.startsWith("//");
      const url = internal ? `${basePath}${href}` : href;
      const ext = internal ? "" : ' target="_blank" rel="noopener noreferrer"';
      return `<a href="${url}"${title ? ` title="${title}"` : ""}${ext}${internal ? " data-internal" : ""}>${text}</a>`;
    },
    image({ href, title, text }) {
      const url = href.startsWith("/") ? `${basePath}${href}` : href;
      return `<img src="${url}" alt="${text}" loading="lazy"${title ? ` title="${title}"` : ""} />`;
    },
  },
});

let cache: Post[] | null = null;

export function getAllPosts(): Post[] {
  if (cache) return cache;
  if (!fs.existsSync(DIR)) return (cache = []);
  cache = fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith(".md"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(DIR, file), "utf8");
      const { data, content } = matter(raw);
      const slug = file.replace(/\.md$/, "").replace(/^\d{4}-\d{2}-\d{2}-/, "");
      const words = content.split(/\s+/).filter(Boolean).length;
      return {
        slug,
        title: String(data.title ?? slug),
        date: String(data.date ?? file.slice(0, 10)),
        excerpt: String(data.excerpt ?? ""),
        tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
        cover: data.cover ? String(data.cover) : undefined,
        html: marked.parse(content, { async: false }) as string,
        readingMinutes: Math.max(1, Math.round(words / 220)),
      };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
  return cache;
}

export const getPost = (slug: string) => getAllPosts().find((p) => p.slug === slug);
