import type { Ambulance } from "../types/ambulances.types";

export const ambulancesData: Ambulance[] = [
  {
    id: "AMB-001",
    licensePlate: "ABC-1234",
    hospitalId: "1",
    status: "AVAILABLE",
    latitude: 31.2454,
    longitude: 30.0454,
  },
  {
    id: "AMB-002",
    licensePlate: "DEF-5678",
    hospitalId: "1",
    status: "IN_TRANSIT",
    latitude: 31.2500,
    longitude: 30.0500,
  },
  {
    id: "AMB-003",
    licensePlate: "GHI-9012",
    hospitalId: "2",
    status: "AVAILABLE",
    latitude: 31.2300,
    longitude: 30.0300,
  },
  {
    id: "AMB-004",
    licensePlate: "JKL-3456",
    hospitalId: "2",
    status: "BUSY",
    latitude: 31.2400,
    longitude: 30.0400,
  },
  {
    id: "AMB-005",
    licensePlate: "MNO-7890",
    hospitalId: "3",
    status: "MAINTENANCE",
    latitude: 31.2600,
    longitude: 30.0600,
  },
  {
    id: "AMB-006",
    licensePlate: "PQR-2345",
    hospitalId: "3",
    status: "AVAILABLE",
    latitude: 31.2550,
    longitude: 30.0550,
  },
];

// Simulated API response
export const getAmbulancesResponse = () => ({
  success: true,
  message: "Ambulances retrieved successfully",
  data: ambulancesData,
  timestamp: new Date().toISOString(),
});
