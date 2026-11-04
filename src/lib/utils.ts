export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Prefix a /public asset path with the deploy basePath (needed for raw <img>, canvas, fetch). */
export const asset = (path: string) =>
  /^(https?:)?\/\//.test(path) || path.startsWith("data:") ? path : `${basePath}${path.startsWith("/") ? "" : "/"}${path}`;

export const cn = (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(" ");

export const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));

export const formatDate = (iso: string) =>
  new Date(iso + "T00:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

export const isInternal = (href: string) => href.startsWith("/") && !href.startsWith("//");
