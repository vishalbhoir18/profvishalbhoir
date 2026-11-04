#!/usr/bin/env node
/**
 * Pulls works from a public ORCID record into content/publications.json.
 *
 *   ORCID_ID=0000-0000-0000-0000 node scripts/sync-orcid.mjs
 *   (or set `orcid` in content/site.ts)
 *
 * - Authors are filled from ORCID contributors, falling back to Crossref by DOI.
 * - Manual fields you've added (topics, featured, abstract) are preserved for
 *   entries matched by DOI or title, so it's safe to run repeatedly.
 * - Sample entries (id starting with "sample-") are dropped once real data arrives.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const FILE = path.join(ROOT, "content/publications.json");

const siteSrc = fs.readFileSync(path.join(ROOT, "content/site.ts"), "utf8");
const fromSite = siteSrc.match(/orcid:\s*"([\d-X]{19})"/)?.[1];
const ORCID = process.env.ORCID_ID || fromSite;

if (!ORCID) {
  console.log("No ORCID iD configured (set ORCID_ID or `orcid` in content/site.ts). Nothing to do.");
  process.exit(0);
}

const api = (p) =>
  fetch(`https://pub.orcid.org/v3.0/${ORCID}${p}`, { headers: { Accept: "application/json" } }).then((r) => {
    if (!r.ok) throw new Error(`ORCID ${p}: ${r.status}`);
    return r.json();
  });

const TYPE = {
  "journal-article": "journal",
  review: "review",
  "book-chapter": "chapter",
  book: "book",
  "conference-paper": "conference",
  "conference-abstract": "conference",
  "conference-poster": "conference",
  patent: "patent",
  preprint: "preprint",
};

const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
const slug = (s) => norm(s).split(" ").slice(0, 6).join("-");

async function crossrefAuthors(doi) {
  try {
    const r = await fetch(`https://api.crossref.org/works/${encodeURIComponent(doi)}`, {
      headers: { "User-Agent": "academic-site-sync/1.0" },
    });
    if (!r.ok) return null;
    const j = await r.json();
    return (j.message.author ?? []).map((a) => [a.given?.split(/\s+/).map((n) => n[0] + ".").join(" "), a.family].filter(Boolean).join(" "));
  } catch {
    return null;
  }
}

const summary = await api("/works");
const putCodes = summary.group.map((g) => g["work-summary"][0]["put-code"]);
const works = [];
for (let i = 0; i < putCodes.length; i += 100) {
  const batch = await api(`/works/${putCodes.slice(i, i + 100).join(",")}`);
  works.push(...batch.bulk.map((b) => b.work).filter(Boolean));
}

const existing = JSON.parse(fs.readFileSync(FILE, "utf8"));
const manual = existing.items.filter((p) => !String(p.id).startsWith("sample-"));
const byKey = new Map(manual.flatMap((p) => [[p.doi?.toLowerCase(), p], [norm(p.title), p]].filter(([k]) => k)));

const items = [];
for (const w of works) {
  const title = w.title?.title?.value?.trim();
  if (!title) continue;
  const ids = w["external-ids"]?.["external-id"] ?? [];
  const doi = ids.find((x) => x["external-id-type"] === "doi")?.["external-id-value"]?.toLowerCase() ?? "";
  const year = Number(w["publication-date"]?.year?.value) || 0;
  const prev = byKey.get(doi) ?? byKey.get(norm(title));
  let authors = (w.contributors?.contributor ?? []).map((c) => c["credit-name"]?.value).filter(Boolean);
  if (!authors.length && doi) authors = (await crossrefAuthors(doi)) ?? [];
  items.push({
    id: prev?.id ?? `${year}-${slug(title)}`,
    title,
    authors: authors.length ? authors : prev?.authors ?? [],
    year,
    venue: w["journal-title"]?.value ?? prev?.venue ?? "",
    type: TYPE[w.type] ?? prev?.type ?? "other",
    topics: prev?.topics ?? [],
    featured: prev?.featured ?? false,
    ...(prev?.abstract ? { abstract: prev.abstract } : {}),
    doi,
    url: w.url?.value ?? prev?.url ?? "",
  });
}

// Keep manual entries ORCID doesn't know about.
const seen = new Set(items.flatMap((p) => [p.doi, norm(p.title)]).filter(Boolean));
for (const p of manual) if (!seen.has(p.doi?.toLowerCase()) && !seen.has(norm(p.title))) items.push(p);

items.sort((a, b) => b.year - a.year || a.title.localeCompare(b.title));
if (JSON.stringify(items) === JSON.stringify(existing.items)) {
  console.log("Publications already up to date.");
  process.exit(0);
}
fs.writeFileSync(
  FILE,
  JSON.stringify({ _note: `Synced from ORCID ${ORCID} on ${new Date().toISOString().slice(0, 10)}. Add topics/featured/abstract by hand; they are preserved.`, items }, null, 2) + "\n",
);
console.log(`Wrote ${items.length} publications from ORCID ${ORCID}.`);
