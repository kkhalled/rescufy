import { useState, useMemo, useCallback, useEffect } from "react";
import type { Hospital } from "../types/hospitals.types";
import { useGetHospitals } from "./useGetHospitals";
import { useAddHospital } from "./useAddHospital";
import { useUpdateHospital } from "./useUpdateHospital";
import { useDeleteHospital } from "./useDeleteHospital";
import hospitalFilter from "../utils/hospital.filter";

export function useHospitals() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedHospital, setSelectedHospital] = useState<
    Hospital | undefined
  >();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { hospitals, isLoading: isFetchLoading, fetchHospitals } = useGetHospitals();
  const { addHospital, isLoading: isAddLoading } = useAddHospital();
  const { updateHospital, isLoading: isUpdateLoading } = useUpdateHospital();
  const { deleteHospital, isLoading: isDeleteLoading } = useDeleteHospital();

  // Fetch hospitals on mount
  useEffect(() => {
    fetchHospitals();
  }, []);

  // Apply local search + status filtering
  const filteredHospitals = useMemo(() => {
    return hospitalFilter(hospitals, { search, status });
  }, [hospitals, search, status]);

  const openAddModal = useCallback(() => {
    setSelectedHospital(undefined);
    setModalMode("add");
    setIsModalOpen(true);
  }, []);

  const openEditModal = useCallback((hospital: Hospital) => {
    setSelectedHospital(hospital);
    setModalMode("edit");
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedHospital(undefined);
  }, []);

  const submitHospital = useCallback(
    async (hospital: Hospital) => {
      if (modalMode === "add") {
        const created = await addHospital(hospital);
        if (created) {
          setIsModalOpen(false);
          setSelectedHospital(undefined);
          await fetchHospitals();
        }
      } else {
        if (hospital.id) {
          const updated = await updateHospital(hospital.id, hospital);
          if (updated) {
            setIsModalOpen(false);
            setSelectedHospital(undefined);
            await fetchHospitals();
          }
        }
      }
    },
    [modalMode, addHospital, updateHospital, fetchHospitals]
  );

  const handleDeleteHospital = useCallback(
    async (hospitalId: string, hospitalName?: string) => {
      const success = await deleteHospital(hospitalId, hospitalName);
      if (success) {
        await fetchHospitals();
      }
      return success;
    },
    [deleteHospital, fetchHospitals]
  );

  return {
    hospitals: filteredHospitals,
    search,
    status,
    setSearch,
    setStatus,
    isModalOpen,
    modalMode,
    selectedHospital,
    isLoading: isFetchLoading || isAddLoading || isUpdateLoading || isDeleteLoading,
    openAddModal,
    openEditModal,
    closeModal,
    submitHospital,
    handleDeleteHospital,
  };
}
