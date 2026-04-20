import DashBoardContent from "../components/DashBoardContent";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/app/provider/AuthContext";

export default function DashBoard() {
  const { t } = useTranslation("dashboard");
  const name = useAuth().user?.FullName;
  return (
    <>
      <main className="px-4 py-4 sm:px-6 md:px-8 md:py-5 lg:px-12">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-heading">{t("welcome", { name })}</h1>
            <p className="mt-1 text-sm text-muted">{t("monitoringCenter.subtitle")}</p>
          </div>

          <span className="inline-flex items-center gap-1.5 self-start rounded-full border border-emerald-500/35 bg-emerald-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-emerald-700 dark:text-emerald-300 md:self-auto">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            {t("monitoringCenter.liveTag")}
          </span>
        </div>

        <DashBoardContent />
      </main>
    </>
  );
}
