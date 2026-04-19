import { useEffect, useState } from "react";
import { AmbulanceFormModal } from "./AmbulanceFormModal";
import { KPISection } from "./KPISection";
import { AmbulanceFleetPanel } from "./AmbulanceFleetPanel";
import { DeleteAmbulanceDialog } from "./DeleteAmbulanceDialog";
import { useAmbulances } from "../hooks/useAmbulances";
import type { Ambulance, AmbulanceControlItem } from "../types/ambulances.types";
import { useTranslation } from "react-i18next";
import { useReducedMotion } from "framer-motion";
import { useNavigate } from "react-router";
import { Plus } from "lucide-react";

export default function AllAmbulances() {
  const { t } = useTranslation("ambulances");
  const shouldReduceMotion = !!useReducedMotion();
  const navigate = useNavigate();
  const [deleteCandidate, setDeleteCandidate] = useState<{
    id: string;
    label: string;
  } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedAmbulance, setSelectedAmbulance] = useState<Ambulance | undefined>();

  const {
    ambulances,
    isLoading,
    isMutating,
    controlCenter,
    submitAmbulance,
    assignAmbulance,
    trackAmbulance,
    changeAmbulanceStatus,
    handleDeleteAmbulance,
  } = useAmbulances();

  const openAddModal = () => {
    setSelectedAmbulance(undefined);
    setModalMode("add");
    setIsModalOpen(true);
  };

  const openEditModal = (ambulance: AmbulanceControlItem) => {
    setSelectedAmbulance({
      id: ambulance.id,
      name: ambulance.name,
      ambulanceNumber: ambulance.ambulanceNumber,
      vehicleInfo: ambulance.vehicleInfo,
      driverPhone: ambulance.driverPhone,
      driverId: ambulance.driverId,
      driverName: ambulance.driverName,
      startingPrice: ambulance.startingPrice,
      ambulancePointId: ambulance.ambulancePointId,
      licensePlate: ambulance.ambulanceNumber,
      hospitalId: ambulance.ambulancePointId === null ? "0" : String(ambulance.ambulancePointId),
      status: ambulance.status,
      latitude: ambulance.latitude,
      longitude: ambulance.longitude,
    });
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmitAmbulance = async (ambulance: Ambulance) => {
    const isSaved = await submitAmbulance(ambulance, modalMode);

    if (isSaved) {
      setIsModalOpen(false);
    }
  };

  const handleViewProfile = (ambulance: AmbulanceControlItem) => {
    navigate(`/admin/ambulances_management/${ambulance.id}`, {
      state: {
        ambulanceSnapshot: {
          id: ambulance.id,
          name: ambulance.name,
          ambulanceNumber: ambulance.ambulanceNumber,
          vehicleInfo: ambulance.vehicleInfo,
          driverPhone: ambulance.driverPhone,
          driverId: ambulance.driverId,
          driverName: ambulance.driverName,
          startingPrice: ambulance.startingPrice,
          ambulancePointId: ambulance.ambulancePointId,
          licensePlate: ambulance.ambulanceNumber,
          hospitalId: ambulance.ambulancePointId === null ? "0" : String(ambulance.ambulancePointId),
          status: ambulance.status,
          latitude: ambulance.latitude,
          longitude: ambulance.longitude,
        },
      },
    });
  };

  const handleConfirmDelete = async () => {
    if (!deleteCandidate) {
      return;
    }

    const isDeleted = await handleDeleteAmbulance(deleteCandidate.id, deleteCandidate.label);

    if (isDeleted) {
      if (selectedAmbulance?.id === deleteCandidate.id) {
        setIsModalOpen(false);
        setSelectedAmbulance(undefined);
      }

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

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <AmbulanceFleetPanel
          ambulances={ambulances}
          isLoading={isLoading}
          shouldReduceMotion={shouldReduceMotion}
          connectionState={controlCenter.connectionState}
          onAssign={assignAmbulance}
          onTrack={trackAmbulance}
          onChangeStatus={changeAmbulanceStatus}
          onEdit={openEditModal}
          onDelete={setDeleteCandidate}
          onViewProfile={handleViewProfile}
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
        onSubmit={handleSubmitAmbulance}
        ambulance={selectedAmbulance}
        mode={modalMode}
      />

      <DeleteAmbulanceDialog
        candidate={deleteCandidate}
        isMutating={isMutating}
        onCancel={() => setDeleteCandidate(null)}
        onConfirm={() => {
          void handleConfirmDelete();
        }}
      />
    </div>
  );
}
