import type {
  AmbulanceControlItem,
  AmbulanceProximity,
  AmbulanceSort,
  AmbulanceStatus,
} from "../types/ambulances.types";

type Filters = {
  status: string;
  search: string;
  hospital: string;
  proximity: AmbulanceProximity;
  sortBy: AmbulanceSort;
};

const STATUS_SORT_PRIORITY: Record<AmbulanceStatus, number> = {
  AVAILABLE: 0,
  IN_TRANSIT: 1,
  BUSY: 2,
  MAINTENANCE: 3,
};

function matchProximity(distanceKm: number, proximity: AmbulanceProximity) {
  if (proximity === "all") {
    return true;
  }

  if (proximity === "near") {
    return distanceKm <= 3;
  }

  if (proximity === "mid") {
    return distanceKm > 3 && distanceKm <= 8;
  }

  return distanceKm > 8;
}

function getSortComparator(sortBy: AmbulanceSort) {
  if (sortBy === "nearest") {
    return (a: AmbulanceControlItem, b: AmbulanceControlItem) => a.distanceKm - b.distanceKm;
  }

  if (sortBy === "available") {
    return (a: AmbulanceControlItem, b: AmbulanceControlItem) => {
      const statusDelta = STATUS_SORT_PRIORITY[a.status] - STATUS_SORT_PRIORITY[b.status];

      if (statusDelta !== 0) {
        return statusDelta;
      }

      return a.distanceKm - b.distanceKm;
    };
  }

  return (a: AmbulanceControlItem, b: AmbulanceControlItem) => b.lastUpdatedAt - a.lastUpdatedAt;
}

export default function ambulanceFilter(
  ambulances: AmbulanceControlItem[],
  filters: Filters,
) {
  const q = filters.search.trim().toLowerCase();
  const comparator = getSortComparator(filters.sortBy);

  return ambulances.filter((a) => {
    const matchSearch =
      !q ||
      a.licensePlate.toLowerCase().includes(q) ||
      a.id.toLowerCase().includes(q) ||
      a.hospitalId.toLowerCase().includes(q) ||
      a.hospitalName.toLowerCase().includes(q);

    const matchStatus = filters.status === "all" || a.status === filters.status;
    const matchHospital = filters.hospital === "all" || a.hospitalId === filters.hospital;
    const matchDistance = matchProximity(a.distanceKm, filters.proximity);

    return matchSearch && matchStatus && matchHospital && matchDistance;
  }).slice().sort(comparator);
}
