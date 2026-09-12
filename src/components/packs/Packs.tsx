import Reveal from "@/components/ui/Reveal";
import Eyebrow from "@/components/ui/Eyebrow";
import PackCard from "./PackCard";
import { PACKS } from "./packs-data";

export default function Packs() {
  return (
    <section id="packs" className="relative bg-cream py-28 md:py-36">
      <div className="mx-auto max-w-[1440px] px-6 md:px-10">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Eyebrow className="justify-center">04 — Formules ARNO</Eyebrow>
          <h2 className="mt-5 font-display text-[10vw] font-medium leading-[1.02] tracking-tight text-ink sm:text-[56px] md:text-[64px]">
            Choisissez votre expérience <span className="italic text-rust">ARNO</span>.
          </h2>
          <p className="mx-auto mt-6 max-w-md text-[15px] leading-relaxed text-ink/60">
            D&apos;une réception intime à une activation de marque, on adapte
            ARNO à votre événement.
          </p>
        </Reveal>

        <div className="mx-auto mt-16 grid max-w-[1180px] gap-6 md:mt-24 md:grid-cols-3 md:items-center md:gap-6">
          {PACKS.map((pack, i) => (
            <Reveal key={pack.id} delay={0.06 * i} className="h-full">
              <PackCard pack={pack} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
