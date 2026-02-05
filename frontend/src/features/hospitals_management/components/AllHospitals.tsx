import { useState } from "react";
import { hospitalsData } from "../data/hospitals.data";
import type { Hospital } from "../data/hospitals.data";
import hospitalFilter from "../utils/hospital.filter";
import SearchBar from "@/shared/common/SearchBar";
import HospitalsStates from "./HospitalsStates";
import { HospitalCard } from "./HospitalCard";
import { HospitalFormModal } from "./HospitalFormModal";

export default function AllHospitals() {
  const [searchValue, setSearchValue] = useState<string>("");
  const [status, setStatus] = useState<string>("all");
  const [hospitals, setHospitals] = useState<Hospital[]>(hospitalsData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState<
    Hospital | undefined
  >();
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");

  const filters = {
    status,
    search: searchValue,
  };

  const filteredHospitals = hospitalFilter(hospitals, filters);

  const handleAddHospital = () => {
    setSelectedHospital(undefined);
    setModalMode("add");
    setIsModalOpen(true);
  };

  const handleEditHospital = (hospital: Hospital) => {
    setSelectedHospital(hospital);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleSubmit = (updatedHospital: Hospital) => {
    if (modalMode === "add") {
      setHospitals([...hospitals, updatedHospital]);
    } else {
      setHospitals(
        hospitals.map((h) =>
          h.id === updatedHospital.id ? updatedHospital : h,
        ),
      );
    }
  };

  return (
    <>
      <div className="my-6">
        <SearchBar
          value={searchValue}
          onSearchChange={setSearchValue}
          placeholder="Search hospitals by name, address, or ID"
        >
          <div className="w-1/4">
            <HospitalsStates value={status} onChange={setStatus} />
          </div>
        </SearchBar>
      </div>

      <main className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {filteredHospitals.map((hospital) => (
          <HospitalCard
            key={hospital.id}
            id={hospital.id}
            name={hospital.name}
            email={hospital.email}
            status={hospital.status}
            usedBeds={hospital.usedBeds}
            totalBeds={hospital.totalBeds}
            address={hospital.address}
            onEdit={() => handleEditHospital(hospital)}
          />
        ))}
      </main>

      <button
        onClick={handleAddHospital}
        className="cursor-pointer fixed bottom-8 right-8 z-40 w-14 h-14 rounded-full bg-linear-to-r from-primary to-primary/90 text-white text-xl font-bold shadow-lg hover:shadow-xl transition-all active:scale-95"
      >
        +
      </button>

      <HospitalFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        hospital={selectedHospital}
        mode={modalMode}
      />
    </>
  );
}
