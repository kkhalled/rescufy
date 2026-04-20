import type { MouseEvent } from "react";
import { createPortal } from "react-dom";
import SelectField from "@/shared/ui/SelectField";
import { useHospitalReportModal } from "../hooks/useHospitalReportModal";

type HospitalReportModalProps = {
  isOpen: boolean;
  onClose: () => void;
  requestId: string;
  initialArrivalTime?: string;
};

const FIELD_CLASS =
  "h-11 w-full rounded-lg border border-border bg-background-second px-3 text-sm text-heading outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";

const TEXTAREA_CLASS =
  "w-full rounded-lg border border-border bg-background-second px-3 py-2.5 text-sm text-heading outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";

export default function HospitalReportModal({
  isOpen,
  onClose,
  requestId,
  initialArrivalTime,
}: HospitalReportModalProps) {
  const {
    arrivedAt,
    dischargedAt,
    status,
    treatment,
    errors,
    isSubmitting,
    statusOptions,
    updateArrivedAt,
    updateDischargedAt,
    updateStatus,
    updateTreatment,
    handleSubmit,
  } = useHospitalReportModal({
    isOpen,
    requestId,
    initialArrivalTime,
    onSuccess: onClose,
  });

  if (!isOpen) {
    return null;
  }

  const handleBackdropClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget && !isSubmitting) {
      onClose();
    }
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-120 grid place-items-center bg-black/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Hospital report modal"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-bg-card p-6 shadow-card">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-heading">Hospital Report</h2>
            <p className="mt-1 text-sm text-muted">
              Submit the final medical outcome for this completed request.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-border bg-background-second px-3 py-1.5 text-sm font-medium text-body transition hover:bg-surface-muted"
            disabled={isSubmitting}
          >
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="arrivedAt" className="mb-1 block text-sm font-medium text-body">
                Arrival Time
              </label>
              <input
                id="arrivedAt"
                type="datetime-local"
                value={arrivedAt}
                onChange={(event) => updateArrivedAt(event.target.value)}
                className={FIELD_CLASS}
              />
            </div>

            <div>
              <label htmlFor="dischargedAt" className="mb-1 block text-sm font-medium text-body">
                Discharge Time <span className="text-danger">*</span>
              </label>
              <input
                id="dischargedAt"
                type="datetime-local"
                value={dischargedAt}
                onChange={(event) => updateDischargedAt(event.target.value)}
                className={FIELD_CLASS}
              />
              {errors.dischargedAt ? (
                <p className="mt-1 text-xs text-danger">{errors.dischargedAt}</p>
              ) : null}
            </div>
          </div>

          <SelectField
            id="status"
            label="Status"
            required
            placeholder="Select status"
            value={status}
            onChange={updateStatus}
            options={statusOptions}
            error={errors.status}
            labelClassName="text-sm font-medium text-body"
            triggerClassName="h-11 rounded-lg border-border bg-background-second text-heading"
            contentClassName="z-130 border-border bg-background-second"
            itemClassName="text-heading focus:bg-primary/10 dark:focus:bg-primary/30"
          />

          <div>
            <label htmlFor="treatment" className="mb-1 block text-sm font-medium text-body">
              Treatment <span className="text-danger">*</span>
            </label>
            <textarea
              id="treatment"
              value={treatment}
              onChange={(event) => updateTreatment(event.target.value)}
              rows={4}
              className={TEXTAREA_CLASS}
              placeholder="Write treatment summary..."
            />
            {errors.treatment ? <p className="mt-1 text-xs text-danger">{errors.treatment}</p> : null}
          </div>

          {errors.submit ? (
            <div className="rounded-lg border border-danger/35 bg-danger/10 px-3 py-2 text-sm text-danger">
              {errors.submit}
            </div>
          ) : null}

          <div className="flex items-center justify-end gap-2 border-t border-border pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-border bg-background-second px-4 py-2 text-sm font-medium text-body transition hover:bg-surface-muted"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Report"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
