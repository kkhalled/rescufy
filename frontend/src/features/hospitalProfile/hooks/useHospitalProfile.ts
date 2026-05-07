
import { useEffect, useMemo, useState } from "react";

import { useGetMyHospital } from "./useGetMyHospital";

export function useHospitalProfile() {
  const {
    hospital,
    isLoading,
    fetchMyHospital,
    updateHospitalStatus,
  } = useGetMyHospital();

  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
    latitude: "",
    longitude: "",
    totalBeds: "",
    availableBeds: "",
  });

  useEffect(() => {
    fetchMyHospital();
  }, []);

  useEffect(() => {
    if (!hospital) return;

    setForm({
      name: hospital.name || "",
      address: hospital.address || "",
      phone: hospital.contactPhone || "",
      latitude: String(hospital.latitude ?? ""),
      longitude: String(hospital.longitude ?? ""),
      totalBeds: String(hospital.bedCapacity ?? ""),
      availableBeds: String(hospital.availableBeds ?? ""),
    });
  }, [hospital]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const resetForm = () => {
    if (!hospital) return;

    setForm({
      name: hospital.name || "",
      address: hospital.address || "",
      phone: hospital.contactPhone || "",
      latitude: String(hospital.latitude ?? ""),
      longitude: String(hospital.longitude ?? ""),
      totalBeds: String(hospital.bedCapacity ?? ""),
      availableBeds: String(hospital.availableBeds ?? ""),
    });
  };

  const handleSubmit = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    // TODO:
    // update hospital
  };

  const occupancy = useMemo(() => {
    if (!form.totalBeds) return 0;

    return Math.round(
      ((Number(form.totalBeds) -
        Number(form.availableBeds)) /
        Number(form.totalBeds)) *
        100
    );
  }, [form.totalBeds, form.availableBeds]);

  return {
    hospital,
    isLoading,
    form,
    occupancy,
    fetchMyHospital,
    updateHospitalStatus,
    handleChange,
    handleSubmit,
    resetForm,
  };
}


