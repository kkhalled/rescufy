import type { Hospital } from "../types/hospitals.types";
type filters = {
  status: string;
  search: string;
};

export default function hospitalFilter(
  hospitals: Hospital[],
  filters: filters,
) {
  const q = filters.search.trim().toLowerCase();

  return hospitals.filter((h) => {
    const matchSearch =
      !q ||
      h.name.toLowerCase().includes(q) ||
      h.address.toLowerCase().includes(q) ||
      h.id.toString().includes(q);

      const matchStatus =
      filters.status === "all" || h.status === filters.status;

    return matchSearch && matchStatus;
  });
}
