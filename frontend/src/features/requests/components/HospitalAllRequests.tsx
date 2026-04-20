import { HospitalRequestRow } from "./HospitalRequestRow";
import { useState, useMemo } from "react";
import { requests } from "../data/request.data";
import SearchBar from "@/shared/common/SearchBar";
import RequestsStateMenu from "./RequestsStateMenu";
import RequestsTypesMenu from "./RequestsPriorityMenu";
import { filterRequests } from "../utils/requests.filter";
import { useTranslation } from "react-i18next";

export default function HospitalAllRequests() {
  const { t } = useTranslation(["requests", "common"]);

  // TODO: Fetch requests from API filtered by user.HospitalId
  // Example: const { data: requestsData } = useQuery(['hospitalRequests', user?.HospitalId], ...)
  
  // For now, filter mock data by hospital (when you connect to API, backend should filter)
  // Mock: Assuming requests have a 'hospitalId' property
  const hospitalRequests = useMemo(() => {
    // In production, this filtering happens on the backend
    // For now, show all mock data (replace with API call filtered by user.HospitalId)
    return requests;
  }, []);

  const [status, setStatus] = useState<string>("all");
  const [priority, setPriority] = useState<string>("all");
  const [searchValue, setSearchValue] = useState<string>("");

  const filters = {
    status,
    priority,
    search: searchValue,
  };

  const filteredRequests = filterRequests(hospitalRequests, filters);

  return (
    <>
      <SearchBar
        value={searchValue}
        onSearchChange={setSearchValue}
        placeholder={t("requests:filters.searchPlaceholder")}
      >
        <div className="flex flex-col md:flex-row gap-4 w-full">
          <div className="flex-1">
            <RequestsStateMenu value={status} onChange={setStatus} />
          </div>
          <div className="flex-1 w-full md:w-auto">
            <RequestsTypesMenu value={priority} onChange={setPriority} />
          </div>
        </div>
      </SearchBar>

      <div className="mt-6">
        <span className="text-body font-medium ml-1 rtl:ml-0 rtl:mr-1">
          {t("requests:pagination.showing")} {filteredRequests.length}{" "}
          {t("requests:pagination.of")} {hospitalRequests.length}{" "}
          {t("requests:pagination.requests")}
        </span>

        <div className="bg-bg-card mt-6 rounded-lg shadow-card overflow-x-auto">
          <div>
            {filteredRequests.map((request) => (
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
