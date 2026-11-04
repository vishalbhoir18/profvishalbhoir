# Prof. Vishal Bhoir: academic website

A cinematic, Apple-style scroll-storytelling portfolio for a microbiology professor.
It's built as a static site, so it is fast, secure and free to host on **GitHub Pages**.

**Live (after setup):** `https://vishalbhoir18.github.io/profvishalbhoir/`

## What's inside

| Scene | Technique |
| --- | --- |
| **Hero**: 15,000 glowing particles assemble into a budding yeast cell, burst apart, then re-form as a DNA double helix as you scroll | Three.js + custom GLSL shaders, morph targets scrubbed by GSAP ScrollTrigger (pinned) |
| **Manifesto**: words light up one by one | Scroll-scrubbed per-word colour |
| **The assay**: a petri dish where inhibition zones grow as you scroll | Apple's *image-sequence* technique: 120 pre-rendered frames painted to `<canvas>` |
| **Research gallery** | Pinned horizontal scroll with in-card parallax (`containerAnimation`) |
| **By the numbers** | Count-up stats |
| **"A world invisible to the eye"** | Masked `clip-path` reveal that expands to full-bleed |
| **Selected papers** | Sticky stacking cards |
| **Page transitions** | Curtain wipe between routes (App Router aware) |

Plus Lenis smooth scrolling, magnetic buttons, a hide-on-scroll nav with a progress line, and full **`prefers-reduced-motion`** support. With reduced motion, nothing is pinned and all content is shown statically.

**Pages:** Home · About (scroll-drawn timeline) · Research (sticky media) · Publications (search, filters, APA/BibTeX copy, GSAP Flip) · Teaching (courses, students, openings) · News (Markdown + RSS) · Contact (Formspree form) · 404

**Stack:** Next.js 16 (App Router, static export) · React 19 · TypeScript · Tailwind CSS 4 · GSAP 3 (ScrollTrigger, Flip) · Lenis · Three.js

---

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static site in ./out
```

## Editing content

Almost everything lives in **`content/`**, so you never need to touch components.

| What | Where |
| --- | --- |
| Name, role, bio, email, socials, research themes, stats, timeline, honours, courses, students, openings | `content/site.ts` |
| Publications | `content/publications.json` (or sync from ORCID, see below) |
| News posts | `content/news/YYYY-MM-DD-slug.md` (front-matter: `title`, `date`, `excerpt`, `tags`) |
| Portrait photo | put it in `public/images/` and set `site.portrait` |
| CV | replace `public/cv.pdf` |
| Research images | `public/images/research-*.webp` (any 4:5 image works) |

> **Placeholders:** every line marked `// PLACEHOLDER` in `content/site.ts` is sample text, and the publications and two of the news posts are samples too. Replace them before sharing the site.

### Contact form
GitHub Pages has no server, so the form uses [Formspree](https://formspree.io) (free tier).
Create a form there and paste its ID into `site.formspreeId`. Until then, the form opens the visitor's email app with the message pre-filled.

### Publications from ORCID
Set `site.orcid` (or a repository variable `ORCID_ID`), then:

```bash
npm run sync:orcid
```

A GitHub Action (`.github/workflows/sync-orcid.yml`) also runs this **every Monday**, commits any new papers and redeploys the site. Topics, `featured` flags and abstracts you add by hand are preserved.

---

## Deploying to GitHub Pages

1. Merge this branch into `main`.
2. In the repo, go to **Settings → Pages → Build and deployment → Source** and choose **GitHub Actions**.
3. Every push to `main` builds and deploys automatically (`.github/workflows/deploy.yml`).

**Custom domain?** Add it under Settings → Pages. The workflow detects it and drops the `/profvishalbhoir` path prefix automatically.

---

## Regenerating the 3D artwork (optional)

The frame sequence and "micrograph" images were rendered procedurally with headless Chromium:

```bash
npm i -D playwright && npx playwright install chromium   # one-time
npm run frames    # 120 petri-dish frames → public/frames/assay/
npm run images    # research images → public/images/
```

To use **your own lab video** for the scroll sequence instead:

```bash
ffmpeg -i lab-clip.mp4 -vf "fps=24,scale=1600:-2" -frames:v 120 -c:v libwebp -quality 80 public/frames/assay/%04d.webp
```

(Keep `FRAMES.count` in `src/components/home/FrameSequence.tsx` equal to the number of frames.)

---

## Project structure

```
content/                 ← edit me: site.ts, publications.json, news/*.md
public/                  ← frames, images, cv.pdf, og.jpg, icon.svg
scripts/                 ← asset rendering + ORCID sync
src/app/                 ← routes (App Router), sitemap, robots, RSS
src/components/
  home/                  ← the scroll-story sections
  three/CellScene.ts     ← WebGL particle engine + shaders
  pages/                 ← publication explorer, timeline, forms…
  providers/             ← Lenis smooth scroll, page transitions
  ui/                    ← Reveal, SplitHeading, PillLink, PageHero…
```

## Performance & accessibility notes

- Three.js loads in its own chunk after first paint. The render loop pauses off-screen, and the particle count halves on phones.
- Frames load progressively (a coarse pass first, then the gaps), about 3 MB in total.
- The site respects `prefers-reduced-motion`, includes a skip link, uses semantic landmarks, keeps text alternatives for canvases, and has keyboard-accessible menus and tabs.
- It ships SEO metadata, Open Graph image, JSON-LD `Person` schema, `sitemap.xml`, `robots.txt` and `feed.xml`.
