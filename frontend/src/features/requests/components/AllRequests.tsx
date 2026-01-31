import { RequestRow } from "@/features/requests/components/RequestRow";
import { useState } from "react";
import { requests } from "../data/request.data";
import SearchBar from "@/shared/common/SearchBar";
import RequestsStateMenu from "./RequestsStateMenu";
import RequestsTypesMenu from "./RequestsPriorityMenu";
import { filterRequests } from "../utils/requests.filter";


export default function AllRequests() {
  const requestsData = requests;

  const [status, setStatus] = useState<string>("all"); // ✅ ADD THIS
  const [priority, setPriority] = useState<string>("all");
  const [searchValue, setSearchValue] = useState<string>("");
  // const [Search]

  // ✅ ADD THIS

  const filters = {
  status,
  priority,
  search: searchValue,
};

  const filteredRequests = filterRequests(requestsData, filters);

  return (
    <>
      <SearchBar value={searchValue} onSearchChange={setSearchValue}>
        <RequestsStateMenu value={status} onChange={setStatus} />
        <RequestsTypesMenu value={priority} onChange={setPriority} />
      </SearchBar>

      <div className="mt-6">
        <span className=" text-body font-medium ml-1">
          Showing 5 of 5 requests
        </span>

        <div className="bg-bg-card mt-6 rounded-lg shadow-card overflow-x-auto ">
          <div className="">
            {filteredRequests.map((request) => (
              <RequestRow
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
            <span className="text-muted">Page 1 of 5</span>

            <div className="flex items-center gap-3">
              <button className="px-3 py-1 bg-background-second rounded-md hover:bg-gray-200 text-muted transition">
                Previous
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
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

//
