import { Nav }          from "@/components/nav";
import { Hero }         from "@/components/hero";
import { Stats }        from "@/components/stats";
import { HowItWorks }   from "@/components/how-it-works";
import { Featured }     from "@/components/featured";
import { Testimonials } from "@/components/testimonials";
import { CtaSection }   from "@/components/cta-section";
import { Footer }       from "@/components/footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Stats />
        <HowItWorks />
        <Featured />
        <Testimonials />
        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
