#!/usr/bin/env node
/**
 * Renders the site's generated imagery with headless Chromium (Playwright):
 *
 *   node scripts/render-assets.mjs frames   → public/frames/assay/0001..0120.webp
 *   node scripts/render-assets.mjs images   → public/images/*.webp
 *   node scripts/render-assets.mjs cv       → public/cv.pdf (placeholder)
 *   node scripts/render-assets.mjs all
 *
 * Want to use a real video instead of the 3D petri dish? Export frames with:
 *   ffmpeg -i clip.mp4 -vf "fps=24,scale=1600:-2" -frames:v 120 -c:v libwebp -quality 80 public/frames/assay/%04d.webp
 * and keep FRAMES.count in src/components/home/FrameSequence.tsx in sync.
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

// Playwright is not a project dependency (only needed to regenerate art).
// Install it once with:  npm i -D playwright && npx playwright install chromium
const { chromium } = createRequire(import.meta.url)("playwright");

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const what = process.argv[2] ?? "all";
const FRAME_COUNT = 120;

const MIME = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".json": "application/json" };

function serve() {
  const server = http.createServer((req, res) => {
    const url = decodeURIComponent(new URL(req.url, "http://x").pathname);
    const file = path.join(ROOT, url);
    if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      res.writeHead(404).end();
      return;
    }
    res.writeHead(200, { "Content-Type": MIME[path.extname(file)] ?? "application/octet-stream" });
    fs.createReadStream(file).pipe(res);
  });
  return new Promise((resolve) => server.listen(0, "127.0.0.1", () => resolve(server)));
}

const save = (dataUrl, out) => {
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, Buffer.from(dataUrl.split(",")[1], "base64"));
};

async function main() {
  const server = await serve();
  const base = `http://127.0.0.1:${server.address().port}`;
  const browser = await chromium.launch({
    args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"],
  });

  try {
    if (what === "frames" || what === "all") {
      const page = await browser.newPage({ viewport: { width: 400, height: 300 } });
      page.on("console", (m) => m.type() === "error" && console.error("[page]", m.text()));
      page.on("pageerror", (e) => console.error("[page]", e.message));
      const only = process.env.FRAMES_ONLY?.split(",").map(Number); // e.g. FRAMES_ONLY=0,60,119 for previews
      await page.goto(`${base}/scripts/scenes/petri.html?w=1600&h=900&ss=1.5`);
      await page.waitForFunction(() => window.sceneReady === true, null, { timeout: 120000 });
      const outDir = path.join(ROOT, "public/frames/assay");
      const t0 = Date.now();
      for (let i = 0; i < FRAME_COUNT; i++) {
        if (only && !only.includes(i)) continue;
        const url = await page.evaluate((t) => window.renderFrame(t), i / (FRAME_COUNT - 1));
        save(url, path.join(outDir, `${String(i + 1).padStart(4, "0")}.webp`));
        if (i % 10 === 0) console.log(`frame ${i + 1}/${FRAME_COUNT} (${((Date.now() - t0) / 1000).toFixed(0)}s)`);
      }
      await page.close();
    }

    if (what === "images" || what === "all") {
      const page = await browser.newPage();
      page.on("pageerror", (e) => console.error("[page]", e.message));
      await page.goto(`${base}/scripts/scenes/micro.html`);
      await page.waitForFunction(() => window.sceneReady === true);
      const jobs = [
        ["yeast", 1100, 1375, 11, "research-yeast.webp"],
        ["hyphae-amber", 1100, 1375, 5, "research-hyphae.webp"],
        ["gel", 1100, 1375, 3, "research-gel.webp"],
        ["plate", 1100, 1375, 9, "research-plate.webp"],
        ["droplets", 1100, 1375, 21, "research-droplets.webp"],
        ["hyphae", 2400, 1350, 42, "hyphae-wide.webp"],
      ];
      const pick = process.env.IMAGES_ONLY?.split(",");
      for (const [kind, w, h, seed, file] of jobs) {
        if (pick && !pick.includes(file)) continue;
        const url = await page.evaluate(([k, w, h, s]) => window.renderImage(k, w, h, s), [kind, w, h, seed]);
        save(url, path.join(ROOT, "public/images", file));
        console.log("image", file);
      }
      await page.close();
    }

    if (what === "cv" || what === "all") {
      const page = await browser.newPage();
      await page.setContent(`<!doctype html><html><head><style>
        body{font:14px/1.6 -apple-system,Helvetica,Arial,sans-serif;color:#1d1d1f;padding:56px 64px}
        h1{font-size:34px;letter-spacing:-.02em;margin:0} h2{font-size:13px;letter-spacing:.14em;text-transform:uppercase;color:#6e6e73;margin:36px 0 8px;border-bottom:1px solid #e5e5ea;padding-bottom:6px}
        .muted{color:#6e6e73} .note{margin-top:40px;padding:16px;border:1px dashed #c7c7cc;border-radius:12px;color:#6e6e73}
      </style></head><body>
        <h1>Prof. Vishal Bhoir</h1>
        <p class="muted">Curriculum Vitae · Microbiology</p>
        <h2>Research interests</h2><p>Antifungal drug discovery · Microbial bioactive metabolites · Mechanisms of antifungal resistance · Synergy & combination therapy · Formulation & delivery</p>
        <h2>Education & appointments</h2><p>Details to be added.</p>
        <h2>Publications</h2><p>See the Publications page of the website for a searchable list.</p>
        <div class="note">This is a placeholder CV. Replace <b>public/cv.pdf</b> with your own CV and redeploy.</div>
      </body></html>`);
      await page.pdf({ path: path.join(ROOT, "public/cv.pdf"), format: "A4", printBackground: true });
      console.log("cv.pdf");
      await page.close();
    }
  } finally {
    await browser.close();
    server.close();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
