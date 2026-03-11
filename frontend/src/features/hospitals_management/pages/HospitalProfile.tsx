import { useTranslation } from "react-i18next";
import {
  faHospital,
  faMapMarkerAlt,
  faPhone,
  faBed,
  faBedPulse,
  faSpinner,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import InputFiled from "@/shared/ui/FormInput/InputFiled";
import { useState, useEffect } from "react";
import { useGetMyHospital } from "../hooks/useGetMyHospital";

export default function HospitalProfile() {
  const { t } = useTranslation(["hospitals", "common"]);
  const { hospital, isLoading, fetchMyHospital } = useGetMyHospital();

  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
    latitude: "",
    longitude: "",
    totalBeds: "",
    availableBeds: "",
  });

  // Fetch hospital data on mount
  useEffect(() => {
    fetchMyHospital();
  }, []);

  // Populate form when hospital data is loaded
  useEffect(() => {
    if (hospital) {
      setForm({
        name: hospital.name || "",
        address: hospital.address || "",
        phone: hospital.contactPhone || "",
        latitude: String(hospital.latitude ?? ""),
        longitude: String(hospital.longitude ?? ""),
        totalBeds: String(hospital.bedCapacity ?? ""),
        availableBeds: String(hospital.availableBeds ?? ""),
      });
    }
  }, [hospital]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Update hospital data via PUT API
  };

  const occupancy = form.totalBeds
    ? Math.round(
        ((Number(form.totalBeds) - Number(form.availableBeds)) /
          Number(form.totalBeds)) *
          100
      )
    : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <FontAwesomeIcon icon={faSpinner} className="animate-spin text-primary text-3xl" />
      </div>
    );
  }

  if (!hospital) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <FontAwesomeIcon icon={faHospital} className="text-muted text-4xl mb-4" />
          <p className="text-muted text-sm">{t("hospitals:api.notFound")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-heading mb-2">
            {t("hospitals:hospitalProfile.title")}
          </h1>
          <p className="text-body text-sm sm:text-base">
            {t("hospitals:hospitalProfile.subtitle")}
          </p>
        </div>

        {/* Hospital Identity Card */}
        <div className="bg-surface-card rounded-2xl p-6 sm:p-8 shadow-card border border-border mb-6">
          <div className="flex items-center gap-4 p-4 bg-surface-muted rounded-xl border border-border mb-8">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary/10 flex items-center justify-center text-2xl sm:text-3xl font-bold text-primary ring-4 ring-primary/10">
              <FontAwesomeIcon icon={faHospital} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg sm:text-xl font-bold text-heading truncate">
                {form.name}
              </h3>
              <p className="text-muted text-sm truncate">{form.address}</p>
              <div className="mt-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-success/10 text-success rounded-md text-xs font-semibold">
                  {t("hospitals:status.normal")}
                </span>
              </div>
            </div>
          </div>

          {/* Bed Capacity Overview */}
          <div className="grid sm:grid-cols-3 gap-4 mb-8 p-5 bg-surface-muted rounded-xl border border-border">
            <div>
              <p className="text-xs text-muted mb-1">{t("hospitals:form.totalBeds")}</p>
              <p className="text-sm font-semibold text-body">{form.totalBeds}</p>
            </div>
            <div>
              <p className="text-xs text-muted mb-1">{t("hospitals:hospitalProfile.availableBeds")}</p>
              <p className="text-sm font-semibold text-success">{form.availableBeds}</p>
            </div>
            <div>
              <p className="text-xs text-muted mb-1">{t("hospitals:hospitalProfile.occupancy")}</p>
              <div className="flex items-center gap-2">
                <p className={`text-sm font-semibold ${occupancy > 85 ? "text-danger" : occupancy > 70 ? "text-warning" : "text-success"}`}>
                  {occupancy}%
                </p>
                <div className="flex-1 h-2 bg-white/20 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 rounded-full ${
                      occupancy > 85
                        ? "bg-red-500"
                        : occupancy > 70
                          ? "bg-yellow-500"
                          : "bg-green-500"
                    }`}
                    style={{ width: `${occupancy}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Editable Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <InputFiled
                label={t("hospitals:form.name")}
                id="name"
                name="name"
                icon={faHospital}
                placeholder={t("hospitals:form.namePlaceholder")}
                type="text"
                value={form.name}
                onChange={handleChange}
              />
              <InputFiled
                label={t("hospitals:form.address")}
                id="address"
                name="address"
                icon={faMapMarkerAlt}
                placeholder={t("hospitals:form.addressPlaceholder")}
                type="text"
                value={form.address}
                onChange={handleChange}
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <InputFiled
                label={t("hospitals:form.phone")}
                id="phone"
                name="phone"
                icon={faPhone}
                placeholder={t("hospitals:form.phonePlaceholder")}
                type="text"
                value={form.phone}
                onChange={handleChange}
              />
              <InputFiled
                label={t("hospitals:form.address")}
                id="address"
                name="address"
                icon={faMapMarkerAlt}
                placeholder={t("hospitals:form.addressPlaceholder")}
                type="text"
                value={form.address}
                onChange={handleChange}
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <InputFiled
                label={t("hospitals:form.latitude")}
                id="latitude"
                name="latitude"
                icon={faLocationDot}
                placeholder="e.g. 24.6892"
                type="text"
                value={form.latitude}
                onChange={handleChange}
              />
              <InputFiled
                label={t("hospitals:form.longitude")}
                id="longitude"
                name="longitude"
                icon={faLocationDot}
                placeholder="e.g. 46.6868"
                type="text"
                value={form.longitude}
                onChange={handleChange}
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <InputFiled
                label={t("hospitals:form.totalBeds")}
                id="totalBeds"
                name="totalBeds"
                icon={faBed}
                placeholder={t("hospitals:form.capacityPlaceholder")}
                type="number"
                value={form.totalBeds}
                onChange={handleChange}
              />
              <InputFiled
                label={t("hospitals:hospitalProfile.availableBeds")}
                id="availableBeds"
                name="availableBeds"
                icon={faBedPulse}
                placeholder={t("hospitals:hospitalProfile.availableBedsPlaceholder")}
                type="number"
                value={form.availableBeds}
                onChange={handleChange}
              />
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-border">
              <button
                type="submit"
                className="px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-all shadow-soft"
              >
                {t("hospitals:hospitalProfile.saveChanges")}
              </button>
              <button
                type="button"
                onClick={() => {
                  if (hospital) {
                    setForm({
                      name: hospital.name || "",
                      address: hospital.address || "",
                      phone: hospital.contactPhone || "",
                      latitude: String(hospital.latitude ?? ""),
                      longitude: String(hospital.longitude ?? ""),
                      totalBeds: String(hospital.bedCapacity ?? ""),
                      availableBeds: String(hospital.availableBeds ?? ""),
                    });
                  }
                }}
                className="px-6 py-3 bg-surface-muted text-body font-semibold rounded-lg hover:bg-surface-muted/80 transition-all border border-border"
              >
                {t("hospitals:hospitalProfile.cancel")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
