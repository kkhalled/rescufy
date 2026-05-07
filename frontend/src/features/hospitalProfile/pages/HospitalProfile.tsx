import { useHospitalProfile } from "../hooks/useHospitalProfile";

import HospitalProfileHeader from "../components/HospitalProfileHeader";
import HospitalIdentityCard from "../components/HospitalIdentityCard";
import HospitalProfileForm from "../components/HospitalProfileForm";
import HospitalProfileLoading from "../components/HospitalProfileLoading";
import HospitalProfileEmpty from "../components/HospitalProfileEmpty";

export default function HospitalProfile() {
  const profile = useHospitalProfile();

  if (profile.isLoading) {
    return <HospitalProfileLoading />;
  }

  if (!profile.hospital) {
    return <HospitalProfileEmpty />;
  }

  return (
    <div
      className="
        min-h-screen

        bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.06),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(239,68,68,0.05),transparent_24%),var(--background)]

        px-3 py-5
        sm:px-5 sm:py-6
        lg:px-8
      "
    >
      <div className="mx-auto max-w-6xl">
        <HospitalProfileHeader
          isLoading={profile.isLoading}
          onRefresh={profile.fetchMyHospital}
        />

        <div
          className="
            rounded-3xl
            border border-white/[0.05]
            bg-surface-card/95
            p-5 sm:p-6
            shadow-card
          "
        >
          <HospitalIdentityCard
            hospital={profile.hospital}
            form={profile.form}
            occupancy={profile.occupancy}
            updateHospitalStatus={profile.updateHospitalStatus}
          />

          <HospitalProfileForm
            form={profile.form}
            handleChange={profile.handleChange}
            handleSubmit={profile.handleSubmit}
            resetForm={profile.resetForm}
          />
        </div>
      </div>
    </div>
  );
}