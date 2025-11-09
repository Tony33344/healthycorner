import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { BrandSection } from "@/components/BrandSection";
import { Services } from "@/components/Services";
import { Menu } from "@/components/Menu";
import { Schedule } from "@/components/Schedule";
import { Gallery } from "@/components/Gallery";
import { Testimonials } from "@/components/Testimonials";
import { Shop } from "@/components/Shop";
import { Booking } from "@/components/Booking";
import { Newsletter } from "@/components/Newsletter";
import { Contact } from "@/components/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <BrandSection />
      <Services />
      <Menu />
      <Schedule />
      <Gallery />
      <Testimonials />
      <Shop />
      <Booking />
      <Newsletter />
      <Contact />
    </>
  );
}
