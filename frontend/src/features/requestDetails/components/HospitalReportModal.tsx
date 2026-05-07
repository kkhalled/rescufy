import type { MouseEvent } from "react";
import { createPortal } from "react-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useHospitalReportModal } from "../hooks/useHospitalReportModal";
import type { TripReport } from "../types/requestDetails.types";

interface HospitalReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  requestId: number;
  hospitalId: number | null;
  existingReport: TripReport | null;
  onSuccess: () => void;
}

const inputCls = (hasError: boolean) =>
  `h-11 w-full rounded-xl border px-3.5 text-sm text-heading bg-background outline-none transition focus:ring-2 ${
    hasError
      ? "border-danger focus:ring-danger/20"
      : "border-border focus:border-primary focus:ring-primary/20"
  }`;

const textareaCls = (hasError: boolean) =>
  `w-full rounded-xl border px-3.5 py-2.5 text-sm text-heading bg-background outline-none transition focus:ring-2 resize-none ${
    hasError
      ? "border-danger focus:ring-danger/20"
      : "border-border focus:border-primary focus:ring-primary/20"
  }`;

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1.5 text-xs text-danger">{message}</p>;
}

export default function HospitalReportModal({
  isOpen,
  onClose,
  requestId,
  hospitalId,
  existingReport,
  onSuccess,
}: HospitalReportModalProps) {
  const {
    isEdit,
    admissionTime,
    dischargeTime,
    medicalProcedures,
    errors,
    isSubmitting,
    setAdmissionTime,
    setDischargeTime,
    setMedicalProcedures,
    handleSubmit,
  } = useHospitalReportModal({ isOpen, requestId, hospitalId, existingReport, onSuccess });

  if (!isOpen) return null;

  const handleBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !isSubmitting) onClose();
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-bg-card shadow-card">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-heading">
              {isEdit ? "Edit Trip Report" : "Submit Trip Report"}
            </h2>
            <p className="mt-0.5 text-xs text-muted">
              {isEdit
                ? "Update the medical outcome for this request."
                : "Record the medical outcome for this completed request."}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="text-muted hover:text-heading p-2 rounded-lg hover:bg-surface-muted transition-colors disabled:opacity-50"
          >
            <FontAwesomeIcon icon={faXmark} className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">

          {/* Admission & Discharge */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-body">
                Admission Time <span className="text-danger">*</span>
              </label>
              <input
                type="datetime-local"
                value={admissionTime}
                onChange={(e) => setAdmissionTime(e.target.value)}
                disabled={isSubmitting}
                className={inputCls(!!errors.admissionTime)}
              />
              <FieldError message={errors.admissionTime} />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-body">
                Discharge Time <span className="text-danger">*</span>
              </label>
              <input
                type="datetime-local"
                value={dischargeTime}
                onChange={(e) => setDischargeTime(e.target.value)}
                disabled={isSubmitting}
                className={inputCls(!!errors.dischargeTime)}
              />
              <FieldError message={errors.dischargeTime} />
            </div>
          </div>

          {/* Medical Procedures */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-body">
              Medical Procedures <span className="text-danger">*</span>
            </label>
            <textarea
              rows={4}
              value={medicalProcedures}
              onChange={(e) => setMedicalProcedures(e.target.value)}
              disabled={isSubmitting}
              placeholder="Describe the medical procedures performed…"
              className={textareaCls(!!errors.medicalProcedures)}
            />
            <FieldError message={errors.medicalProcedures} />
          </div>

          {/* Submit error */}
          {errors.submit && (
            <div className="rounded-xl border border-danger/30 bg-danger/10 px-3 py-2.5 text-sm text-danger">
              {errors.submit}
            </div>
          )}

          {/* Footer */}
          <div className="flex justify-end gap-3 border-t border-border pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-body transition hover:bg-surface-muted disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting && <FontAwesomeIcon icon={faSpinner} className="animate-spin" />}
              {isEdit ? "Update Report" : "Submit Report"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}
