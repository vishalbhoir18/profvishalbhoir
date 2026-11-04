import type { Metadata } from "next";
import { publications } from "@/lib/publications";
import { site } from "@content/site";
import { PageHero } from "@/components/ui/PageHero";
import { PublicationExplorer } from "@/components/pages/PublicationExplorer";

export const metadata: Metadata = {
  title: "Publications",
  description: `Peer-reviewed articles, reviews, book chapters and patents by ${site.honorific} ${site.name}.`,
};

export default function PublicationsPage() {
  const years = publications.map((p) => p.year);
  const span = years.length ? `${Math.min(...years)}–${Math.max(...years)}` : "";
  return (
    <>
      <PageHero
        eyebrow={`Publications · ${publications.length} works · ${span}`}
        title="The *written* record."
        intro="Search, filter and cite. Every entry can be copied as an APA reference or BibTeX in one click."
      />
      <PublicationExplorer items={publications} />
    </>
  );
}
