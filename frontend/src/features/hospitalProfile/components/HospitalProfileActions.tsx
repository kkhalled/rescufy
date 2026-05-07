import { useTranslation } from "react-i18next";

type Props = {
  resetForm: () => void;
};

export default function HospitalProfileActions({
  resetForm,
}: Props) {
  const { t } = useTranslation("hospitals");

  return (
    <div
      className="
        flex flex-col gap-3

        border-t border-white/[0.05]

        pt-5

        sm:flex-row
      "
    >
      {/* Save */}
      <button
        type="submit"
        className="
          rounded-2xl

          bg-cyan-500

          px-6 py-3

          text-sm font-semibold
          text-slate-950

          transition-all duration-200

          hover:bg-cyan-400
        "
      >
        {t(
          "hospitalProfile.saveChanges"
        )}
      </button>

      {/* Cancel */}
      <button
        type="button"
        onClick={resetForm}
        className="
          rounded-2xl

          border border-white/[0.06]

          bg-background-second/40

          px-6 py-3

          text-sm font-semibold
          text-body

          transition-all duration-200

          hover:bg-background-second/70
        "
      >
        {t(
          "hospitalProfile.cancel"
        )}
      </button>
    </div>
  );
}