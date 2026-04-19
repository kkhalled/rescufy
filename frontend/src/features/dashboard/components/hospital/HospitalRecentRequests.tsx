import { HospitalRequestRow } from "../../../requests/components/hospital/HospitalRequestRow";
import CriticalRequests from "./CriticalRequests";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function HospitalRecentRequests() {
  const { t } = useTranslation("dashboard");

  // TODO: Fetch recent requests from API filtered by user.HospitalId
  // Example: const { data } = useQuery(['recentHospitalRequests', user?.HospitalId], ...)
  // The backend should return only requests assigned to this hospital

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 lg:gap-8 my-6 md:my-8">
      <div className="col-span-1 lg:col-span-8 bg-bg-card pb-10 dark:bg-bg-card rounded-lg md:rounded-2xl shadow-card dark:shadow-card overflow-hidden">
        <div className="header flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0 p-4 md:p-6 font-semibold text-base md:text-lg text-heading dark:text-heading border-b border-border">
          <span>{t("recentRequests.title")}</span>
          <Link
            to="/hospital_user/requests"
            className="text-xs cursor-pointer bg-primary text-white px-3 md:px-4 py-2 rounded-full hover:opacity-90 transition self-start sm:self-auto"
          >
            {t("recentRequests.viewAll")}
          </Link>
        </div>
        <div className="requests-list divide-y divide-border bg-bg-card dark:bg-bg-card">
          <HospitalRequestRow
            id="REQ-2025-012"
            userName="Sara Al-Fahad"
            userPhone="+966509876543"
            location="King Fahd Medical City"
            priority="critical"
            status="enRoute"
            timestamp="1 min ago"
            compact
          />
          <HospitalRequestRow
            id="REQ-2025-013"
            userName="Mohammed Hassan"
            userPhone="+966501112233"
            location="King Fahd Medical City"
            priority="high"
            status="assigned"
            timestamp="5 mins ago"
            compact
          />
          <HospitalRequestRow
            id="REQ-2025-014"
            userName="Fatima Al-Rashid"
            userPhone="+966504455667"
            location="King Fahd Medical City"
            priority="medium"
            status="pending"
            timestamp="8 mins ago"
            compact
          />
          <HospitalRequestRow
            id="REQ-2025-015"
            userName="Ahmed Khalil"
            userPhone="+966507788990"
            location="King Fahd Medical City"
            priority="low"
            status="completed"
            timestamp="15 mins ago"
            compact
          />
        </div>
      </div>

      <div className="col-span-1 lg:col-span-4">
        <CriticalRequests />
      </div>
    </div>
  );
}
