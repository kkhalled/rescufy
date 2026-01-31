import type { Request } from "../types/request.types";

export type Filters = {
  status: string;
  priority: string;
  search:string
};

export function filterRequests(
  requests: Request[],
  filters: Filters,
): Request[] {
  const q = filters.search.trim().toLowerCase();

  return requests.filter((r) => {
    const matchSearch =
      !q ||
      r.userName.toLowerCase().includes(q) ||
      r.id.toString().includes(q);

    const matchStatus =
      filters.status === "all" || r.status === filters.status;

    const matchPriority =
      filters.priority === "all" || r.priority === filters.priority;

    return matchSearch && matchStatus && matchPriority;
  });
}