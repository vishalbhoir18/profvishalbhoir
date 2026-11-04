import type { Metadata } from "next";
import { site } from "@content/site";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { ContactForm } from "@/components/pages/ContactForm";

export const metadata: Metadata = { title: "Contact", description: `Get in touch with ${site.honorific} ${site.name}.` };

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let’s *talk.*"
        intro="Whether you’re a prospective student, a potential collaborator or organising an event, I’d love to hear from you."
      />
      <section className="container-x grid gap-16 pb-32 lg:grid-cols-[1.3fr_0.7fr] lg:gap-24">
        <Reveal delay={0.3}>
          <ContactForm />
        </Reveal>
        <Reveal selector="[data-item]" as="aside" className="space-y-10">
          <div data-item>
            <p className="eyebrow mb-3">Email</p>
            <a href={`mailto:${site.email}`} className="break-all text-xl tracking-tight text-fg transition-colors hover:text-teal">
              {site.email}
            </a>
          </div>
          <div data-item>
            <p className="eyebrow mb-3">Office</p>
            <p className="text-lg leading-relaxed text-fg/85">{site.office}</p>
            <p className="mt-1 text-muted">{site.location}</p>
          </div>
          {site.phone && (
            <div data-item>
              <p className="eyebrow mb-3">Phone</p>
              <a href={`tel:${site.phone}`} className="text-lg text-fg/85">
                {site.phone}
              </a>
            </div>
          )}
          <div data-item>
            <p className="eyebrow mb-3">Profiles</p>
            <ul className="space-y-2">
              {site.socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-2 text-lg text-fg/85 hover:text-teal">
                    {s.label}
                    <span className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </section>
    </>
  );
}
