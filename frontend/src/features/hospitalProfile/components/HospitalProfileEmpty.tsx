import { useTranslation } from "react-i18next";

import {
  faHospital,
} from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function HospitalProfileEmpty() {
  const { t } = useTranslation("hospitals");

  return (
    <div
      className="
        flex min-h-screen
        items-center justify-center

        bg-background
      "
    >
      <div
        className="
          rounded-3xl

          border border-white/[0.05]

          bg-surface-card/95

          px-8 py-10

          text-center

          shadow-card
        "
      >
        {/* Icon */}
        <div
          className="
            mx-auto

            flex h-20 w-20
            items-center justify-center

            rounded-3xl

            bg-cyan-500/10

            text-cyan-300

            shadow-[0_0_35px_rgba(34,211,238,0.12)]
          "
        >
          <FontAwesomeIcon
            icon={faHospital}
            className="text-3xl"
          />
        </div>

        {/* Title */}
        <h2
          className="
            mt-6

            text-2xl font-bold
            tracking-tight

            text-heading
          "
        >
          {t(
            "hospitalProfile.emptyTitle",
            "Hospital Not Found"
          )}
        </h2>

        {/* Description */}
        <p
          className="
            mx-auto
            mt-3
            max-w-md

            text-sm leading-relaxed
            text-muted
          "
        >
          {t(
            "api.notFound"
          )}
        </p>

        {/* Status */}
        <div
          className="
            mt-6

            inline-flex items-center gap-2

            rounded-full

            border border-red-500/15
            bg-red-500/8

            px-4 py-2

            text-sm text-red-300
          "
        >
          <span className="h-2 w-2 rounded-full bg-red-400" />

          No Active Hospital Connection
        </div>
      </div>
    </div>
  );
}