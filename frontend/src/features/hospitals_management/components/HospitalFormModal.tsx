import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { createPortal } from "react-dom";
import type { Hospital } from "../types/hospitals.types";
import useModal from "../hooks/useModal";
import { useTranslation } from "react-i18next";

interface HospitalFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (hospital: Hospital) => void;
  hospital?: Hospital;
  mode: "add" | "edit";
  isLoading?: boolean;
}

// Zod validation schema

export function HospitalFormModal({
  isOpen,
  onClose,
  onSubmit,
  hospital,
  mode,
  isLoading = false,
}: HospitalFormModalProps) {
  const { register, submitHandler, errors } = useModal({
    onSubmit,
    hospital,
    mode,
  });
  const { t } = useTranslation(['hospitals', 'common']);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-surface-card w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col rounded-2xl shadow-card border border-border">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-xl font-semibold text-heading">
            {mode === "add" ? t('hospitals:addHospital') : t('hospitals:editHospital')}
          </h2>
          <button
            onClick={onClose}
            className="text-muted hover:text-heading transition-colors p-2 hover:bg-surface-muted rounded-lg"
            aria-label={t('common:buttons.close')}
          >
            <FontAwesomeIcon
              icon={faXmark}
              className="w-5 h-5 cursor-pointer"
            />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={submitHandler} className="flex-1 overflow-y-auto">
          <div className="px-6 py-5 space-y-5">
            {/* Hidden ID field */}
            <input type="hidden" {...register("id")} />

            {/* Row 1: Hospital Name & Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Hospital Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-body mb-1.5"
                >
                  {t('hospitals:form.name')} <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  {...register("name")}
                  className={`w-full px-3.5 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 transition-all bg-background text-heading placeholder:text-muted ${errors.name
                      ? "border-danger focus:ring-danger/20"
                      : "border-border focus:ring-primary/30 focus:border-primary"
                    }`}
                  placeholder={t('hospitals:form.namePlaceholder')}
                />
                {errors.name && (
                  <p className="mt-1.5 text-xs text-danger">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Contact Phone */}
              <div>
                <label
                  htmlFor="contactPhone"
                  className="block text-sm font-medium text-body mb-1.5"
                >
                  {t('hospitals:form.phone')} <span className="text-danger">*</span>
                </label>
                <input
                  type="tel"
                  id="contactPhone"
                  {...register("contactPhone")}
                  className={`w-full px-3.5 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 transition-all bg-background text-heading placeholder:text-muted ${errors.contactPhone
                      ? "border-danger focus:ring-danger/20"
                      : "border-border focus:ring-primary/30 focus:border-primary"
                    }`}
                  placeholder={t('hospitals:form.phonePlaceholder')}
                />
                {errors.contactPhone && (
                  <p className="mt-1.5 text-xs text-danger">
                    {errors.contactPhone.message}
                  </p>
                )}
              </div>
            </div>

            {/* Row 2: Address */}
            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-body mb-1.5"
              >
                {t('hospitals:form.address')} <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                id="address"
                {...register("address")}
                className={`w-full px-3.5 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 transition-all bg-background text-heading placeholder:text-muted ${errors.address
                    ? "border-danger focus:ring-danger/20"
                    : "border-border focus:ring-primary/30 focus:border-primary"
                  }`}
                placeholder={t('hospitals:form.addressPlaceholder')}
              />
              {errors.address && (
                <p className="mt-1.5 text-xs text-danger">
                  {errors.address.message}
                </p>
              )}
            </div>

            {/* Row 3: Latitude & Longitude */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Latitude */}
              <div>
                <label
                  htmlFor="latitude"
                  className="block text-sm font-medium text-body mb-1.5"
                >
                  {t('hospitals:form.latitude')} <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  id="latitude"
                  step="0.0001"
                  {...register("latitude", { valueAsNumber: true })}
                  className={`w-full px-3.5 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 transition-all bg-background text-heading placeholder:text-muted ${errors.latitude
                      ? "border-danger focus:ring-danger/20"
                      : "border-border focus:ring-primary/30 focus:border-primary"
                    }`}
                  placeholder="31.2001"
                />
                {errors.latitude && (
                  <p className="mt-1.5 text-xs text-danger">
                    {errors.latitude.message}
                  </p>
                )}
              </div>

              {/* Longitude */}
              <div>
                <label
                  htmlFor="longitude"
                  className="block text-sm font-medium text-body mb-1.5"
                >
                  {t('hospitals:form.longitude')} <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  id="longitude"
                  step="0.0001"
                  {...register("longitude", { valueAsNumber: true })}
                  className={`w-full px-3.5 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 transition-all bg-background text-heading placeholder:text-muted ${errors.longitude
                      ? "border-danger focus:ring-danger/20"
                      : "border-border focus:ring-primary/30 focus:border-primary"
                    }`}
                  placeholder="29.9187"
                />
                {errors.longitude && (
                  <p className="mt-1.5 text-xs text-danger">
                    {errors.longitude.message}
                  </p>
                )}
              </div>
            </div>

            {/* Row 4: Bed Capacity & Available Beds */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Bed Capacity */}
              <div>
                <label
                  htmlFor="bedCapacity"
                  className="block text-sm font-medium text-body mb-1.5"
                >
                  {t('hospitals:form.bedCapacity')} <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  id="bedCapacity"
                  {...register("bedCapacity", { valueAsNumber: true })}
                  min="0"
                  className={`w-full px-3.5 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 transition-all bg-background text-heading placeholder:text-muted ${errors.bedCapacity
                      ? "border-danger focus:ring-danger/20"
                      : "border-border focus:ring-primary/30 focus:border-primary"
                    }`}
                  placeholder="0"
                />
                {errors.bedCapacity && (
                  <p className="mt-1.5 text-xs text-danger">
                    {errors.bedCapacity.message}
                  </p>
                )}
              </div>

              {/* Available Beds */}
              <div>
                <label
                  htmlFor="availableBeds"
                  className="block text-sm font-medium text-body mb-1.5"
                >
                  {t('hospitals:form.availableBeds')} <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  id="availableBeds"
                  {...register("availableBeds", { valueAsNumber: true })}
                  min="0"
                  className={`w-full px-3.5 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 transition-all bg-background text-heading placeholder:text-muted ${errors.availableBeds
                      ? "border-danger focus:ring-danger/20"
                      : "border-border focus:ring-primary/30 focus:border-primary"
                    }`}
                  placeholder="0"
                />
                {errors.availableBeds && (
                  <p className="mt-1.5 text-xs text-danger">
                    {errors.availableBeds.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border bg-surface-muted">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className=" cursor-pointer px-5 py-2.5 text-sm font-medium text-body bg-background-second border border-border rounded-xl hover:bg-surface-muted focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all disabled:opacity-50"
            >
              {t('hospitals:buttons.cancel')}
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className=" cursor-pointer px-5 py-2.5 text-sm font-medium text-white bg-primary rounded-xl hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-lg active:scale-95 disabled:opacity-50 flex items-center gap-2"
            >
              {isLoading && (
                <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
              )}
              {mode === "add" ? t('hospitals:buttons.add') : t('hospitals:buttons.update')}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
