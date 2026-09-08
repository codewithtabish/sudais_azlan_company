import { Suspense } from "react";
import HeroSectionFile from "./hero/hero-section-file";
import Navbar from "@/components/general/navbar/navbar";
import NewsletterSection from "@/components/general/newsletter/new-letter-section";
import { SecondContainer } from "@/components/general/layouts/second-container";
import ProjectsLandingSection from "./projects-landing-section";
import Testimonials from "./testmonial/testmonial-setcion";
import HeroFallback from "./hero/hero-fallback";
import LandingPageAbout from "./about/landing-page-about";

const LandingPage = () => {
  return (
    <SecondContainer>
      <Navbar />

      <Suspense fallback={<HeroFallback />}>
        <HeroSectionFile />
      </Suspense>
      <LandingPageAbout />

      <ProjectsLandingSection />
      <Testimonials />
      <NewsletterSection />
    </SecondContainer>
  );
};

export default LandingPage;
