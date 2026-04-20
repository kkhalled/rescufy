import { HospitalRequestRow } from "./HospitalRequestRow";
import { useTranslation } from "react-i18next";
import type { HospitalRequestItem } from "../../types/request-ui.types";

export default function HospitalAllRequests() {
  const { t } = useTranslation(["requests", "common"]);

  // TODO: Fetch requests from API filtered by user.HospitalId
  // Example: const { data: requestsData } = useQuery(['hospitalRequests', user?.HospitalId], ...)
  
  // Keep this list local for now until hospital requests API is wired.
  const hospitalRequests: HospitalRequestItem[] = [];

  return (
    <>
      <div className="mt-6">
        <span className="text-body font-medium ml-1 rtl:ml-0 rtl:mr-1">
          {t("requests:pagination.showing")} {hospitalRequests.length}{" "}
          {t("requests:pagination.of")} {hospitalRequests.length}{" "}
          {t("requests:pagination.requests")}
        </span>

        <div className="bg-bg-card mt-6 rounded-lg shadow-card overflow-x-auto">
          <div>
            {hospitalRequests.map((request) => (
              <HospitalRequestRow
                key={request.id}
                id={request.id}
                userName={request.userName}
                userPhone={request.userPhone}
                location={request.location}
                priority={request.priority}
                status={request.status}
                timestamp={request.timestamp}
              />
            ))}
          </div>

          <div className="text-sm flex items-center py-4 px-4 justify-between text-muted">
            <span className="text-muted">
              {t("requests:pagination.page")} 1 {t("requests:pagination.of")} 5
            </span>

            <div className="flex items-center gap-3">
              <button className="px-3 py-1 bg-background-second rounded-md hover:bg-gray-200 text-muted transition">
                {t("requests:pagination.previous")}
              </button>
              <button>
                <span className="px-3 py-1 bg-primary text-white rounded-md hover:bg-primary/90 transition">
                  1
                </span>
              </button>
              <button>
                <span className="px-3 py-1 bg-background-second rounded-md hover:bg-gray-200 transition">
                  2
                </span>
              </button>
              <button>
                <span className="px-3 py-1 bg-background-second rounded-md hover:bg-gray-200 transition">
                  3
                </span>
              </button>
              <button className="px-3 py-1 bg-primary text-white rounded-md hover:bg-primary/90 transition">
                {t("requests:pagination.next")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
