
import { useTranslation } from "react-i18next";
import { RefreshCcw } from "lucide-react";

type Props = {
  isLoading: boolean;
  onRefresh: () => void;
};

export default function HospitalProfileHeader({
  isLoading,
  onRefresh,
}: Props) {
  const { t } = useTranslation([
    "hospitals",
    "common",
  ]);

  return (
    <div
      className="
        mb-6
        flex flex-col gap-4
        lg:flex-row lg:items-end lg:justify-between
      "
    >
      <div>
        <p
          className="
            text-[10px]
            font-semibold
            uppercase
            tracking-[0.24em]
            text-cyan-400
          "
        >
          Hospital Operations
        </p>

        <h1
          className="
            mt-2
            text-2xl font-bold
            tracking-tight
            text-heading
            sm:text-4xl
          "
        >
          {t("hospitals:hospitalProfile.title")}
        </h1>

        <p
          className="
            mt-2
            max-w-3xl
            text-sm leading-relaxed
            text-muted
            sm:text-base
          "
        >
          {t("hospitals:hospitalProfile.subtitle")}
        </p>
      </div>

      <button
        type="button"
        onClick={onRefresh}
        disabled={isLoading}
        className="
          inline-flex items-center gap-2
          self-start
          rounded-2xl
          border border-cyan-500/15
          bg-cyan-500/8
          px-4 py-2.5
          text-sm font-medium
          text-cyan-300
          transition-all duration-200
          hover:bg-cyan-500/12
        "
      >
        <RefreshCcw
          className={`
            h-4 w-4
            ${isLoading ? "animate-spin" : ""}
          `}
        />

        Refresh
      </button>
    </div>
  );
}