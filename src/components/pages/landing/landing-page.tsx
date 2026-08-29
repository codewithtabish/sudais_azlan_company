import HeroSectionFile from "./hero/hero-section-file";
import Navbar from "@/components/general/navbar/navbar";
import NewsletterSection from "@/components/general/newsletter/new-letter-section";
import { SecondContainer } from "@/components/general/layouts/second-container";

const LandingPage = () => {
  return (
    <SecondContainer>
      <Navbar />
      <HeroSectionFile />
      <NewsletterSection />
    </SecondContainer>
  );
};

export default LandingPage;
