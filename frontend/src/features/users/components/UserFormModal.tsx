import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import { createPortal } from "react-dom";
import { useEffect } from "react";
import type { User } from "../types/users.types";
import useModal from "../hooks/useModal";
import { useGetHospitals } from "@/features/hospitals_management/hooks/useGetHospitals";
import SelectField from "@/shared/ui/SelectField";

type UserFormRole = "Admin" | "HospitalAdmin" | "Paramedic" | "AmbulanceDriver";

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (user: User) => void;
  user?: User;
  mode: "add" | "edit";
  isLoading?: boolean;
}

export function UserFormModal({
  isOpen,
  onClose,
  onSubmit,
  user,
  mode,
  isLoading = false,
}: UserFormModalProps) {
  const { t } = useTranslation("users");
  const { register, submitHandler, errors, watch, setValue } = useModal({
    onSubmit,
    user,
    mode,
  });

  const {
    hospitals,
    fetchHospitals,
    isLoading: isHospitalsLoading,
  } = useGetHospitals();
  const selectedRole = watch("role");
  const selectedHospitalId = watch("hospitalId") || "";

  // Fetch hospitals when the modal opens and role is HospitalAdmin
  useEffect(() => {
    if (isOpen && selectedRole === "HospitalAdmin") {
      fetchHospitals();
    }
  }, [isOpen, selectedRole]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-surface-card w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col rounded-2xl shadow-card border border-border">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-xl font-semibold text-heading">
            {mode === "add" ? t("actions.add") : t("actions.edit")}
          </h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-muted hover:text-heading transition-colors p-2 hover:bg-surface-muted rounded-lg disabled:opacity-50"
            aria-label="Close modal"
          >
            <FontAwesomeIcon
              icon={faXmark}
              className="w-5 h-5 cursor-pointer"
            />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={submitHandler} className="flex-1 overflow-y-auto">
          <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
            <input type="hidden" {...register("role", { required: true })} />
            <input type="hidden" {...register("hospitalId")} />

            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-body mb-1.5"
              >
                {t("form.name")} <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                id="name"
                {...register("name", { required: true })}
                disabled={isLoading}
                className={`w-full px-3.5 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 transition-all bg-background text-heading placeholder:text-muted ${
                  errors.name
                    ? "border-danger focus:ring-danger/20"
                    : "border-border focus:ring-primary/30 focus:border-primary"
                }`}
                placeholder={t("form.namePlaceholder")}
              />
              {errors.name && (
                <p className="mt-1.5 text-xs text-danger">
                  {errors.name.message || t("form.name") + " is required"}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-body mb-1.5"
              >
                {t("form.email")} <span className="text-danger">*</span>
              </label>
              <input
                type="email"
                id="email"
                {...register("email", { required: true })}
                disabled={isLoading}
                className={`w-full px-3.5 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 transition-all bg-background text-heading placeholder:text-muted ${
                  errors.email
                    ? "border-danger focus:ring-danger/20"
                    : "border-border focus:ring-primary/30 focus:border-primary"
                }`}
                placeholder={t("form.emailPlaceholder")}
              />
              {errors.email && (
                <p className="mt-1.5 text-xs text-danger">
                  {errors.email.message || t("form.email") + " is required"}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-body mb-1.5"
              >
                {t("form.password")} <span className="text-danger">*</span>
              </label>
              <input
                type="password"
                id="password"
                {...register("password")}
                disabled={isLoading}
                className={`w-full px-3.5 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 transition-all bg-background text-heading placeholder:text-muted ${
                  errors.password
                    ? "border-danger focus:ring-danger/20"
                    : "border-border focus:ring-primary/30 focus:border-primary"
                }`}
                placeholder={t("form.passwordPlaceholder")}
              />
              {errors.password && (
                <p className="mt-1.5 text-xs text-danger">
                  {errors.password.message ||
                    t("form.password") + " is required"}
                </p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium text-body mb-1.5"
              >
                {t("form.phone")} <span className="text-danger">*</span>
              </label>
              <input
                type="tel"
                id="phoneNumber"
                {...register("phoneNumber", { required: true })}
                disabled={isLoading}
                className={`w-full px-3.5 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 transition-all bg-background text-heading placeholder:text-muted ${
                  errors.phoneNumber
                    ? "border-danger focus:ring-danger/20"
                    : "border-border focus:ring-primary/30 focus:border-primary"
                }`}
                placeholder={t("form.phonePlaceholder")}
              />
              {errors.phoneNumber && (
                <p className="mt-1.5 text-xs text-danger">
                  {errors.phoneNumber.message ||
                    t("form.phone") + " is required"}
                </p>
              )}
            </div>

            {/* Role */}
            <div>
              <SelectField
                id="role"
                label={t("form.role")}
                required
                value={selectedRole || ""}
                onChange={(value) => {
                  setValue("role", value as UserFormRole, {
                    shouldDirty: true,
                    shouldValidate: true,
                  });

                  if (value !== "HospitalAdmin") {
                    setValue("hospitalId", "", {
                      shouldDirty: true,
                      shouldValidate: true,
                    });
                  }
                }}
                options={[
                  { value: "Admin", label: t("roles.Admin") },
                  { value: "HospitalAdmin", label: t("roles.HospitalAdmin") },
                  { value: "Paramedic", label: t("roles.Paramedic") },
                  { value: "AmbulanceDriver", label: t("roles.AmbulanceDriver") },
                ]}
                placeholder={t("form.selectRole")}
                disabled={isLoading}
                triggerClassName="rounded-xl px-3.5 py-2.5 text-sm"
                error={
                  errors.role?.message
                    ? String(errors.role.message)
                    : undefined
                }
              />
            </div>

            {/* Hospital (shown only for HospitalAdmin) */}
            {selectedRole === "HospitalAdmin" && (
              <div>
                <SelectField
                  id="hospitalId"
                  label={t("form.hospital")}
                  required
                  value={selectedHospitalId}
                  onChange={(value) =>
                    setValue("hospitalId", value, {
                      shouldDirty: true,
                      shouldValidate: true,
                    })
                  }
                  options={hospitals.map((hospital) => ({
                    value: String(hospital.id),
                    label: hospital.name,
                  }))}
                  placeholder={t("form.selectHospital")}
                  disabled={isLoading || isHospitalsLoading}
                  triggerClassName="rounded-xl px-3.5 py-2.5 text-sm"
                  error={
                    errors.hospitalId?.message
                      ? String(errors.hospitalId.message)
                      : undefined
                  }
                />
                {isHospitalsLoading && (
                  <p className="mt-1.5 text-xs text-muted">
                    <FontAwesomeIcon
                      icon={faSpinner}
                      className="animate-spin mr-1"
                    />
                    {t("form.loadingHospitals")}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex gap-3 justify-end px-6 py-4 border-t border-border bg-surface-muted">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2.5 text-sm font-medium text-body border border-border rounded-xl hover:bg-surface-muted transition-colors disabled:opacity-50"
            >
              {t("actions.cancel")}
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2.5 text-sm font-medium text-white bg-primary rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isLoading && (
                <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
              )}
              {mode === "add" ? t("actions.add") : t("actions.save")}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}
