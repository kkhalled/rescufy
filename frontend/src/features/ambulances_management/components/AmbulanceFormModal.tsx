import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { createPortal } from "react-dom";
import type { Ambulance } from "../data/ambulances.data";
import useModal from "../hooks/useModal";

interface AmbulanceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (ambulance: Ambulance) => void;
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
  const { register, submitHandler, errors } = useModal({
    onSubmit,
    ambulance,
    mode,
  });

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-surface-card w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col rounded-2xl shadow-card border border-border">
        {/* Header */}
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

        {/* Form */}
        <form onSubmit={submitHandler} className="flex-1 overflow-y-auto">
          <div className="px-6 py-5 space-y-5">
            {/* Hidden ID field */}
            <input type="hidden" {...register("id")} />

            {/* Row 1: License Plate & Hospital ID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* License Plate */}
              <div>
                <label
                  htmlFor="licensePlate"
                  className="block text-sm font-medium text-body mb-1.5"
                >
                  License Plate <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  id="licensePlate"
                  {...register("licensePlate")}
                  className={`w-full px-3.5 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 transition-all bg-background text-heading placeholder:text-muted ${
                    errors.licensePlate
                      ? "border-danger focus:ring-danger/20"
                      : "border-border focus:ring-primary/30 focus:border-primary"
                  }`}
                  placeholder="ABC-1234"
                />
                {errors.licensePlate && (
                  <p className="mt-1.5 text-xs text-danger">
                    {errors.licensePlate.message}
                  </p>
                )}
              </div>

              {/* Hospital ID */}
              <div>
                <label
                  htmlFor="hospitalId"
                  className="block text-sm font-medium text-body mb-1.5"
                >
                  Hospital ID <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  id="hospitalId"
                  {...register("hospitalId")}
                  className={`w-full px-3.5 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 transition-all bg-background text-heading placeholder:text-muted ${
                    errors.hospitalId
                      ? "border-danger focus:ring-danger/20"
                      : "border-border focus:ring-primary/30 focus:border-primary"
                  }`}
                  placeholder="Hospital ID"
                />
                {errors.hospitalId && (
                  <p className="mt-1.5 text-xs text-danger">
                    {errors.hospitalId.message}
                  </p>
                )}
              </div>
            </div>

            {/* Row 2: Status & Latitude */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Status */}
              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-body mb-1.5"
                >
                  Status <span className="text-danger">*</span>
                </label>
                <select
                  id="status"
                  {...register("status")}
                  className={`w-full px-3.5 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 transition-all bg-background text-heading ${
                    errors.status
                      ? "border-danger focus:ring-danger/20"
                      : "border-border focus:ring-primary/30 focus:border-primary"
                  }`}
                >
                  <option value="AVAILABLE">Available</option>
                  <option value="IN_TRANSIT">In Transit</option>
                  <option value="BUSY">Busy</option>
                  <option value="MAINTENANCE">Maintenance</option>
                </select>
                {errors.status && (
                  <p className="mt-1.5 text-xs text-danger">
                    {errors.status.message}
                  </p>
                )}
              </div>

              {/* Latitude */}
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
                  placeholder="31.2454"
                />
                {errors.latitude && (
                  <p className="mt-1.5 text-xs text-danger">
                    {errors.latitude.message}
                  </p>
                )}
              </div>
            </div>

            {/* Row 3: Longitude */}
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
                placeholder="30.0454"
              />
              {errors.longitude && (
                <p className="mt-1.5 text-xs text-danger">
                  {errors.longitude.message}
                </p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 justify-end px-6 py-4 border-t border-border bg-surface-muted">
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
