import AllHospitals from "../components/AllHospitals";
import { useTranslation } from "react-i18next";

export default function HospitalsManagement() {
  const { t } = useTranslation("hospitals");

  return (
    <section className="w-full space-y-5 px-3 sm:px-4 md:px-6 xl:px-12">
      {/* Header */}
      <header
        className="
          rounded-2xl border border-border
          bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.12),transparent_45%),radial-gradient(circle_at_top_left,rgba(34,211,238,0.08),transparent_38%),var(--background-card)]
          px-4 py-5
          sm:px-5 sm:py-6
          md:px-6 md:py-7
          shadow-card
        "
      >
        <div className="max-w-3xl">
          <h1
            className="
              text-2xl font-semibold text-heading
              sm:text-3xl
              md:text-4xl
              leading-tight
            "
          >
            {t("pageHeader.title")}
          </h1>

          <p
            className="
              mt-2
              text-sm leading-relaxed text-muted
              md:text-base
            "
          >
            {t("pageHeader.subtitle")}
          </p>
        </div>
      </header>

      {/* Content */}
      <div className="space-y-5">
        <AllHospitals />
      </div>
    </section>
  );
}