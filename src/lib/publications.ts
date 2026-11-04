import data from "@content/publications.json";

export type PubType = "journal" | "review" | "chapter" | "conference" | "patent" | "book" | "preprint" | "other";

export type Publication = {
  id: string;
  title: string;
  authors: string[];
  year: number;
  venue: string;
  type: PubType;
  topics: string[];
  featured?: boolean;
  abstract?: string;
  doi?: string;
  url?: string;
};

export const publications: Publication[] = (data.items as Publication[])
  .slice()
  .sort((a, b) => b.year - a.year || a.title.localeCompare(b.title));

export const typeLabel: Record<PubType, string> = {
  journal: "Journal article",
  review: "Review",
  chapter: "Book chapter",
  conference: "Conference",
  patent: "Patent",
  book: "Book",
  preprint: "Preprint",
  other: "Other",
};
