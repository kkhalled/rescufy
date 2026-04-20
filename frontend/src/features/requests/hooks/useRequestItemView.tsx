import {
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Radar,
} from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { DispatchState, RequestPriority } from "../types/request.types";
import type { QueueRequestItem } from "../types/request-ui.types";

const STATE_ORDER: DispatchState[] = [
  "RECEIVED",
  "SEARCHING",
  "ASSIGNED",
  "ARRIVING",
];

function getSeverityTheme(severity: RequestPriority) {
  if (severity === "critical") {
    return {
      accent: "bg-red-500",
      badge:
        "border-red-300 bg-red-100 text-red-700 dark:border-red-500/45 dark:bg-red-500/18 dark:text-red-300",
      waiting: "text-red-700 dark:text-red-300",
      row: "hover:bg-red-100/80 dark:hover:bg-red-500/8",
    };
  }

  if (severity === "high") {
    return {
      accent: "bg-orange-500",
      badge:
        "border-orange-300 bg-orange-100 text-orange-700 dark:border-orange-500/40 dark:bg-orange-500/18 dark:text-orange-300",
      waiting: "text-orange-700 dark:text-orange-300",
      row: "hover:bg-orange-100/80 dark:hover:bg-orange-500/8",
    };
  }

  if (severity === "medium") {
    return {
      accent: "bg-amber-500",
      badge:
        "border-amber-300 bg-amber-100 text-amber-700 dark:border-amber-500/35 dark:bg-amber-500/18 dark:text-amber-300",
      waiting: "text-amber-700 dark:text-amber-300",
      row: "hover:bg-amber-100/80 dark:hover:bg-amber-500/8",
    };
  }

  return {
    accent: "bg-cyan-500",
    badge:
      "border-cyan-300 bg-cyan-100 text-cyan-700 dark:border-cyan-500/35 dark:bg-cyan-500/16 dark:text-cyan-300",
    waiting: "text-cyan-700 dark:text-cyan-300",
    row: "hover:bg-cyan-100/80 dark:hover:bg-cyan-500/8",
  };
}

function getDispatchTheme(dispatchState: DispatchState) {
  if (dispatchState === "SEARCHING") {
    return {
      badge:
        "border-amber-300 bg-amber-100 text-amber-700 dark:border-amber-500/35 dark:bg-amber-500/12 dark:text-amber-300",
      dot: "bg-amber-500",
      row: "ring-1 ring-amber-300/80 dark:ring-amber-500/20",
    };
  }

  if (dispatchState === "ASSIGNED") {
    return {
      badge:
        "border-emerald-300 bg-emerald-100 text-emerald-700 dark:border-emerald-500/35 dark:bg-emerald-500/12 dark:text-emerald-300",
      dot: "bg-emerald-500",
      row: "",
    };
  }

  if (dispatchState === "ARRIVING") {
    return {
      badge:
        "border-cyan-300 bg-cyan-100 text-cyan-700 dark:border-cyan-500/35 dark:bg-cyan-500/12 dark:text-cyan-300",
      dot: "bg-cyan-500",
      row: "",
    };
  }

  if (dispatchState === "COMPLETED") {
    return {
      badge:
        "border-emerald-300 bg-emerald-100 text-emerald-700 dark:border-emerald-500/35 dark:bg-emerald-500/12 dark:text-emerald-300",
      dot: "bg-emerald-500",
      row: "",
    };
  }

  if (dispatchState === "FAILED") {
    return {
      badge:
        "border-red-300 bg-red-100 text-red-700 dark:border-red-500/35 dark:bg-red-500/12 dark:text-red-300",
      dot: "bg-red-500",
      row: "ring-1 ring-red-300/80 dark:ring-red-500/25",
    };
  }

  return {
    badge:
      "border-slate-300 bg-slate-100 text-slate-700 dark:border-slate-500/35 dark:bg-slate-500/12 dark:text-slate-300",
    dot: "bg-slate-500 dark:bg-slate-400",
    row: "",
  };
}

function formatTimelineTime(timestamp: string) {
  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return "--:--";
  }

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function useRequestItemView(request: QueueRequestItem) {
  const { t } = useTranslation("requests");

  const theme = getSeverityTheme(request.severity);
  const dispatchTheme = getDispatchTheme(request.dispatchState);

  const previewDescription =
    request.description?.trim() || t("board.item.descriptionFallback");

  const statusLabel = t(`board.dispatchStateLabels.${request.dispatchState}`);

  const etaLabel =
    request.eta !== null
      ? t("board.item.etaMinutes", { count: request.eta })
      : t("board.item.etaUnknown");

  const assignedAmbulanceLabel =
    request.assignedAmbulance?.name || t("board.item.searchingUnits");

  const timelineMap = useMemo(() => {
    return request.logs.reduce<Record<DispatchState, string>>(
      (accumulator, log) => {
        accumulator[log.state] = log.timestamp;
        return accumulator;
      },
      {} as Record<DispatchState, string>,
    );
  }, [request.logs]);

  const timelineEntries = STATE_ORDER.map((state) => {
    const logTimestamp = timelineMap[state];

    return {
      key: state,
      label: t(`board.timeline.${state}`),
      time: logTimestamp ? formatTimelineTime(logTimestamp) : "--:--",
      reached: Boolean(logTimestamp),
      active: request.dispatchState === state,
    };
  });

  const statusIcon =
    request.dispatchState === "SEARCHING" ? (
      <Loader2 className="h-3.5 w-3.5 animate-spin" />
    ) : request.dispatchState === "FAILED" ? (
      <AlertTriangle className="h-3.5 w-3.5" />
    ) : request.dispatchState === "COMPLETED" ? (
      <CheckCircle2 className="h-3.5 w-3.5" />
    ) : (
      <Radar className="h-3.5 w-3.5" />
    );

  return {
    t,
    theme,
    dispatchTheme,
    previewDescription,
    statusLabel,
    etaLabel,
    assignedAmbulanceLabel,
    timelineEntries,
    statusIcon,
    isFailed: request.dispatchState === "FAILED",
  };
}
