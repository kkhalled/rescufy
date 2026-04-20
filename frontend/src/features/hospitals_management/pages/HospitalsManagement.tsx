import AllHospitals from "../components/AllHospitals";
import { useTranslation } from "react-i18next";

export default function HospitalsManagement() {
  const { t } = useTranslation('hospitals');

  return (
    <section className="w-full xl:px-12">
      <header className="rounded-2xl border border-border bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.18),transparent_48%),radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_40%),var(--background-card)] px-5 py-6 md:px-6 md:py-7 shadow-card">
        <h1 className="mb-2 text-3xl font-semibold text-heading md:text-4xl">
          {t('pageHeader.title')}
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-muted">
          {t('pageHeader.subtitle')}
        </p>
      </header>
      <AllHospitals />
    </section>
  );
}
