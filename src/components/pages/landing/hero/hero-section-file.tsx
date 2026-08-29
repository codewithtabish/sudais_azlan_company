import HeroSection from "./hero-section";

const brandLogos = Array.from({ length: 20 }, (_, index) => {
  const position = String(index + 1).padStart(2, "0");

  return {
    image: `https://cdn.shadcnstudio.com/ss-assets/template/landing-page/zolt/logo-${position}.png`,
    name: `Tech stack logo ${position}`,
  };
});

const HeroSectionFile = () => {
  return <HeroSection brandLogos={brandLogos} />;
};

export default HeroSectionFile;
