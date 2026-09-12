import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";

export default function FinalCta() {
  return (
    <section
      id="final-cta"
      className="relative flex min-h-[80vh] flex-col items-center justify-center overflow-hidden bg-ink px-6 py-32 text-center text-cream"
    >
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[60vh] w-[60vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-rust/15 blur-[130px]" />

      <Reveal className="relative">
        <h2 className="font-display text-[11vw] font-medium leading-[0.98] tracking-tight sm:text-[64px] md:text-[80px]">
          Your event.
          <br />
          Our coffee.
          <br />
          <span className="italic text-rust-bright">One place everyone remembers.</span>
        </h2>
      </Reveal>

      <Reveal delay={0.15} className="relative mt-10 flex flex-wrap items-center justify-center gap-5">
        <Button href="#packs" tone="rust">
          Bring ARNO to Your Event
        </Button>
        <Button href="mailto:hello@arno.coffee" variant="ghost" tone="cream">
          Contact ARNO
        </Button>
      </Reveal>
    </section>
  );
}
