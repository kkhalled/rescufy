export type HospitalLoadStatus = "NORMAL" | "BUSY" | "CRITICAL" | "FULL";

export type HospitalLoadMetrics = {
  usedBeds: number;
  occupancyPercent: number;
  status: HospitalLoadStatus;
};

export function resolveHospitalLoad(
  availableBeds: number,
  bedCapacity: number,
): HospitalLoadMetrics {
  const safeCapacity = Math.max(0, bedCapacity);
  const safeAvailable = Math.max(0, Math.min(availableBeds, safeCapacity));
  const usedBeds = Math.max(safeCapacity - safeAvailable, 0);
  const occupancyPercent =
    safeCapacity > 0 ? Math.round((usedBeds / safeCapacity) * 100) : 0;

  if (safeAvailable === 0) {
    return {
      usedBeds,
      occupancyPercent,
      status: "FULL",
    };
  }

  if (occupancyPercent >= 90) {
    return {
      usedBeds,
      occupancyPercent,
      status: "CRITICAL",
    };
  }

  if (occupancyPercent >= 70) {
    return {
      usedBeds,
      occupancyPercent,
      status: "BUSY",
    };
  }

  return {
    usedBeds,
    occupancyPercent,
    status: "NORMAL",
  };
}