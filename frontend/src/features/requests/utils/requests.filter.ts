type FilterableRequest = {
  id: string | number;
  userName: string;
  status: string;
  priority?: string;
};

export type Filters = {
  status: string;
  search: string;
  priority?: string;
};

export function filterRequests<T extends FilterableRequest>(
  requests: T[],
  filters: Filters,
): T[] {
  const q = filters.search.trim().toLowerCase();

  return requests.filter((r) => {
    const matchSearch =
      !q ||
      r.userName.toLowerCase().includes(q) ||
      String(r.id).includes(q);

    const matchStatus =
      filters.status === "all" || r.status === filters.status;

    const matchPriority =
      !filters.priority || filters.priority === "all" || r.priority === filters.priority;

    return matchSearch && matchStatus && matchPriority;
  });
}