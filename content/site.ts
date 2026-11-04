/**
 * ─────────────────────────────────────────────────────────────
 *  SITE CONTENT: edit this one file to update the whole site.
 * ─────────────────────────────────────────────────────────────
 *  Everything marked  // PLACEHOLDER  is sample content that
 *  should be replaced with real details before going live.
 *  Publications live in content/publications.json and news
 *  posts in content/news/*.md.
 */

export const site = {
  /** Used for <title>, metadata and JSON-LD. */
  name: "Vishal Bhoir",
  honorific: "Prof.",
  shortName: "VB",
  role: "Professor of Microbiology", // PLACEHOLDER
  department: "Department of Microbiology", // PLACEHOLDER
  institution: "University Name", // PLACEHOLDER
  location: "City, Country", // PLACEHOLDER
  tagline: "Microbiologist · Researcher · Educator",
  description:
    "Prof. Vishal Bhoir studies drug-resistant fungal pathogens and the natural compounds that can defeat them, and trains the next generation of microbiologists.", // PLACEHOLDER

  /** Absolute URL of the deployed site, used for sitemap/OG. Overridden in CI. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://vishalbhoir18.github.io/profvishalbhoir",

  email: "your.email@university.edu", // PLACEHOLDER
  phone: "", // optional
  office: "Room 000, Department of Microbiology, University Name", // PLACEHOLDER

  /**
   * Contact form: create a free form at https://formspree.io and paste its
   * ID (the part after /f/). Leave empty to fall back to a mailto: link.
   */
  formspreeId: "",

  /** Portrait photo in /public (e.g. "/images/portrait.jpg"). Empty shows a monogram card. */
  portrait: "",

  /** Put your CV at public/cv.pdf (or change the path). Empty string hides the button. */
  cvPath: "/cv.pdf",

  /** ORCID iD used by `npm run sync:orcid` and the weekly GitHub Action. */
  orcid: "", // e.g. "0000-0002-1825-0097"

  socials: [
    { label: "Google Scholar", href: "https://scholar.google.com/" }, // PLACEHOLDER
    { label: "ORCID", href: "https://orcid.org/" }, // PLACEHOLDER
    { label: "ResearchGate", href: "https://www.researchgate.net/" }, // PLACEHOLDER
    { label: "LinkedIn", href: "https://www.linkedin.com/" }, // PLACEHOLDER
  ],
} as const;

export const nav = [
  { label: "About", href: "/about/" },
  { label: "Research", href: "/research/" },
  { label: "Publications", href: "/publications/" },
  { label: "Teaching", href: "/teaching/" },
  { label: "News", href: "/news/" },
  { label: "Contact", href: "/contact/" },
] as const;

/* ── Home: hero scroll story ─────────────────────────────── */
export const heroStory = [
  { kicker: "01 · The cell", text: "Every infection begins with a single cell." },
  { kicker: "02 · The defence", text: "My lab studies how to break its defences," },
  { kicker: "03 · The code", text: "and decodes the genes that let it resist." },
] as const;

export const manifesto =
  // Wrap *phrases in asterisks* to make them light up in colour.
  "Drug-resistant fungi kill *more than a million people* every year, yet we have only *a handful of drugs* to fight them. My work sits where *microbes, molecules and medicine* meet: finding new compounds in nature, proving how they work, and turning them into therapies people can actually use."; // PLACEHOLDER

/* ── Home: frame-sequence assay annotations ──────────────── */
export const assaySteps = [
  { at: 0.05, title: "Inoculate", text: "A lawn of Candida spreads across nutrient agar." },
  { at: 0.32, title: "Challenge", text: "Paper discs carry candidate compounds onto the plate." },
  { at: 0.58, title: "Diffuse", text: "Molecules seep outward, and growth retreats." },
  { at: 0.82, title: "Measure", text: "Clear halos reveal which compounds hold the line." },
] as const;

