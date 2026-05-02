import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { createPortal } from "react-dom";
import type { Ambulance } from "../types/ambulances.types";
import useModal from "../hooks/useModal";
import SelectField from "@/shared/ui/SelectField";

interface AmbulanceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (ambulance: Ambulance) => void | Promise<void>;
  ambulance?: Ambulance;
  mode: "add" | "edit";
}

export function AmbulanceFormModal({
  isOpen,
  onClose,
  onSubmit,
  ambulance,
  mode,
}: AmbulanceFormModalProps) {
  const { register, submitHandler, errors, watch, setValue } = useModal({
    onSubmit,
    ambulance,
    mode,
  });

  const selectedStatus = watch("status") || "AVAILABLE";

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-surface-card w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col rounded-2xl shadow-card border border-border">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-xl font-semibold text-heading">
            {mode === "add" ? "Add New Ambulance" : "Edit Ambulance"}
          </h2>
          <button
            onClick={onClose}
            className="text-muted hover:text-heading transition-colors p-2 hover:bg-surface-muted rounded-lg"
            aria-label="Close modal"
          >
            <FontAwesomeIcon
              icon={faXmark}
              className="w-5 h-5 cursor-pointer"
            />
          </button>
        </div>

        <form onSubmit={submitHandler} className="flex-1 overflow-y-auto">
          <div className="px-6 py-5 space-y-5">
            <input type="hidden" {...register("id")} />
            <input type="hidden" {...register("status")} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-body mb-1.5"
                >
                  Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  {...register("name")}
                  className={`w-full px-3.5 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 transition-all bg-background text-heading placeholder:text-muted ${
                    errors.name
                      ? "border-danger focus:ring-danger/20"
                      : "border-border focus:ring-primary/30 focus:border-primary"
                  }`}
                  placeholder="Ambulance Alpha"
                />
                {errors.name && (
                  <p className="mt-1.5 text-xs text-danger">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="ambulanceNumber"
                  className="block text-sm font-medium text-body mb-1.5"
                >
                  Ambulance Number <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  id="ambulanceNumber"
                  {...register("ambulanceNumber")}
                  className={`w-full px-3.5 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 transition-all bg-background text-heading placeholder:text-muted ${
                    errors.ambulanceNumber
                      ? "border-danger focus:ring-danger/20"
                      : "border-border focus:ring-primary/30 focus:border-primary"
                  }`}
                  placeholder="AMB-14"
                />
                {errors.ambulanceNumber && (
                  <p className="mt-1.5 text-xs text-danger">
                    {errors.ambulanceNumber.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="vehicleInfo"
                  className="block text-sm font-medium text-body mb-1.5"
                >
                  Vehicle Info <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  id="vehicleInfo"
                  {...register("vehicleInfo")}
                  className={`w-full px-3.5 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 transition-all bg-background text-heading placeholder:text-muted ${
                    errors.vehicleInfo
                      ? "border-danger focus:ring-danger/20"
                      : "border-border focus:ring-primary/30 focus:border-primary"
                  }`}
                  placeholder="Mercedes-Benz Sprinter 2022"
                />
                {errors.vehicleInfo && (
                  <p className="mt-1.5 text-xs text-danger">
                    {errors.vehicleInfo.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="driverPhone"
                  className="block text-sm font-medium text-body mb-1.5"
                >
                  Driver Phone <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  id="driverPhone"
                  {...register("driverPhone")}
                  className={`w-full px-3.5 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 transition-all bg-background text-heading placeholder:text-muted ${
                    errors.driverPhone
                      ? "border-danger focus:ring-danger/20"
                      : "border-border focus:ring-primary/30 focus:border-primary"
                  }`}
                  placeholder="011-87654321"
                />
                {errors.driverPhone && (
                  <p className="mt-1.5 text-xs text-danger">
                    {errors.driverPhone.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="driverName"
                  className="block text-sm font-medium text-body mb-1.5"
                >
                  Driver Name
                </label>
                <input
                  type="text"
                  id="driverName"
                  {...register("driverName")}
                  className="w-full px-3.5 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 transition-all bg-background text-heading placeholder:text-muted border-border focus:ring-primary/30 focus:border-primary"
                  placeholder="Driver 14"
                />
              </div>

              <div>
                <label
                  htmlFor="driverId"
                  className="block text-sm font-medium text-body mb-1.5"
                >
                  Driver ID
                </label>
                <input
                  type="text"
                  id="driverId"
                  {...register("driverId")}
                  className="w-full px-3.5 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 transition-all bg-background text-heading placeholder:text-muted border-border focus:ring-primary/30 focus:border-primary"
                  placeholder="Driver ID"
                />
              </div>

              <div>
                <label
                  htmlFor="paramedicId"
                  className="block text-sm font-medium text-body mb-1.5"
                >
                  Paramedic ID
                </label>
                <input
                  type="text"
                  id="paramedicId"
                  {...register("paramedicId")}
                  className="w-full px-3.5 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 transition-all bg-background text-heading placeholder:text-muted border-border focus:ring-primary/30 focus:border-primary"
                  placeholder="Paramedic ID"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="startingPrice"
                  className="block text-sm font-medium text-body mb-1.5"
                >
                  Starting Price <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  id="startingPrice"
                  {...register("startingPrice", { valueAsNumber: true })}
                  className={`w-full px-3.5 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 transition-all bg-background text-heading placeholder:text-muted ${
                    errors.startingPrice
                      ? "border-danger focus:ring-danger/20"
                      : "border-border focus:ring-primary/30 focus:border-primary"
                  }`}
                  placeholder="800"
                />
                {errors.startingPrice && (
                  <p className="mt-1.5 text-xs text-danger">
                    {errors.startingPrice.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="ambulancePointId"
                  className="block text-sm font-medium text-body mb-1.5"
                >
                  Point ID
                </label>
                <input
                  type="text"
                  id="ambulancePointId"
                  {...register("ambulancePointId")}
                  className="w-full px-3.5 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 transition-all bg-background text-heading placeholder:text-muted border-border focus:ring-primary/30 focus:border-primary"
                  placeholder="2"
                />
              </div>

              <div>
                <SelectField
                  id="status"
                  label="Status"
                  required
                  value={selectedStatus}
                  onChange={(value) =>
                    setValue("status", value as Ambulance["status"], {
                      shouldDirty: true,
                      shouldValidate: true,
                    })
                  }
                  options={[
                    { value: "AVAILABLE", label: "Available" },
                    { value: "IN_TRANSIT", label: "In Transit" },
                    { value: "BUSY", label: "Busy" },
                    { value: "MAINTENANCE", label: "Maintenance" },
                  ]}
                  triggerClassName="h-auto rounded-xl px-3.5 py-2.5 text-sm"
                  error={errors.status?.message}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="latitude"
                  className="block text-sm font-medium text-body mb-1.5"
                >
                  Latitude <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  id="latitude"
                  step="0.0001"
                  {...register("latitude", { valueAsNumber: true })}
                  className={`w-full px-3.5 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 transition-all bg-background text-heading placeholder:text-muted ${
                    errors.latitude
                      ? "border-danger focus:ring-danger/20"
                      : "border-border focus:ring-primary/30 focus:border-primary"
                  }`}
                  placeholder="30.0500"
                />
                {errors.latitude && (
                  <p className="mt-1.5 text-xs text-danger">
                    {errors.latitude.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="longitude"
                  className="block text-sm font-medium text-body mb-1.5"
                >
                  Longitude <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  id="longitude"
                  step="0.0001"
                  {...register("longitude", { valueAsNumber: true })}
                  className={`w-full px-3.5 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 transition-all bg-background text-heading placeholder:text-muted ${
                    errors.longitude
                      ? "border-danger focus:ring-danger/20"
                      : "border-border focus:ring-primary/30 focus:border-primary"
                  }`}
                  placeholder="31.0298"
                />
                {errors.longitude && (
                  <p className="mt-1.5 text-xs text-danger">
                    {errors.longitude.message}
                  </p>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-medium text-body border border-border rounded-xl hover:bg-surface-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2.5 text-sm font-medium text-white bg-primary rounded-xl hover:bg-primary/90 transition-colors"
            >
              {mode === "add" ? "Add Ambulance" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
