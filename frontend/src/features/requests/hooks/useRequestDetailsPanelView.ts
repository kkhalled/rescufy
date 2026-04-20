import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { DispatchState, RequestPriority } from "../types/request.types";
import type { QueueRequestItem } from "../types/request-ui.types";

function getSeverityBorder(severity: RequestPriority) {
  if (severity === "critical") return "border-red-500/35";
  if (severity === "high") return "border-orange-500/30";
  if (severity === "medium") return "border-amber-500/25";
  return "border-cyan-500/25";
}

function getDispatchTheme(dispatchState: DispatchState) {
  if (dispatchState === "SEARCHING") {
    return {
      badge:
        "border-amber-300 bg-amber-100 text-amber-700 dark:border-amber-500/35 dark:bg-amber-500/12 dark:text-amber-300",
      dot: "bg-amber-500",
    };
  }

  if (dispatchState === "ASSIGNED") {
    return {
      badge:
        "border-emerald-300 bg-emerald-100 text-emerald-700 dark:border-emerald-500/35 dark:bg-emerald-500/12 dark:text-emerald-300",
      dot: "bg-emerald-500",
    };
  }

  if (dispatchState === "ARRIVING") {
    return {
      badge:
        "border-cyan-300 bg-cyan-100 text-cyan-700 dark:border-cyan-500/35 dark:bg-cyan-500/12 dark:text-cyan-300",
      dot: "bg-cyan-500",
    };
  }

  if (dispatchState === "COMPLETED") {
    return {
      badge:
        "border-emerald-300 bg-emerald-100 text-emerald-700 dark:border-emerald-500/35 dark:bg-emerald-500/12 dark:text-emerald-300",
      dot: "bg-emerald-500",
    };
  }

  if (dispatchState === "FAILED") {
    return {
      badge:
        "border-red-300 bg-red-100 text-red-700 dark:border-red-500/35 dark:bg-red-500/12 dark:text-red-300",
      dot: "bg-red-500",
    };
  }

  return {
    badge:
      "border-slate-300 bg-slate-100 text-slate-700 dark:border-slate-500/35 dark:bg-slate-500/12 dark:text-slate-300",
    dot: "bg-slate-500 dark:bg-slate-400",
  };
}

export function useRequestDetailsPanelView(request: QueueRequestItem | null) {
  const { t } = useTranslation("requests");

  const view = useMemo(() => {
    if (!request) {
      return null;
    }

    const description =
      request.description?.trim() || t("board.item.descriptionFallback");

    const etaLabel =
      request.eta !== null
        ? t("board.item.etaMinutes", { count: request.eta })
        : t("board.item.etaUnknown");

    const selectedAmbulanceLabel =
      request.assignedAmbulance?.name || t("board.item.searchingUnits");

    const dispatchStateLabel = t(
      `board.dispatchStateLabels.${request.dispatchState}`,
    );

    return {
      severityBorder: getSeverityBorder(request.severity),
      dispatchTheme: getDispatchTheme(request.dispatchState),
      description,
      etaLabel,
      selectedAmbulanceLabel,
      dispatchStateLabel,
      priorityLabel: t(`priority.${request.severity}`),
      userName: request.userName || "-",
      address: request.address || "-",
      waitingLabel: request.waitingLabel,
    };
  }, [request, t]);

  return {
    t,
    view,
  };
}
