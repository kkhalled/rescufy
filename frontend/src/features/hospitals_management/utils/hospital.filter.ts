import type { Hospital } from "../types/hospitals.types";
import { resolveHospitalLoad } from "./hospital.metrics";

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
      const { status } = resolveHospitalLoad(h.availableBeds, h.bedCapacity);

      if (status !== filters.status) {
        return false;
      }
    }

    return matchSearch;
  });
}
