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
      h.contactPhone.includes(q) ||
      h.id.toString().includes(q);

    // Derive status from occupancy for filtering
    if (filters.status !== "all") {
      const usedBeds = h.bedCapacity - h.availableBeds;
      const percent = h.bedCapacity > 0 ? Math.round((usedBeds / h.bedCapacity) * 100) : 0;
      let derivedStatus: string;
      if (h.availableBeds === 0) derivedStatus = "FULL";
      else if (percent >= 90) derivedStatus = "CRITICAL";
      else if (percent >= 70) derivedStatus = "BUSY";
      else derivedStatus = "NORMAL";
      if (derivedStatus !== filters.status) return false;
    }

    return matchSearch;
  });
}
