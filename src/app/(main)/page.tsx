import Navbar from "@/components/general/navbar/navbar";
import ExitIntentPopup from "@/components/general/newsletter/exit-intent-popup";
import NewsletterSection from "@/components/general/newsletter/new-letter-section";
import ProjectsLandingSection from "@/components/pages/landing/projects-landing-section";

const HomePage = () => {
  return (
    <main>
      <Navbar />
      <ProjectsLandingSection />
      <NewsletterSection />
    </main>
  );
};

export default HomePage;