/* ── Research themes ─────────────────────────────────────── */
export const research = [
  {
    slug: "antifungal-discovery",
    title: "Antifungal drug discovery",
    short: "Screening natural and synthetic compounds against drug-resistant Candida.",
    body: "We screen plant extracts, microbial metabolites and synthetic libraries against clinical Candida isolates, using agar diffusion, broth microdilution (MIC/MFC) and time-kill kinetics to find molecules worth pursuing.",
    methods: ["Agar & disc diffusion", "Broth microdilution (MIC/MFC)", "Time-kill kinetics"],
    image: "/images/research-yeast.webp",
    accent: "#5eead4",
  },
  {
    slug: "bioactive-metabolites",
    title: "Microbial bioactive metabolites",
    short: "Mining soil and marine microbes for molecules with therapeutic potential.",
    body: "Actinomycetes, endophytes and marine bacteria are prolific chemists. We isolate them, optimise fermentation, and purify and characterise the metabolites they produce.",
    methods: ["Isolation & fermentation", "Extraction & TLC/HPLC", "Bioassay-guided fractionation"],
    image: "/images/research-hyphae.webp",
    accent: "#fbbf24",
  },
  {
    slug: "resistance-mechanisms",
    title: "Mechanisms of resistance",
    short: "How pathogens pump drugs out and rewire their membranes to survive.",
    body: "Using qRT-PCR we follow efflux pump (CDR1) and ergosterol-pathway (ERG11) genes, and use sorbitol and ergosterol-binding assays to map where a compound strikes.",
    methods: ["qRT-PCR (CDR1, ERG11)", "Sorbitol protection assay", "Ergosterol binding"],
    image: "/images/research-gel.webp",
    accent: "#a78bfa",
  },
  {
    slug: "synergy",
    title: "Synergy & combination therapy",
    short: "Pairing new compounds with existing drugs to rescue failing treatments.",
    body: "Checkerboard microdilution and FIC indices tell us when two agents are stronger together. Synergy can restore the activity of drugs that resistant strains have learned to ignore.",
    methods: ["Checkerboard assay (FICI)", "Resazurin microtitre", "Combination time-kill"],
    image: "/images/research-plate.webp",
    accent: "#f472b6",
  },
  {
    slug: "formulation",
    title: "Formulation & delivery",
    short: "Turning promising molecules into stable, safe and usable medicines.",
    body: "A good molecule still needs a good vehicle. We develop topical and nano-formulations, test their stability, and check cytotoxicity against human cells (MTT/SRB) before efficacy studies.",
    methods: ["Topical & nano-formulation", "Stability studies", "MTT / SRB cytotoxicity"],
    image: "/images/research-droplets.webp",
    accent: "#38bdf8",
  },
] as const;

/* ── Numbers ─────────────────────────────────────────────── */
export const stats = [
  { value: 45, suffix: "+", label: "Peer-reviewed publications" }, // PLACEHOLDER
  { value: 1200, suffix: "+", label: "Citations" }, // PLACEHOLDER
  { value: 18, suffix: "", label: "h-index" }, // PLACEHOLDER
  { value: 30, suffix: "+", label: "Students mentored" }, // PLACEHOLDER
] as const;

/* ── About ───────────────────────────────────────────────── */
export const about = {
  intro:
    "I am a microbiologist fascinated by the invisible arms race between pathogens and the molecules that can stop them.", // PLACEHOLDER
  bio: [
    "My research focuses on opportunistic fungal pathogens, especially Candida species, and on discovering bioactive compounds from natural sources that can overcome antifungal resistance.", // PLACEHOLDER
    "Alongside research, I teach microbiology at undergraduate and postgraduate levels and supervise doctoral scholars. I believe the best science happens when students are given real problems, good tools and the freedom to be curious.", // PLACEHOLDER
  ],
  timeline: [
    // PLACEHOLDER: replace with your real education and positions (newest first)
    { year: "Present", title: "Professor of Microbiology", place: "University Name" },
    { year: "2018", title: "Associate Professor", place: "University Name" },
    { year: "2012", title: "Assistant Professor", place: "College Name" },
    { year: "2010", title: "Ph.D., Microbiology", place: "University Name" },
    { year: "2005", title: "M.Sc., Microbiology", place: "University Name" },
  ],
  honours: [
    // PLACEHOLDER
    { year: "2024", title: "Best Research Paper Award", by: "Society / Conference Name" },
    { year: "2022", title: "Research grant (Principal Investigator)", by: "Funding Agency" },
    { year: "2019", title: "Excellence in Teaching Award", by: "University Name" },
  ],
  memberships: [
    // PLACEHOLDER
    "Life Member, Association of Microbiologists",
    "Member, Society for Medical Mycology",
    "Reviewer for international microbiology journals",
  ],
};

