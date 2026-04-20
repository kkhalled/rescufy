import { useEffect, useMemo, useState } from "react";
import { HospitalCard } from "./HospitalCard";
import { HospitalFormModal } from "./HospitalFormModal";
import { HospitalsKPISection } from "./HospitalsKPISection";
import { HospitalsInsightsPanel } from "./HospitalsInsightsPanel";
import { useHospitals } from "../hooks/useHospitals";
import { useTranslation } from "react-i18next";
import { motion, useReducedMotion } from "framer-motion";
import { useNavigate } from "react-router";
import { ListFilter, Plus, ShieldAlert } from "lucide-react";
import type { HospitalLoadStatus } from "../utils/hospital.metrics";
import { resolveHospitalLoad } from "../utils/hospital.metrics";
import SelectField from "@/shared/ui/SelectField";

type HospitalSort = "criticalFirst" | "occupancyHigh" | "availableHigh";

const STATUS_PRIORITY: Record<HospitalLoadStatus, number> = {
  FULL: 0,
  CRITICAL: 1,
  BUSY: 2,
  NORMAL: 3,
};

function sanitizePhoneNumber(phone: string) {
  return phone.replace(/\s+/g, "");
}

export default function AllHospitals() {
  const { t } = useTranslation("hospitals");
  const shouldReduceMotion = useReducedMotion();
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState<HospitalSort>("criticalFirst");
  const [deleteCandidate, setDeleteCandidate] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const {
    hospitals,
    search,
    status,
    setSearch,
    setStatus,
    isModalOpen,
    modalMode,
    selectedHospital,
    isLoading,
    openAddModal,
    openEditModal,
    closeModal,
    submitHospital,
    handleDeleteHospital,
  } = useHospitals();

  const operationalHospitals = useMemo(
    () =>
      hospitals.map((hospital) => {
        const load = resolveHospitalLoad(hospital.availableBeds, hospital.bedCapacity);

        return {
          ...hospital,
          ...load,
        };
      }),
    [hospitals],
  );

  const sortedHospitals = useMemo(() => {
    const items = [...operationalHospitals];

    if (sortBy === "occupancyHigh") {
      return items.sort((a, b) => b.occupancyPercent - a.occupancyPercent);
    }

    if (sortBy === "availableHigh") {
      return items.sort((a, b) => b.availableBeds - a.availableBeds);
    }

    return items.sort((a, b) => {
      const priorityDelta = STATUS_PRIORITY[a.status] - STATUS_PRIORITY[b.status];

      if (priorityDelta !== 0) {
        return priorityDelta;
      }

      return b.occupancyPercent - a.occupancyPercent;
    });
  }, [operationalHospitals, sortBy]);

  const kpis = useMemo(() => {
    const total = operationalHospitals.length;
    const normal = operationalHospitals.filter((item) => item.status === "NORMAL").length;
    const busyOrCritical = operationalHospitals.filter(
      (item) => item.status === "BUSY" || item.status === "CRITICAL",
    ).length;
    const full = operationalHospitals.filter((item) => item.status === "FULL").length;

    return {
      total,
      normal,
      busyOrCritical,
      full,
    };
  }, [operationalHospitals]);

  const insights = useMemo(() => {
    const totalUsedBeds = operationalHospitals.reduce((sum, item) => sum + item.usedBeds, 0);
    const totalAvailableBeds = operationalHospitals.reduce(
      (sum, item) => sum + item.availableBeds,
      0,
    );
    const avgOccupancy =
      operationalHospitals.length > 0
        ? Math.round(
            operationalHospitals.reduce((sum, item) => sum + item.occupancyPercent, 0) /
              operationalHospitals.length,
          )
        : 0;

    const stressedHospitals = [...operationalHospitals]
      .filter((item) => item.status === "FULL" || item.status === "CRITICAL")
      .sort((a, b) => b.occupancyPercent - a.occupancyPercent)
      .slice(0, 5)
      .map((item) => ({
        id: item.id,
        name: item.name,
        status: item.status,
        occupancyPercent: item.occupancyPercent,
      }));

    return {
      totalUsedBeds,
      totalAvailableBeds,
      avgOccupancy,
      stressedHospitals,
    };
  }, [operationalHospitals]);

  const statusOptions = useMemo(
    () => [
      { label: t("filters.allStates"), value: "all" },
      { label: t("status.full"), value: "FULL" },
      { label: t("status.critical"), value: "CRITICAL" },
      { label: t("status.busy"), value: "BUSY" },
      { label: t("status.normal"), value: "NORMAL" },
    ],
    [t],
  );

  const sortOptions = useMemo(
    () => [
      { label: t("operations.filters.sort.criticalFirst"), value: "criticalFirst" },
      { label: t("operations.filters.sort.occupancyHigh"), value: "occupancyHigh" },
      { label: t("operations.filters.sort.availableHigh"), value: "availableHigh" },
    ],
    [t],
  );

  const controlTone =
    kpis.full > 0
      ? "bg-red-500"
      : kpis.busyOrCritical > 0
        ? "bg-amber-500"
        : "bg-emerald-500";

  const listVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.08,
        delayChildren: shouldReduceMotion ? 0 : 0.06,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 14,
      scale: shouldReduceMotion ? 1 : 0.99,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: shouldReduceMotion ? 0.15 : 0.42,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  };

  const handleConfirmDelete = async () => {
    if (!deleteCandidate) {
      return;
    }

    const isDeleted = await handleDeleteHospital(deleteCandidate.id, deleteCandidate.name);

    if (isDeleted) {
      setDeleteCandidate(null);
    }
  };

  useEffect(() => {
    if (!deleteCandidate) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || isLoading) {
        return;
      }

      setDeleteCandidate(null);
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [deleteCandidate, isLoading]);

  return (
    <div className="mt-6 space-y-6">
      <HospitalsKPISection
        total={kpis.total}
        normal={kpis.normal}
        busyOrCritical={kpis.busyOrCritical}
        full={kpis.full}
      />

      <section className="rounded-2xl border border-border bg-bg-card p-4 md:p-5 shadow-card">
        <div className="mb-4 flex items-center gap-2 text-heading">
          <ListFilter className="h-4 w-4 text-primary" />
          <p className="text-sm font-semibold">{t("operations.filters.title")}</p>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          <div className="xl:col-span-2">
            <label className="mb-1 block text-xs uppercase tracking-[0.08em] text-muted">
              {t("operations.filters.searchLabel")}
            </label>
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t("filters.searchPlaceholder")}
              className="h-11 w-full rounded-lg border border-border bg-background-second px-3 text-sm text-heading outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <SelectField
              label={t("operations.filters.statusLabel")}
              placeholder={t("operations.filters.statusLabel")}
              value={status}
              onChange={setStatus}
              options={statusOptions}
              labelClassName="mb-1 block text-xs uppercase tracking-[0.08em] text-muted"
              triggerClassName="h-11 rounded-lg text-sm"
            />
          </div>

          <div>
            <SelectField
              label={t("operations.filters.sortLabel")}
              placeholder={t("operations.filters.sortLabel")}
              value={sortBy}
              onChange={(value) => setSortBy(value as HospitalSort)}
              options={sortOptions}
              labelClassName="mb-1 block text-xs uppercase tracking-[0.08em] text-muted"
              triggerClassName="h-11 rounded-lg text-sm"
            />
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="rounded-2xl border border-border bg-background-second/60 p-4 md:p-5 shadow-card">
          <header className="mb-4 flex flex-col gap-2 border-b border-border pb-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-base font-semibold text-heading">{t("operations.list.title")}</h3>
              <p className="text-xs text-muted">
                {t("operations.list.subtitle", { count: sortedHospitals.length })}
              </p>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-muted/40 px-3 py-1 text-xs text-muted">
              <span className={`h-2 w-2 rounded-full ${controlTone}`} />
              {t("operations.liveMonitoring")}
            </div>
          </header>

          {isLoading ? (
            <div className="rounded-xl border border-dashed border-border bg-surface-muted/40 px-4 py-8 text-center">
              <ShieldAlert className="mx-auto h-7 w-7 text-muted" />
              <p className="mt-3 text-sm font-medium text-heading">{t("operations.loading")}</p>
            </div>
          ) : sortedHospitals.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-surface-muted/40 px-4 py-8 text-center">
              <ShieldAlert className="mx-auto h-7 w-7 text-muted" />
              <p className="mt-3 text-sm font-medium text-heading">{t("empty.title")}</p>
              <p className="mt-1 text-xs text-muted">{t("empty.description")}</p>
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 gap-4 rounded-xl border border-border/50 bg-surface-muted/35 p-2 md:p-3 lg:grid-cols-2"
              variants={listVariants}
              initial="hidden"
              animate="visible"
            >
              {sortedHospitals.map((hospital) => (
                <motion.div key={hospital.id} variants={itemVariants}>
                  <HospitalCard
                    {...hospital}
                    onCall={() => {
                      window.location.href = `tel:${sanitizePhoneNumber(hospital.contactPhone)}`;
                    }}
                    onViewProfile={() => navigate(`/admin/hospitals_management/${hospital.id}`)}
                    onEdit={() => openEditModal(hospital)}
                    onDelete={() =>
                      setDeleteCandidate({
                        id: hospital.id,
                        name: hospital.name,
                      })
                    }
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </section>

        <HospitalsInsightsPanel
          totalHospitals={operationalHospitals.length}
          avgOccupancy={insights.avgOccupancy}
          totalAvailableBeds={insights.totalAvailableBeds}
          totalUsedBeds={insights.totalUsedBeds}
          stressedHospitals={insights.stressedHospitals}
        />
      </div>

      <button
        onClick={openAddModal}
        type="button"
        disabled={isLoading}
        className="fixed bottom-8 right-8 rtl:right-auto rtl:left-8 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full border border-primary/40 bg-primary text-white shadow-card transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
        aria-label={t("addHospital")}
      >
        <Plus className="h-6 w-6" />
      </button>

      <HospitalFormModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={submitHospital}
        hospital={selectedHospital}
        mode={modalMode}
        isLoading={isLoading}
      />

      {deleteCandidate ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          role="presentation"
          onClick={() => {
            if (!isLoading) {
              setDeleteCandidate(null);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={t("deleteDialog.title")}
            className="w-full max-w-md rounded-2xl border border-border bg-surface-card p-5 shadow-card"
            onClick={(event) => event.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-heading">{t("deleteDialog.title")}</h3>
            <p className="mt-2 text-sm text-body">
              {t("deleteDialog.description", { name: deleteCandidate.name })}
            </p>

            <div className="mt-5 flex items-center justify-end gap-3">
              <button
                type="button"
                disabled={isLoading}
                onClick={() => setDeleteCandidate(null)}
                className="rounded-xl border border-border px-4 py-2 text-sm font-medium text-body transition hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-60"
              >
                {t("deleteDialog.cancel")}
              </button>

              <button
                type="button"
                disabled={isLoading}
                onClick={() => {
                  void handleConfirmDelete();
                }}
                className="rounded-xl border border-danger/40 bg-danger px-4 py-2 text-sm font-semibold text-white transition hover:bg-danger/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? t("deleteDialog.deleting") : t("deleteDialog.confirm")}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}