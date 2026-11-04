import { PillLink } from "@/components/ui/PillLink";
import { GlowField } from "@/components/ui/GlowField";

export default function NotFound() {
  return (
    <section className="relative grid min-h-[100svh] place-items-center overflow-hidden text-center">
      <GlowField />
      <div className="container-x relative">
        <p className="eyebrow mb-6">Error 404</p>
        <h1 className="text-[length:var(--text-display)] font-semibold leading-[0.9] tracking-[-0.06em]">
          Not <span className="serif-italic text-gradient">cultured.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-md text-lg text-muted">This page didn’t grow. It may have moved, or the link may be mistyped.</p>
        <div className="mt-10">
          <PillLink href="/">Back to the lab</PillLink>
        </div>
      </div>
    </section>
  );
}
