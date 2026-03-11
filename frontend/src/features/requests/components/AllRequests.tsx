import { RequestRow } from "@/features/requests/components/RequestRow";
import { useState, useEffect } from "react";
import { filterRequests } from "../utils/requests.filter";
import { useTranslation } from "react-i18next";
import { useGetRequests } from "../hooks/useGetRequests";
import type { RequestFilters } from "../hooks/useGetRequests";
import Loading from "@/shared/common/Loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faFilter,
  faRotateRight,
  faChevronDown,
  faChevronUp,
} from "@fortawesome/free-solid-svg-icons";

/** Maps the API integer RequestStatus to readable keys */
const STATUS_OPTIONS = [
  { value: "", label: "all" },
  { value: "0", label: "pending" },
  { value: "1", label: "assigned" },
  { value: "2", label: "enRoute" },
  { value: "3", label: "completed" },
  { value: "4", label: "cancelled" },
] as const;

const SELF_CASE_OPTIONS = [
  { value: "", label: "all" },
  { value: "true", label: "selfCase" },
  { value: "false", label: "forOthers" },
] as const;

export default function AllRequests() {
  const { t } = useTranslation(["requests", "common"]);
  const { requests, isLoading, fetchRequests } = useGetRequests();

  // ── API filter state ──
  const [userId, setUserId] = useState("");
  const [requestStatus, setRequestStatus] = useState<string>("");
  const [isSelfCase, setIsSelfCase] = useState<string>("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // ── Local client-side filters ──
  const [searchValue, setSearchValue] = useState("");

  // ── UI state ──
  const [filtersOpen, setFiltersOpen] = useState(false);

  /** Get a date one year ago as YYYY-MM-DDT00:00 */
  const getOneYearAgo = () => {
    const now = new Date();
    const y = now.getFullYear() - 1;
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}T00:00`;
  };

  // Initial load — fetch requests from one year ago
  useEffect(() => {
    const oneYearAgo = getOneYearAgo();
    setStartDate(oneYearAgo);
    fetchRequests({ StartDate: oneYearAgo });
  }, []);

  /** Build the filters object & call API */
  const handleSearch = () => {
    const filters: RequestFilters = {};
    if (userId.trim()) filters.UserId = userId.trim();
    if (requestStatus !== "") filters.RequestStatus = Number(requestStatus);
    if (isSelfCase !== "") filters.IsSelfCase = isSelfCase === "true";
    if (startDate) filters.StartDate = startDate;
    if (endDate) filters.EndDate = endDate;
    fetchRequests(filters);
  };

  /** Reset all filters & re-fetch */
  const handleReset = () => {
    setUserId("");
    setRequestStatus("");
    setIsSelfCase("");
    setStartDate("");
    setEndDate("");
    setSearchValue("");
    fetchRequests();
  };

  // Client-side filter on already-fetched data
  const filteredRequests = filterRequests(requests, {
    status: "all", // status already filtered server-side
    search: searchValue,
  });

  return (
    <>
      {/* ═══════ Filter Card ═══════ */}
      <div className="bg-bg-card rounded-xl shadow-card border border-border overflow-hidden">
        {/* ── Top row: search + toggle ── */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-4">
          {/* Quick search (client-side) */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 ltr:left-0 rtl:right-0 ltr:pl-3 rtl:pr-3 flex items-center pointer-events-none">
              <FontAwesomeIcon icon={faMagnifyingGlass} className="w-3.5 h-3.5 text-muted" />
            </div>
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder={t("requests:filters.searchPlaceholder")}
              className="w-full ltr:pl-9 rtl:pr-9 ltr:pr-3 rtl:pl-3 py-2.5 rounded-lg text-sm bg-background-second border border-border text-heading placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium border border-border bg-background-second text-body hover:bg-primary/5 hover:border-primary/30 transition-all cursor-pointer"
            >
              <FontAwesomeIcon icon={faFilter} className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t("requests:filters.advancedFilters")}</span>
              <FontAwesomeIcon icon={filtersOpen ? faChevronUp : faChevronDown} className="w-3 h-3 text-muted" />
            </button>

            <button
              onClick={handleSearch}
              disabled={isLoading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-primary text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all disabled:opacity-50 cursor-pointer"
            >
              <FontAwesomeIcon icon={faMagnifyingGlass} className="w-3.5 h-3.5" />
              <span>{t("requests:filters.search")}</span>
            </button>
          </div>
        </div>

        {/* ── Expandable filters panel ── */}
        <div
          className={`grid transition-all duration-300 ease-in-out ${
            filtersOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <div className="border-t border-border px-4 pb-4 pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* User ID */}
                <div>
                  <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
                    {t("requests:filters.userId")}
                  </label>
                  <input
                    type="text"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder={t("requests:filters.userIdPlaceholder")}
                    className="w-full px-3 py-2.5 rounded-lg text-sm bg-background-second border border-border text-heading placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all"
                  />
                </div>

                {/* Request Status */}
                <div>
                  <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
                    {t("requests:filters.status")}
                  </label>
                  <select
                    value={requestStatus}
                    onChange={(e) => setRequestStatus(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg text-sm bg-background-second border border-border text-heading focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all cursor-pointer appearance-none"
                  >
                    {STATUS_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {t(`requests:status.${opt.label}`)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Is Self Case */}
                <div>
                  <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
                    {t("requests:filters.caseType")}
                  </label>
                  <select
                    value={isSelfCase}
                    onChange={(e) => setIsSelfCase(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg text-sm bg-background-second border border-border text-heading focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all cursor-pointer appearance-none"
                  >
                    {SELF_CASE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {t(`requests:filters.${opt.label}`)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Start Date */}
                <div>
                  <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
                    {t("requests:filters.startDate")}
                  </label>
                  <input
                    type="datetime-local"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg text-sm bg-background-second border border-border text-heading focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all"
                  />
                </div>

                {/* End Date */}
                <div>
                  <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
                    {t("requests:filters.endDate")}
                  </label>
                  <input
                    type="datetime-local"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg text-sm bg-background-second border border-border text-heading focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all"
                  />
                </div>


              </div>

              {/* Reset button */}
              <div className="flex justify-end mt-4">
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-muted hover:text-danger hover:bg-danger/5 border border-transparent hover:border-danger/20 transition-all cursor-pointer"
                >
                  <FontAwesomeIcon icon={faRotateRight} className="w-3.5 h-3.5" />
                  {t("requests:filters.reset")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════ Results ═══════ */}
      <div className="mt-6">
        <span className="text-body font-medium ltr:ml-1 rtl:mr-1">
          {t("requests:pagination.showing")} {filteredRequests.length} {t("requests:pagination.of")} {requests.length} {t("requests:pagination.requests")}
        </span>

        <div className="bg-bg-card mt-4 rounded-xl shadow-card border border-border overflow-x-auto">
          {isLoading ? (
            <Loading />
          ) : filteredRequests.length > 0 ? (
            filteredRequests.map((request) => (
              <RequestRow
                key={request.id}
                id={String(request.id)}
                address={request.address}
                userName={request.userName}
                userPhone={request.userPhone}
                status={request.status}
                timestamp={request.timestamp}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-muted text-sm">{t("requests:empty.title")}</p>
              <p className="text-muted text-xs mt-1">{t("requests:empty.description")}</p>
            </div>
          )}

          <div className="text-sm flex items-center py-4 px-4 justify-between text-muted border-t border-border">
            <span>{t("requests:pagination.page")} 1 {t("requests:pagination.of")} 1</span>
            <div className="flex items-center gap-3">
              <button className="px-3 py-1 bg-background-second rounded-md hover:bg-primary/10 text-muted transition cursor-pointer">
                {t("requests:pagination.previous")}
              </button>
              <button>
                <span className="px-3 py-1 bg-primary text-white rounded-md">1</span>
              </button>
              <button className="px-3 py-1 bg-primary text-white rounded-md hover:bg-primary/90 transition cursor-pointer">
                {t("requests:pagination.next")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