/* ── Grants / projects ───────────────────────────────────── */
export const projects = [
  // PLACEHOLDER
  {
    title: "Natural product leads against azole-resistant Candida",
    role: "Principal Investigator",
    funder: "Funding Agency",
    years: "2023 – 2026",
    status: "Ongoing",
  },
  {
    title: "Synergistic combinations to restore fluconazole activity",
    role: "Principal Investigator",
    funder: "University Research Fund",
    years: "2021 – 2023",
    status: "Completed",
  },
  {
    title: "Bioprospecting marine actinomycetes for antimicrobials",
    role: "Co-Investigator",
    funder: "Funding Agency",
    years: "2018 – 2021",
    status: "Completed",
  },
];

/* ── Teaching ────────────────────────────────────────────── */
export const courses = [
  // PLACEHOLDER
  { code: "MIC-501", title: "Medical Mycology", level: "M.Sc.", blurb: "Pathogenic fungi, diagnosis and antifungal therapy." },
  { code: "MIC-402", title: "Microbial Genetics", level: "M.Sc.", blurb: "Gene regulation, mutation and horizontal gene transfer." },
  { code: "MIC-305", title: "Pharmaceutical Microbiology", level: "B.Sc.", blurb: "Antimicrobials, sterility testing and quality control." },
  { code: "MIC-201", title: "Immunology", level: "B.Sc.", blurb: "Innate and adaptive immunity, antigen–antibody reactions." },
  { code: "RM-601", title: "Research Methodology & Biostatistics", level: "Ph.D.", blurb: "Designing experiments, analysing data and writing science." },
];

export const students = {
  // PLACEHOLDER: replace with real names and thesis topics
  current: [
    { name: "Scholar A", degree: "Ph.D.", topic: "Anticandidal metabolites from endophytic fungi", since: "2023" },
    { name: "Scholar B", degree: "Ph.D.", topic: "Efflux pump modulation in azole-resistant Candida", since: "2022" },
    { name: "Scholar C", degree: "Ph.D.", topic: "Nano-formulations of plant-derived antifungals", since: "2024" },
    { name: "Scholar D", degree: "M.Sc.", topic: "Synergy screening with checkerboard assays", since: "2025" },
  ],
  alumni: [
    { name: "Dr. Alumnus A", degree: "Ph.D.", topic: "Biofilm inhibition by essential oils", since: "2023", now: "Postdoc, Research Institute" },
    { name: "Dr. Alumnus B", degree: "Ph.D.", topic: "Marine actinomycetes as antifungal sources", since: "2021", now: "Assistant Professor" },
    { name: "Alumnus C", degree: "M.Sc.", topic: "Antifungal susceptibility of clinical isolates", since: "2020", now: "Industry, QC Microbiologist" },
  ],
};

export const openings = {
  open: true,
  title: "Join the lab",
  text: "I welcome motivated Ph.D. and M.Sc. students interested in medical mycology, natural products and antimicrobial resistance. Write to me with your CV and a short note on what excites you.", // PLACEHOLDER
};

export const resources = [
  // PLACEHOLDER: link to slides, lab protocols, reading lists, etc.
  { title: "Lab safety & biosafety handbook", type: "PDF", href: "#" },
  { title: "Antifungal susceptibility testing: protocol notes", type: "Protocol", href: "#" },
  { title: "Writing your first research paper", type: "Slides", href: "#" },
];
