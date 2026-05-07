import { useTranslation } from "react-i18next";

type DeleteCandidate = {
  id: string;
  label: string;
};

type DeleteAmbulanceDialogProps = {
  candidate: DeleteCandidate | null;
  isMutating: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function DeleteAmbulanceDialog({
  candidate,
  isMutating,
  onCancel,
  onConfirm,
}: DeleteAmbulanceDialogProps) {
  const { t } = useTranslation("ambulances");

  if (!candidate) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      role="presentation"
      onClick={() => {
        if (!isMutating) {
          onCancel();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t("deleteDialog.title")}
        className="w-full max-w-md rounded-2xl border border-border bg-surface-card p-5 shadow-card"
        onClick={(event) => event.stopPropagation()}
      >
        <h3 className="text-lg font-semibold text-heading">{t("deleteDialog.title")}</h3>
        <p className="mt-2 text-sm text-body">
          {t("deleteDialog.description", { name: candidate.label })}
        </p>

        <div className="mt-5 flex items-center justify-end gap-3">
          <button
            type="button"
            disabled={isMutating}
            onClick={onCancel}
            className="rounded-xl border border-border px-4 py-2 text-sm font-medium text-body transition hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-60"
          >
            {t("deleteDialog.cancel")}
          </button>

          <button
            type="button"
            disabled={isMutating}
            onClick={onConfirm}
            className="rounded-xl border border-danger/40 bg-danger px-4 py-2 text-sm font-semibold text-white transition hover:bg-danger/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isMutating ? t("deleteDialog.deleting") : t("deleteDialog.confirm")}
          </button>
        </div>
      </div>
    </div>
  );
}
