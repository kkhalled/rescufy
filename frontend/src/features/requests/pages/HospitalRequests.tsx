import HospitalAllRequests from "../components/HospitalAllRequests";
import { useTranslation } from "react-i18next";

export default function HospitalRequests() {
  const { t } = useTranslation("requests");

  return (
    <section className="w-full xl:px-12">
      <header>
        <h1 className="text-heading mb-2 text-4xl font-semibold">
          {t("pageHeader.title")}
        </h1>
        <span className="text-muted text-sm">
          {t("hospital.requestsSubtitle")}
        </span>
      </header>
      <main className="mt-8">
        <HospitalAllRequests />
      </main>
    </section>
  );
}
