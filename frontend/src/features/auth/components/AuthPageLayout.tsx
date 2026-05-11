import { useTranslation } from "react-i18next";

import HeroSection from "./HeroSection";
import AuthCard from "./AuthCard";

export interface AuthPageLayoutProps {
  children: React.ReactNode;
  subtitle?: string;
}

export default function AuthPageLayout({
  children,
  subtitle,
}: AuthPageLayoutProps) {
  const { t } = useTranslation("auth");

  return (
    <div
      className="
        relative isolate min-h-screen overflow-hidden

        bg-[#060b12]

        text-white
      "
    >
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-[10%] top-[10%] h-[24rem] w-[24rem] rounded-full bg-cyan-500/[0.05] blur-[120px]" />

        <div className="absolute right-[8%] top-[12%] h-[18rem] w-[18rem] rounded-full bg-violet-500/[0.05] blur-[100px]" />
      </div>

      <main
        className="
          relative z-10

          mx-auto

          flex min-h-screen
          w-full max-w-7xl

          items-center

          px-5 py-8

          sm:px-8

          lg:px-12
        "
      >
        <div
          className="
            grid w-full items-center gap-14

            lg:grid-cols-[1fr_360px]
          "
        >
          <HeroSection />

          <AuthCard subtitle={subtitle}>
            {children}
          </AuthCard>
        </div>
      </main>
    </div>
  );
}