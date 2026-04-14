
import AllRequests from "../components/AllRequests";
import { useTranslation } from "react-i18next";

export default function Request() {
  const { t } = useTranslation('requests');

  return (
    <section className="w-full xl:px-12">
      <header className="rounded-2xl border border-border bg-[linear-gradient(135deg,rgba(239,68,68,0.14),rgba(249,115,22,0.12),transparent)] px-5 py-6 shadow-card md:px-6 md:py-7">
        <h1 className="mb-2 text-3xl font-semibold text-heading md:text-4xl">
          {t('pageHeader.title')}
        </h1>
        <p className="max-w-2xl text-sm text-muted">{t('pageHeader.subtitle')}</p>
      </header>

      <main className="mt-6">
        <AllRequests />
      </main>
    </section>
  );
}
