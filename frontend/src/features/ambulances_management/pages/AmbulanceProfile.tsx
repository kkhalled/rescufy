import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { useGetAmbulanceById } from "../hooks/useGetAmbulanceById";
import { AmbulanceProfileDetails } from "../components/AmbulanceProfileDetails";
import {
  AMBULANCE_STATUS_TRANSLATION_KEY,
  type AmbulanceApiStatus,
} from "../types/ambulances.types";

type AmbulanceProfileSkeletonProps = {
  title: string;
  subtitle: string;
  backToList: string;
};

function AmbulanceProfileSkeleton({
  title,
  subtitle,
  backToList,
}: AmbulanceProfileSkeletonProps) {
  return (
    <section className="w-full xl:px-12 py-6">
      <header className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-heading text-3xl font-semibold">{title}</h1>
          <p className="mt-1 text-sm text-muted">{subtitle}</p>
        </div>

        <Link
          to="/admin/ambulances_management"
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-semibold text-heading hover:bg-surface-muted/60 transition-colors"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="text-xs" />
          {backToList}
        </Link>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 animate-pulse">
        <article className="xl:col-span-8 rounded-2xl border border-border/80 bg-bg-card p-5 md:p-6 shadow-sm">
          <div className="flex flex-col gap-4 border-b border-border pb-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4 min-w-0">
              <div className="h-12 w-12 rounded-xl bg-surface-muted" />
              <div className="space-y-2">
                <div className="h-3 w-24 rounded bg-surface-muted" />
                <div className="h-5 w-52 rounded bg-surface-muted" />
              </div>
            </div>

            <div className="h-6 w-24 rounded-full bg-surface-muted" />
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-border/70 bg-surface-muted/20 p-4">
              <div className="h-3 w-20 rounded bg-surface-muted" />
              <div className="mt-2 h-4 w-36 rounded bg-surface-muted" />
            </div>
            <div className="rounded-xl border border-border/70 bg-surface-muted/20 p-4">
              <div className="h-3 w-28 rounded bg-surface-muted" />
              <div className="mt-2 h-4 w-44 rounded bg-surface-muted" />
            </div>
            <div className="rounded-xl border border-border/70 bg-surface-muted/20 p-4">
              <div className="h-3 w-24 rounded bg-surface-muted" />
              <div className="mt-2 h-4 w-40 rounded bg-surface-muted" />
            </div>
            <div className="rounded-xl border border-border/70 bg-surface-muted/20 p-4">
              <div className="h-3 w-24 rounded bg-surface-muted" />
              <div className="mt-2 h-4 w-40 rounded bg-surface-muted" />
            </div>
            <div className="rounded-xl border border-border/70 bg-surface-muted/20 p-4 md:col-span-2">
              <div className="h-3 w-24 rounded bg-surface-muted" />
              <div className="mt-2 h-4 w-52 rounded bg-surface-muted" />
            </div>
          </div>
        </article>

        <aside className="xl:col-span-4 rounded-2xl border border-border/80 bg-bg-card p-5 md:p-6 shadow-sm">
          <div className="h-4 w-24 rounded bg-surface-muted" />

          <div className="mt-4 space-y-3">
            <div className="rounded-xl border border-border/70 bg-surface-muted/20 p-4">
              <div className="h-3 w-20 rounded bg-surface-muted" />
              <div className="mt-2 h-4 w-36 rounded bg-surface-muted" />
            </div>
            <div className="rounded-xl border border-border/70 bg-surface-muted/20 p-4">
              <div className="h-3 w-20 rounded bg-surface-muted" />
              <div className="mt-2 h-4 w-36 rounded bg-surface-muted" />
            </div>
            <div className="h-10 w-full rounded-lg border border-border/70 bg-surface-muted" />
          </div>

          <div className="mt-5 space-y-3 border-t border-border pt-5">
            <div className="space-y-2">
              <div className="h-3 w-28 rounded bg-surface-muted" />
              <div className="h-4 w-40 rounded bg-surface-muted" />
            </div>
            <div className="space-y-2">
              <div className="h-3 w-28 rounded bg-surface-muted" />
              <div className="h-4 w-40 rounded bg-surface-muted" />
            </div>
            <div className="space-y-2">
              <div className="h-3 w-24 rounded bg-surface-muted" />
              <div className="h-4 w-32 rounded bg-surface-muted" />
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

function getStatusTranslationKey(statusCode: number): string {
  if (statusCode in AMBULANCE_STATUS_TRANSLATION_KEY) {
    return AMBULANCE_STATUS_TRANSLATION_KEY[statusCode as AmbulanceApiStatus];
  }

  return "offline";
}
export default function AmbulanceProfile() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation("ambulances");
  const { ambulance, isLoading, fetchAmbulanceById } = useGetAmbulanceById();
  const requestedIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!id || requestedIdRef.current === id) {
      return;
    }

    requestedIdRef.current = id;
    void fetchAmbulanceById(id);
  }, [id, fetchAmbulanceById]);

  const profile = ambulance;

  if (isLoading && !profile) {
    return (
      <AmbulanceProfileSkeleton
        title={t("profile.title")}
        subtitle={t("profile.subtitle")}
        backToList={t("profile.backToList")}
      />
    );
  }

  if (!id || !profile) {
    return (
      <section className="w-full xl:px-12 py-6">
        <div className="mx-auto max-w-xl rounded-2xl border border-border bg-bg-card p-8 text-center shadow-sm">
          <h1 className="text-xl font-semibold text-heading">{t("profile.notFoundTitle")}</h1>
          <p className="mt-2 text-sm text-muted">{t("profile.notFoundSubtitle")}</p>
          <Link
            to="/admin/ambulances_management"
            className="inline-flex items-center justify-center gap-2 mt-5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="text-xs" />
            {t("profile.backToList")}
          </Link>
        </div>
      </section>
    );
  }

  const statusKey = getStatusTranslationKey(profile.ambulanceStatus);
  return (
    <section className="w-full xl:px-12 py-6">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-heading text-3xl font-semibold">{t("profile.title")}</h1>
          <p className="text-muted text-sm mt-1">{t("profile.subtitle")}</p>
        </div>

        <Link
          to="/admin/ambulances_management"
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-semibold text-heading hover:bg-surface-muted/60 transition-colors"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="text-xs" />
          {t("profile.backToList")}
        </Link>
      </header>

      <AmbulanceProfileDetails profile={profile} statusKey={statusKey} />
    </section>
  );
}
