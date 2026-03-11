import SearchBar from "@/shared/common/SearchBar";
import HospitalsStates from "./HospitalsStates";
import { HospitalCard } from "./HospitalCard";
import { HospitalFormModal } from "./HospitalFormModal";
import { useHospitals } from "../hooks/useHospitals";
import { useTranslation } from "react-i18next";

export default function AllHospitals() {
  const { t } = useTranslation('hospitals');
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

  return (
    <>
      <div className="my-6">
        <SearchBar
          value={search}
          onSearchChange={setSearch}
          placeholder={t('filters.searchPlaceholder')}
        >
          <HospitalsStates value={status} onChange={setStatus} />
        </SearchBar>
      </div>

      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {hospitals.length > 0 ? (
          hospitals.map((hospital) => (
            <HospitalCard
              key={hospital.id}
              {...hospital}
              onEdit={() => openEditModal(hospital)}
              onDelete={() => handleDeleteHospital(hospital.id, hospital.name)}
            />
          ))
        ) : (
          <div className="col-span-full flex items-center justify-center py-12">
            <p className="text-muted text-sm">
              {isLoading ? t('empty.title') : t('empty.title')}
            </p>
          </div>
        )}
      </main>

      <button
        onClick={openAddModal}
        className="fixed bottom-8 right-8 rtl:right-auto rtl:left-8 w-14 h-14 rounded-full bg-primary text-white text-xl shadow-lg"
      >
        +
      </button>

      <HospitalFormModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={submitHospital}
        hospital={selectedHospital}
        mode={modalMode}
        isLoading={isLoading}
      />
    </>
  );
}
