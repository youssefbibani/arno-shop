import Hero from "@/components/hero/Hero";
import WhyArno from "@/components/why/WhyArno";
import TunisiaMap from "@/components/map/TunisiaMap";
import Packs from "@/components/packs/Packs";
import FinalCta from "@/components/cta/FinalCta";

export default function Home() {
  return (
    <>
      <Hero />
      <WhyArno />
      <TunisiaMap />
      <Packs />
      <FinalCta />
    </>
  );
}
