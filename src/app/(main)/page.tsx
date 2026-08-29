import Navbar from "@/components/general/navbar/navbar";
import BannerImageUploader from "@/components/general/upload-compoents/upload-banner";
import OgImageUploader from "@/components/general/upload-compoents/upload-og";

const HomePage = () => {
  return (
    <main>
      <Navbar />
      <BannerImageUploader />
      <OgImageUploader />
    </main>
  );
};

export default HomePage;
