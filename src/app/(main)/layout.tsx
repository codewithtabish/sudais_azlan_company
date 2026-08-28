import Footer from "@/components/general/footer/footer";
import { Container } from "@/components/general/layouts/conatiner";
import React from "react";

const MainPublicLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main>
      <Container>{children}</Container>
      <Footer />
    </main>
  );
};

export default MainPublicLayout;
