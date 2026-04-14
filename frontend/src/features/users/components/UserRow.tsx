import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faEye,
  faEyeSlash,
  faPenToSquare,
  faPhone,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

interface UserRowProps {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  phoneNumber?: string | null;
  isBanned?: boolean;
  onEdit: () => void;
  onDelete?: () => void;
}

export function UserRow({
  id,
  name,
  email,
  password,
  role,
  phoneNumber,
  isBanned,
  onEdit,
  onDelete,
}: UserRowProps) {
  const [showPassword, setShowPassword] = useState(false);
  const { t } = useTranslation(["users", "common"]);

  const initials = useMemo(() => {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }, [name]);

  const roleStyles: Record<string, { dot: string; badge: string }> = {
    SuperAdmin: {
      dot: "bg-red-500",
      badge: "border-red-500/25 bg-red-500/12 text-red-600 dark:text-red-300",
    },
    Admin: {
      dot: "bg-purple-500",
      badge: "border-purple-500/25 bg-purple-500/12 text-purple-600 dark:text-purple-300",
    },
    HospitalAdmin: {
      dot: "bg-blue-500",
      badge: "border-blue-500/25 bg-blue-500/12 text-blue-600 dark:text-blue-300",
    },
    Paramedic: {
      dot: "bg-green-500",
      badge: "border-green-500/25 bg-green-500/12 text-green-600 dark:text-green-300",
    },
    AmbulanceDriver: {
      dot: "bg-emerald-500",
      badge: "border-emerald-500/25 bg-emerald-500/12 text-emerald-600 dark:text-emerald-300",
    },
  };

  const roleLabel: Record<string, string> = {
    SuperAdmin: t("users:roles.SuperAdmin"),
    Admin: t("users:roles.Admin"),
    HospitalAdmin: t("users:roles.HospitalAdmin"),
    Paramedic: t("users:roles.Paramedic"),
    AmbulanceDriver: t("users:roles.AmbulanceDriver"),
  };

  const resolvedRole = roleLabel[role] || role || t("users:roles.all");
  const roleStyle = roleStyles[role] || {
    dot: "bg-gray-500",
    badge: "border-gray-500/25 bg-gray-500/12 text-gray-600 dark:text-gray-300",
  };

  const userStatus = isBanned
    ? t("users:status.suspended")
    : t("users:status.active");
  const userStatusStyle = isBanned
    ? "border-danger/25 bg-danger/10 text-danger"
    : "border-success/25 bg-success/10 text-success";

  const maskedPassword = password || "••••••••";
  const shownPassword = showPassword ? maskedPassword : "••••••••";

  return (
    <>
      <div className="hidden items-center gap-3 px-5 py-4 transition-colors hover:bg-surface-muted/40 md:grid md:grid-cols-[2.2fr_1.3fr_1.2fr_0.9fr_auto]">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${roleStyle.dot}`}
          >
            {initials}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-heading">{name}</p>
            <p className="truncate text-[11px] font-mono text-muted">{id.split("-")[0]}</p>
          </div>
        </div>

        <div className="flex min-w-0 items-center gap-2">
          <FontAwesomeIcon
            icon={faEnvelope}
            className="h-3.5 w-3.5 shrink-0 text-muted"
          />
          <span className="truncate text-sm text-body">{email}</span>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${roleStyle.badge}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${roleStyle.dot}`} />
            {resolvedRole}
          </span>
          <span
            className={`inline-flex rounded-full border px-2 py-1 text-[11px] font-semibold ${userStatusStyle}`}
          >
            {userStatus}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-sm text-body">{shownPassword}</span>
          <button
            onClick={() => setShowPassword((prev) => !prev)}
            className="rounded-lg p-1 text-muted transition-colors hover:bg-surface-muted hover:text-heading"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            <FontAwesomeIcon
              icon={showPassword ? faEyeSlash : faEye}
              className="h-3.5 w-3.5"
            />
          </button>
        </div>

        <div className="flex items-center justify-end gap-1">
          <button
            onClick={onEdit}
            className="rounded-lg p-2 text-muted transition-colors hover:bg-surface-muted hover:text-heading"
            aria-label={t("users:row.editTooltip")}
          >
            <FontAwesomeIcon icon={faPenToSquare} className="h-4 w-4" />
          </button>
          <button
            onClick={onDelete}
            className="rounded-lg p-2 text-muted transition-colors hover:bg-danger/10 hover:text-danger disabled:cursor-not-allowed disabled:opacity-50"
            aria-label={t("users:row.deleteTooltip")}
            disabled={!onDelete}
          >
            <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="px-4 py-4 md:hidden">
        <article className="rounded-xl border border-border/70 bg-bg-card p-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex min-w-0 items-center gap-3">
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${roleStyle.dot}`}
              >
                {initials}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-heading">{name}</p>
                <p className="truncate text-[11px] font-mono text-muted">{id}</p>
              </div>
            </div>
            <span
              className={`inline-flex rounded-full border px-2 py-1 text-[11px] font-semibold ${userStatusStyle}`}
            >
              {userStatus}
            </span>
          </div>

          <div className="mt-3 space-y-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${roleStyle.badge}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${roleStyle.dot}`} />
              {resolvedRole}
            </span>

            <p className="flex items-center gap-2 text-xs text-body">
              <FontAwesomeIcon icon={faEnvelope} className="h-3 w-3 text-muted" />
              <span className="truncate">{email}</span>
            </p>

            {phoneNumber ? (
              <p className="flex items-center gap-2 text-xs text-body" dir="ltr">
                <FontAwesomeIcon icon={faPhone} className="h-3 w-3 text-muted" />
                <span className="truncate">{phoneNumber}</span>
              </p>
            ) : null}

            <div className="flex items-center justify-between rounded-lg border border-border/70 bg-surface-muted/40 px-2.5 py-2">
              <p className="text-xs text-muted">{t("users:row.password")}</p>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-body">{shownPassword}</span>
                <button
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="rounded p-1 text-muted transition-colors hover:bg-surface-muted hover:text-heading"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <FontAwesomeIcon
                    icon={showPassword ? faEyeSlash : faEye}
                    className="h-3 w-3"
                  />
                </button>
              </div>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-end gap-2 border-t border-border/70 pt-3">
            <button
              onClick={onEdit}
              className="rounded-lg p-2 text-muted transition-colors hover:bg-surface-muted hover:text-heading"
              aria-label={t("users:row.editTooltip")}
            >
              <FontAwesomeIcon icon={faPenToSquare} className="h-4 w-4" />
            </button>
            <button
              onClick={onDelete}
              className="rounded-lg p-2 text-muted transition-colors hover:bg-danger/10 hover:text-danger disabled:cursor-not-allowed disabled:opacity-50"
              aria-label={t("users:row.deleteTooltip")}
              disabled={!onDelete}
            >
              <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
            </button>
          </div>
        </article>
      </div>
    </>
  );
}
