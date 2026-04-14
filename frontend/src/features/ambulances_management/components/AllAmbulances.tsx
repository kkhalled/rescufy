import { useEffect, useMemo, useState } from "react";
import { AmbulanceCard } from "./AmbulanceCard";
import { AmbulanceFormModal } from "./AmbulanceFormModal";
import { KPISection } from "./KPISection";
import { AlertsPanel } from "./AlertsPanel";
import { useAmbulances } from "../hooks/useAmbulances";
import type { AmbulanceProximity, AmbulanceSort } from "../types/ambulances.types";
import { useTranslation } from "react-i18next";
import { motion, useReducedMotion } from "framer-motion";
import { useNavigate } from "react-router";
import { ListFilter, Plus, ShieldAlert } from "lucide-react";
import SelectField from "@/shared/ui/SelectField";

export default function AllAmbulances() {
  const { t } = useTranslation("ambulances");
  const shouldReduceMotion = useReducedMotion();
  const navigate = useNavigate();
  const [deleteCandidate, setDeleteCandidate] = useState<{
    id: string;
    label: string;
  } | null>(null);

  const {
    ambulances,
    isLoading,
    isMutating,
    nowTs,
    search,
    status,
    hospital,
    proximity,
    sortBy,
    setSearch,
    setStatus,
    setHospital,
    setProximity,
    setSortBy,
    hospitals,
    controlCenter,
    isModalOpen,
    modalMode,
    selectedAmbulance,
    openAddModal,
    openEditModal,
    closeModal,
    submitAmbulance,
    assignAmbulance,
    trackAmbulance,
    changeAmbulanceStatus,
    handleDeleteAmbulance,
  } = useAmbulances();

  const statusOptions = useMemo(
    () => [
      { label: t("status.all"), value: "all" },
      { label: t("status.available"), value: "AVAILABLE" },
      { label: t("status.inTransit"), value: "IN_TRANSIT" },
      { label: t("status.busy"), value: "BUSY" },
      { label: t("status.maintenance"), value: "MAINTENANCE" },
    ],
    [t],
  );

  const proximityOptions = useMemo(
    () => [
      { label: t("controlCenter.filters.proximity.all"), value: "all" },
      { label: t("controlCenter.filters.proximity.near"), value: "near" },
      { label: t("controlCenter.filters.proximity.mid"), value: "mid" },
      { label: t("controlCenter.filters.proximity.far"), value: "far" },
    ],
    [t],
  );

  const sortOptions = useMemo(
    () => [
      { label: t("controlCenter.filters.sort.available"), value: "available" },
      { label: t("controlCenter.filters.sort.nearest"), value: "nearest" },
      { label: t("controlCenter.filters.sort.lastUpdated"), value: "lastUpdated" },
    ],
    [t],
  );

  const hospitalOptions = useMemo(
    () => [
      { value: "all", label: t("controlCenter.filters.hospitalAll") },
      ...hospitals,
    ],
    [hospitals, t],
  );

  const controlTone =
    controlCenter.connectionState === "connected"
      ? "bg-emerald-500"
      : controlCenter.connectionState === "reconnecting"
        ? "bg-amber-500"
        : controlCenter.connectionState === "disconnected"
          ? "bg-red-500"
          : "bg-cyan-500";

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

    const isDeleted = await handleDeleteAmbulance(deleteCandidate.id, deleteCandidate.label);

    if (isDeleted) {
      setDeleteCandidate(null);
    }
  };

  useEffect(() => {
    if (!deleteCandidate) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || isMutating) {
        return;
      }

      setDeleteCandidate(null);
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [deleteCandidate, isMutating]);

  return (
    <div className="mt-6 space-y-6">
      <KPISection
        total={controlCenter.kpis.total}
        available={controlCenter.kpis.available}
        busy={controlCenter.kpis.busy}
        maintenance={controlCenter.kpis.maintenance}
      />

      <section className="rounded-2xl border border-border bg-bg-card p-4 md:p-5 shadow-card">
        <div className="mb-4 flex items-center gap-2 text-heading">
          <ListFilter className="h-4 w-4 text-primary" />
          <p className="text-sm font-semibold">{t("controlCenter.filters.title")}</p>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
          <div className="xl:col-span-2">
            <label className="mb-1 block text-xs uppercase tracking-[0.08em] text-muted">
              {t("controlCenter.filters.searchLabel")}
            </label>
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t("controlCenter.filters.searchPlaceholder")}
              className="h-11 w-full rounded-lg border border-border bg-background-second px-3 text-sm text-heading outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <SelectField
              label={t("table.status")}
              placeholder={t("table.status")}
              value={status}
              onChange={setStatus}
              options={statusOptions}
              labelClassName="mb-1 block text-xs uppercase tracking-[0.08em] text-muted"
              triggerClassName="h-11 rounded-lg text-sm"
            />
          </div>

          <div>
            <SelectField
              label={t("table.hospital")}
              placeholder={t("table.hospital")}
              value={hospital}
              onChange={setHospital}
              options={hospitalOptions}
              labelClassName="mb-1 block text-xs uppercase tracking-[0.08em] text-muted"
              triggerClassName="h-11 rounded-lg text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <SelectField
                label={t("controlCenter.filters.proximity.label")}
                placeholder={t("controlCenter.filters.proximity.label")}
                value={proximity}
                onChange={(value) => setProximity(value as AmbulanceProximity)}
                options={proximityOptions}
                labelClassName="mb-1 block text-xs uppercase tracking-[0.08em] text-muted"
                triggerClassName="h-11 rounded-lg text-sm"
              />
            </div>

            <div>
              <SelectField
                label={t("controlCenter.filters.sort.label")}
                placeholder={t("controlCenter.filters.sort.label")}
                value={sortBy}
                onChange={(value) => setSortBy(value as AmbulanceSort)}
                options={sortOptions}
                labelClassName="mb-1 block text-xs uppercase tracking-[0.08em] text-muted"
                triggerClassName="h-11 rounded-lg text-sm"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="rounded-2xl border border-border bg-background-second/60 p-4 md:p-5 shadow-card">
          <header className="mb-4 flex flex-col gap-2 border-b border-border pb-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-base font-semibold text-heading">{t("controlCenter.list.title")}</h3>
              <p className="text-xs text-muted">
                {t("controlCenter.list.subtitle", { count: ambulances.length })}
              </p>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-muted/40 px-3 py-1 text-xs text-muted">
              <span className={`h-2 w-2 rounded-full ${controlTone}`} />
              {t("controlCenter.liveMonitoring")}
            </div>
          </header>

          {isLoading ? (
            <div className="rounded-xl border border-dashed border-border bg-surface-muted/40 px-4 py-8 text-center">
              <ShieldAlert className="mx-auto h-7 w-7 text-muted" />
              <p className="mt-3 text-sm font-medium text-heading">
                {t("controlCenter.loading")}
              </p>
            </div>
          ) : ambulances.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-surface-muted/40 px-4 py-8 text-center">
              <ShieldAlert className="mx-auto h-7 w-7 text-muted" />
              <p className="mt-3 text-sm font-medium text-heading">
                {t("controlCenter.empty.title")}
              </p>
              <p className="mt-1 text-xs text-muted">{t("controlCenter.empty.subtitle")}</p>
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 gap-4 rounded-xl border border-border/50 bg-surface-muted/35 p-2 md:p-3 lg:grid-cols-2"
              variants={listVariants}
              initial="hidden"
              animate="visible"
            >
              {ambulances.map((ambulance) => (
                <motion.div key={ambulance.id} variants={itemVariants}>
                  <AmbulanceCard
                    {...ambulance}
                    onAssign={() => assignAmbulance(ambulance.id)}
                    onTrack={() => trackAmbulance(ambulance.id)}
                    onChangeStatus={(nextStatus) =>
                      changeAmbulanceStatus(ambulance.id, nextStatus)
                    }
                    onEdit={() => openEditModal(ambulance)}
                    onDelete={() =>
                      setDeleteCandidate({
                        id: ambulance.id,
                        label: ambulance.licensePlate,
                      })
                    }
                    onViewProfile={() =>
                      navigate(`/admin/ambulances_management/${ambulance.id}`, {
                        state: {
                          ambulanceSnapshot: {
                            id: ambulance.id,
                            licensePlate: ambulance.licensePlate,
                            hospitalId: ambulance.hospitalId,
                            status: ambulance.status,
                            latitude: ambulance.latitude,
                            longitude: ambulance.longitude,
                            hospitalName: ambulance.hospitalName,
                          },
                        },
                      })
                    }
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </section>

        <AlertsPanel
          alerts={controlCenter.alerts}
          nowTs={nowTs}
          connectionState={controlCenter.connectionState}
          heartbeatSecondsAgo={controlCenter.heartbeatSecondsAgo}
          criticalCount={controlCenter.kpis.critical}
        />
      </div>

      <button
        onClick={openAddModal}
        type="button"
        disabled={isMutating}
        className="fixed bottom-8 right-8 rtl:right-auto rtl:left-8 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full border border-primary/40 bg-primary text-white shadow-card transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
        aria-label={t("addAmbulance")}
      >
        <Plus className="h-6 w-6" />
      </button>

      <AmbulanceFormModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={submitAmbulance}
        ambulance={selectedAmbulance}
        mode={modalMode}
      />

      {deleteCandidate ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          role="presentation"
          onClick={() => {
            if (!isMutating) {
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
              {t("deleteDialog.description", { name: deleteCandidate.label })}
            </p>

            <div className="mt-5 flex items-center justify-end gap-3">
              <button
                type="button"
                disabled={isMutating}
                onClick={() => setDeleteCandidate(null)}
                className="rounded-xl border border-border px-4 py-2 text-sm font-medium text-body transition hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-60"
              >
                {t("deleteDialog.cancel")}
              </button>

              <button
                type="button"
                disabled={isMutating}
                onClick={() => {
                  void handleConfirmDelete();
                }}
                className="rounded-xl border border-danger/40 bg-danger px-4 py-2 text-sm font-semibold text-white transition hover:bg-danger/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isMutating ? t("deleteDialog.deleting") : t("deleteDialog.confirm")}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
