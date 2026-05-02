import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import { createPortal } from "react-dom";
import type { User } from "../types/users.types";
import useModal from "../hooks/useModal";
import { useUserFormModalLogic } from "../hooks/useUserFormModalLogic";
import SelectField from "@/shared/ui/SelectField";

type UserFormGender = "Male" | "Female";

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
    isHospitalsLoading,
    ambulances,
    isAmbulancesLoading,
    selectedRole,
    selectedGender,
    selectedHospitalId,
    selectedAmbulanceId,
    handleRoleChange,
  } = useUserFormModalLogic({
    isOpen,
    mode,
    user,
    watch,
    setValue,
  });

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
            <input type="hidden" {...register("gender", { required: mode === "add" })} />
            <input type="hidden" {...register("hospitalId")} />
            <input type="hidden" {...register("ambulanceId")} />

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

            {/* Additional user profile fields */}
            <>
              {/* National ID */}
              <div>
                <label
                  htmlFor="nationalId"
                  className="block text-sm font-medium text-body mb-1.5"
                >
                  {t("form.nationalId")} {mode === "add" && <span className="text-danger">*</span>}
                </label>
                <input
                  type="text"
                  id="nationalId"
                  {...register("nationalId", { required: mode === "add" })}
                  disabled={isLoading}
                  className={`w-full px-3.5 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 transition-all bg-background text-heading placeholder:text-muted ${
                    errors.nationalId
                      ? "border-danger focus:ring-danger/20"
                      : "border-border focus:ring-primary/30 focus:border-primary"
                  }`}
                  placeholder={t("form.nationalIdPlaceholder")}
                />
                {errors.nationalId && (
                  <p className="mt-1.5 text-xs text-danger">
                    {errors.nationalId.message ||
                      t("form.nationalId") + " is required"}
                  </p>
                )}
              </div>

              {/* Gender */}
              <div>
                <SelectField
                  id="gender"
                  label={t("form.gender")}
                  required={mode === "add"}
                  value={selectedGender}
                  onChange={(value) =>
                    setValue("gender", value as UserFormGender, {
                      shouldDirty: true,
                      shouldValidate: true,
                    })
                  }
                  options={[
                    { value: "Male", label: t("genders.Male") },
                    { value: "Female", label: t("genders.Female") },
                  ]}
                  placeholder={t("form.selectGender")}
                  disabled={isLoading}
                  triggerClassName="rounded-xl px-3.5 py-2.5 text-sm"
                  error={
                    errors.gender?.message
                      ? String(errors.gender.message)
                      : undefined
                  }
                />
              </div>

              {/* Age */}
              <div>
                <label
                  htmlFor="age"
                  className="block text-sm font-medium text-body mb-1.5"
                >
                  {t("form.age")} {mode === "add" && <span className="text-danger">*</span>}
                </label>
                <input
                  type="number"
                  id="age"
                  min={mode === "add" ? 1 : 0}
                  max={120}
                  {...register("age", {
                    required: mode === "add",
                    setValueAs: (value) =>
                      value === "" || value === null || value === undefined
                        ? undefined
                        : Number(value),
                  })}
                  disabled={isLoading}
                  className={`w-full px-3.5 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 transition-all bg-background text-heading placeholder:text-muted ${
                    errors.age
                      ? "border-danger focus:ring-danger/20"
                      : "border-border focus:ring-primary/30 focus:border-primary"
                  }`}
                  placeholder={t("form.agePlaceholder")}
                />
                {errors.age && (
                  <p className="mt-1.5 text-xs text-danger">
                    {errors.age.message || t("form.age") + " is required"}
                  </p>
                )}
              </div>
            </>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-body mb-1.5"
              >
                {t("form.password")} {mode === "add" && <span className="text-danger">*</span>}
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
                {t("form.phone")} {mode === "add" && <span className="text-danger">*</span>}
              </label>
              <input
                type="tel"
                id="phoneNumber"
                {...register("phoneNumber", { required: mode === "add" })}
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
                  {errors.phoneNumber.message || t("form.phone") + " is required"}
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
                onChange={handleRoleChange}
                options={[
                  ...(mode === "edit"
                    ? [{ value: "SuperAdmin", label: t("roles.SuperAdmin") }]
                    : []),
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
                <p className="mt-1.5 text-xs text-muted">
                  {t("form.hospitalAdminHint")}
                </p>
              </div>
            )}
            {selectedRole === "AmbulanceDriver" && (
              <div>
                <SelectField
                  id="ambulanceId"
                  label={t("form.ambulance")}
                  required
                  value={selectedAmbulanceId}
                  onChange={(value) =>
                    setValue("ambulanceId", value, {
                      shouldDirty: true,
                      shouldValidate: true,
                    })
                  }
                  options={ambulances.map((ambulance) => ({
                    value: String(ambulance.id),
                    label: ambulance.name,
                  }))}
                  placeholder={t("form.selectAmbulance")}
                  disabled={isLoading || isAmbulancesLoading}
                  triggerClassName="rounded-xl px-3.5 py-2.5 text-sm"
                  error={
                    errors.ambulanceId?.message
                      ? String(errors.ambulanceId.message)
                      : undefined
                  }
                />
                {isAmbulancesLoading && (
                  <p className="mt-1.5 text-xs text-muted">
                    <FontAwesomeIcon
                      icon={faSpinner}
                      className="animate-spin mr-1"
                    />
                    {t("form.loadingAmbulances")}
                  </p>
                )}
                <p className="mt-1.5 text-xs text-muted">
                  {t("form.ambulanceDriverHint")}
                </p>
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
