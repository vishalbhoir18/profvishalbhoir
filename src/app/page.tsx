import { Hero } from "@/components/home/Hero";
import { Manifesto } from "@/components/home/Manifesto";
import { FrameSequence } from "@/components/home/FrameSequence";
import { ResearchGallery } from "@/components/home/ResearchGallery";
import { Stats } from "@/components/home/Stats";
import { ImageReveal } from "@/components/home/ImageReveal";
import { FeaturedPublications } from "@/components/home/FeaturedPublications";
import { TeachingTeaser } from "@/components/home/TeachingTeaser";
import { NewsTeaser } from "@/components/home/NewsTeaser";
import { ContactCTA } from "@/components/home/ContactCTA";
import { publications } from "@/lib/publications";

export default function Home() {
  const featured = publications.filter((p) => p.featured).slice(0, 4);
  return (
    <>
      <Hero />
      <Manifesto />
      <FrameSequence />
      <ResearchGallery />
      <Stats />
      <ImageReveal />
      <FeaturedPublications items={featured.length ? featured : publications.slice(0, 3)} />
      <TeachingTeaser />
      <NewsTeaser />
      <ContactCTA />
    </>
  );
}
