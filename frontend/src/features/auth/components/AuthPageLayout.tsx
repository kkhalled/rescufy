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
  return (
    <div
      className="
        relative isolate min-h-screen overflow-hidden

        bg-slate-50
        text-slate-900

        dark:bg-[#060b12]
        dark:text-white
      "
    >
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-[10%] top-[10%] h-96 w-96 rounded-full bg-cyan-500/10 blur-[120px] dark:bg-cyan-500/5" />

        <div className="absolute right-[8%] top-[12%] h-72 w-72 rounded-full bg-violet-500/10 blur-[100px] dark:bg-violet-500/5" />
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