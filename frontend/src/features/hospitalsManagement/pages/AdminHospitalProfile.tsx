import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useGetHospitalById } from "../hooks/useGetHospitalById";
import { useAdminHospitalProfileData } from "../hooks/useAdminHospitalProfileData";
import { HospitalProfileSkeleton } from "../components/profile/HospitalProfileSkeleton";
import { HospitalHeroPanel } from "../components/profile/HospitalHeroPanel";
import { HospitalProfileDetails } from "../components/profile/HospitalProfileDetails";
import { HospitalBedCapacityPanel } from "../components/profile/HospitalBedCapacityPanel";
import { HospitalRequestsStats } from "../components/profile/HospitalRequestsStats";

export default function AdminHospitalProfile() {
  const { id } = useParams<{ id: string }>();
  const { t, i18n } = useTranslation("hospitals");
  const { hospital, isLoading, fetchHospitalById } = useGetHospitalById();

  const {
    activeRequests,
    allRequests,
    feedbacks,
    weeklyStats,
    isRequestsLoading,
    isStatsLoading,
    isFeedbackLoading,
  } = useAdminHospitalProfileData(id);

  useEffect(() => {
    if (id) void fetchHospitalById(id);
  }, [id, fetchHospitalById]);

  if (isLoading) {
    return (
      <HospitalProfileSkeleton
        title={t("adminProfile.title")}
        subtitle={t("adminProfile.subtitle")}
        backToList={t("adminProfile.backToList")}
      />
    );
  }

  if (!hospital) {
    return (
      <section className="w-full xl:px-12 py-6">
        <div className="mx-auto max-w-xl rounded-2xl border border-border bg-bg-card p-8 text-center shadow-sm">
          <h1 className="text-xl font-semibold text-heading">{t("adminProfile.notFoundTitle")}</h1>
          <p className="mt-2 text-sm text-muted">{t("adminProfile.notFoundSubtitle")}</p>
          <Link
            to="/admin/hospitals_management"
            className="inline-flex items-center justify-center gap-2 mt-5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="text-xs" />
            {t("adminProfile.backToList")}
          </Link>
        </div>
      </section>
    );
  }

  const usedBeds = Math.max(hospital.bedCapacity - hospital.availableBeds, 0);
  const occupancy = hospital.bedCapacity > 0
    ? Math.round((usedBeds / hospital.bedCapacity) * 100)
    : 0;
  const barColorClass =
    occupancy >= 90 ? "bg-red-500" : occupancy >= 70 ? "bg-amber-500" : "bg-emerald-500";
  const formattedStartingPrice = Number.isFinite(hospital.startingPrice)
    ? hospital.startingPrice.toLocaleString(i18n.language)
    : "-";

  return (
    <section className="w-full xl:px-12 py-6">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-heading text-3xl font-semibold">{t("adminProfile.title")}</h1>
          <p className="text-muted text-sm mt-1">{t("adminProfile.subtitle")}</p>
        </div>
        <Link
          to="/admin/hospitals_management"
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-semibold text-heading hover:bg-surface-muted/60 transition-colors"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="text-xs" />
          {t("adminProfile.backToList")}
        </Link>
      </header>

      <div className="space-y-6">
        <HospitalHeroPanel hospital={hospital} />

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <HospitalProfileDetails
            hospital={hospital}
            formattedStartingPrice={formattedStartingPrice}
          />
          <HospitalBedCapacityPanel
            hospital={hospital}
            usedBeds={usedBeds}
            occupancy={occupancy}
            barColorClass={barColorClass}
          />
        </div>

        <HospitalRequestsStats
          activeRequests={activeRequests}
          allRequests={allRequests}
          feedbacks={feedbacks}
          weeklyStats={weeklyStats}
          isRequestsLoading={isRequestsLoading}
          isStatsLoading={isStatsLoading}
          isFeedbackLoading={isFeedbackLoading}
          locale={i18n.language}
        />
      </div>
    </section>
  );
}
