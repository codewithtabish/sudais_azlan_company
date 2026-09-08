import Image from "next/image";
import { LandingPageTerminal } from "./landing-about"; // adjust path if needed

const LandingPageAbout = () => {
  return (
    <section className="w-full py-16 md:py-24 lg:py-28">
      <h2 className="text-3xl sm:text-4xl font-bold py-8 tracking-tight text-foreground">
        About Me
      </h2>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* ========== LEFT SIDE - Terminal ========== */}
          <div className="w-full order-2 lg:order-1">
            <LandingPageTerminal />
          </div>

          {/* ========== RIGHT SIDE - Image + Title + Description ========== */}
          <div className="order-1 lg:order-2 space-y-6">
            {/* Image */}
            <div className="relative w-full max-w-[420px] mx-auto lg:mx-0">
              <Image
                src="/images/about.png"
                alt="Sudais Azlan"
                width={1159}
                height={1356}
                className="w-full h-auto rounded-2xl object-cover shadow-2xl"
                priority
              />
            </div>

            {/* Title + Description */}
            {/* <div className="space-y-3 text-center lg:text-left">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                About Me
              </h2>
              <p className="text-muted-foreground text-base sm:text-lg leading-relaxed max-w-md mx-auto lg:mx-0">
                I’m Sudais Azlan — an AI & Software Engineer who builds intelligent systems,
                generative AI products, and scalable applications that solve real problems.
              </p>
              <p className="text-muted-foreground text-base sm:text-lg leading-relaxed max-w-md mx-auto lg:mx-0">
                From idea to production, I focus on practical AI, clean architecture, and software
                people actually love to use.
              </p>
            </div> */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingPageAbout;
