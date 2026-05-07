
import {
  faHospital,
  faMapMarkerAlt,
  faPhone,
  faBed,
  faBedPulse,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";

import InputFiled from "@/shared/ui/FormInput/InputFiled";

import HospitalProfileActions from "./HospitalProfileActions";

export default function HospitalProfileForm({
  form,
  handleChange,
  handleSubmit,
  resetForm,
}: any) {
  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 space-y-5"
    >
      {/* Fields */}
      {/* Reuse same grid pattern */}

      <div className="grid gap-4 sm:grid-cols-2">
        <InputFiled
        placeholder=""
          label="Hospital Name"
          id="name"
          name="name"
          icon={faHospital}
          type="text"
          value={form.name}
          onChange={handleChange}
        />

        <InputFiled
        placeholder=""
          label="Phone"
          id="phone"
          name="phone"
          icon={faPhone}
          type="text"
          value={form.phone}
          onChange={handleChange}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <InputFiled
        placeholder=""
          label="Address"
          id="address"
          name="address"
          icon={faMapMarkerAlt}
          type="text"
          value={form.address}
          onChange={handleChange}
        />

        <InputFiled
        placeholder=""
          label="Latitude"
          id="latitude"
          name="latitude"
          icon={faLocationDot}
          type="text"
          value={form.latitude}
          onChange={handleChange}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <InputFiled
        placeholder=""
          label="Longitude"
          id="longitude"
          name="longitude"
          icon={faLocationDot}
          type="text"
          value={form.longitude}
          onChange={handleChange}
        />

        <InputFiled
        placeholder=""
          label="Total Beds"
          id="totalBeds"
          name="totalBeds"
          icon={faBed}
          type="number"
          value={form.totalBeds}
          onChange={handleChange}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <InputFiled
        placeholder=""
          label="Available Beds"
          id="availableBeds"
          name="availableBeds"
          icon={faBedPulse}
          type="number"
          value={form.availableBeds}
          onChange={handleChange}
        />
      </div>

      <HospitalProfileActions
        resetForm={resetForm}
      />
    </form>
  );
}
