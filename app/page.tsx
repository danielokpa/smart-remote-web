
import About from "@/components/About";
import Hero from "@/components/Hero";
import Partners from "@/components/Partners";
import Services from "@/components/Services";
import Features from "@/components/Features";
import Subscription from "@/components/Subscription";
import FAQAccordion from "@/components/FAQAccordion";
import Footer from "@/components/Footer";



export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[--color-surface] text-white">
  
      <Hero />
      <Partners />
      <About />
      <Services />
      <Features />
      <FAQAccordion />
      <Footer />
    </main>
  );
}
