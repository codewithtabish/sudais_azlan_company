import { Suspense } from "react";
import HeroSectionFile from "./hero/hero-section-file";
import Navbar from "@/components/general/navbar/navbar";
import NewsletterSection from "@/components/general/newsletter/new-letter-section";
import { SecondContainer } from "@/components/general/layouts/second-container";
import ProjectsLandingSection from "./projects-landing-section";
import Testimonials from "./testmonial/testmonial-setcion";
import HeroFallback from "./hero/hero-fallback";
import LandingPageAbout from "./about/landing-page-about";
import FeaturedBlogs from "./articles/featured-articles";

const LandingPage = () => {
  return (
    <SecondContainer>
      <Navbar />

      {/* Hero */}
      <Suspense fallback={<HeroFallback />}>
        <HeroSectionFile />
      </Suspense>

      {/* About */}
      <LandingPageAbout />

      {/* Featured Articles */}
      <FeaturedBlogs />

      <ProjectsLandingSection />
      <Testimonials />
      <NewsletterSection />
    </SecondContainer>
  );
};

export default LandingPage;
