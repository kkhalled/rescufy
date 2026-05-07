import { useState } from "react";
import { createPortal } from "react-dom";
import axios from "axios";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { RefreshCw, XCircle, AlertTriangle, X } from "lucide-react";
import { getApiUrl, API_CONFIG } from "@/config/api.config";
import { getAuthToken } from "@/features/auth/utils/auth.utils";
import { useLanguage } from "@/i18n/useLanguage";

// ─── Confirm Dialog ───────────────────────────────────────────────────────────
function ConfirmDialog({
  title,
  description,
  confirmLabel,
  onConfirm,
  onCancel,
  isLoading,
}: {
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
}) {
  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={(e) => { if (e.target === e.currentTarget && !isLoading) onCancel(); }}
    >
      <div className="w-full max-w-sm rounded-2xl border border-border bg-bg-card p-6 shadow-card">
        <div className="mb-4 flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-500/15">
            <AlertTriangle className="h-5 w-5 text-red-500" />
          </span>
          <div>
            <h3 className="text-base font-semibold text-heading">{title}</h3>
            <p className="mt-1 text-sm text-muted">{description}</p>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="rounded-lg border border-border bg-surface-muted/40 px-4 py-2 text-sm font-medium text-body transition hover:bg-surface-muted disabled:opacity-50"
          >
            <X className="mr-1.5 inline h-3.5 w-3.5" />
            No, Keep It
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Cancelling…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

// ─── Action Buttons ───────────────────────────────────────────────────────────
interface ActionButtonsProps {
  requestId: string | number;
  onCancelled?: () => void;
  onReassigned?: () => void;
}

export default function ActionButtons({ requestId, onCancelled, onReassigned }: ActionButtonsProps) {
  const { t } = useTranslation("requests");
  const { isRTL } = useLanguage();
  const toastPos = isRTL ? "top-left" : "top-right";

  const [cancelling, setCancelling] = useState(false);
  const [reassigning, setReassigning] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // ── Cancel ────────────────────────────────────────────────────────────────
  async function handleCancel() {
    const token = getAuthToken();
    if (!token) {
      toast.error("Not authenticated", { position: toastPos });
      return;
    }
    setCancelling(true);
    try {
      await axios.put(
        getApiUrl(API_CONFIG.ENDPOINTS.REQUESTS.CANCEL_REQUEST(String(requestId))),
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success(t("details.cancelSuccess", "Request cancelled successfully."), { position: toastPos });
      setShowConfirm(false);
      onCancelled?.();
    } catch {
      toast.error(t("details.cancelError", "Failed to cancel request."), { position: toastPos });
    } finally {
      setCancelling(false);
    }
  }

  // ── Reassign ──────────────────────────────────────────────────────────────
  async function handleReassign() {
    const token = getAuthToken();
    if (!token) {
      toast.error("Not authenticated", { position: toastPos });
      return;
    }
    setReassigning(true);
    try {
      await axios.put(
        getApiUrl(API_CONFIG.ENDPOINTS.REQUESTS.REASSIGN_REQUEST(String(requestId))),
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success(t("details.reassignSuccess", "Request reassigned successfully."), { position: toastPos });
      onReassigned?.();
    } catch {
      toast.error(t("details.reassignError", "Failed to reassign request."), { position: toastPos });
    } finally {
      setReassigning(false);
    }
  }

  return (
    <>
      <div className="flex flex-wrap gap-3">
        {/* Reassign */}
        <button
          type="button"
          onClick={handleReassign}
          disabled={reassigning || cancelling}
          className="inline-flex items-center gap-2 rounded-xl border border-primary/40 bg-primary/10 px-5 py-2.5 text-sm font-semibold text-primary transition hover:bg-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${reassigning ? "animate-spin" : ""}`} />
          {reassigning ? t("details.reassigning", "Reassigning…") : t("details.reassign", "Reassign")}
        </button>

        {/* Cancel */}
        <button
          type="button"
          onClick={() => setShowConfirm(true)}
          disabled={reassigning || cancelling}
          className="inline-flex items-center gap-2 rounded-xl border border-red-500/40 bg-red-500/10 px-5 py-2.5 text-sm font-semibold text-red-500 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <XCircle className="h-4 w-4" />
          {t("details.cancelRequest", "Cancel Request")}
        </button>
      </div>

      {showConfirm && (
        <ConfirmDialog
          title={t("details.cancelConfirmTitle", "Cancel this request?")}
          description={t("details.cancelConfirmDesc", "This action cannot be undone. The request will be marked as cancelled.")}
          confirmLabel={t("details.cancelRequest", "Cancel Request")}
          onConfirm={handleCancel}
          onCancel={() => setShowConfirm(false)}
          isLoading={cancelling}
        />
      )}
    </>
  );
}
