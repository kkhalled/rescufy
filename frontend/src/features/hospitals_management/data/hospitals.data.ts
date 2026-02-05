export interface Hospital {
  id: string;
  name: string;
  email: string;
  status: "NORMAL" | "BUSY" | "CRITICAL" | "FULL";
  usedBeds: number;
  totalBeds: number;
  address: string;
}

export const hospitalsData: Hospital[] = [
  {
    id: "1",
    name: "El-salam Hospital",
    email: "info@elsalam-hospital.com",
    status: "CRITICAL",
    usedBeds: 90,
    totalBeds: 100,
    address: "123 Main St, City, Country",
  },
  {
    id: "2",
    name: "City Medical Center",
    email: "contact@citymedical.com",
    status: "NORMAL",
    usedBeds: 50,
    totalBeds: 100,
    address: "456 Oak Avenue, City, Country",
  },
  {
    id: "3",
    name: "Central Hospital",
    email: "support@centralhospital.com",
    status: "BUSY",
    usedBeds: 75,
    totalBeds: 100,
    address: "789 Pine Road, City, Country",
  },
  {
    id: "4",
    name: "Emergency Care Hospital",
    email: "emergency@carehosp.com",
    status: "FULL",
    usedBeds: 100,
    totalBeds: 100,
    address: "321 Elm Street, City, Country",
  },
  {
    id: "5",
    name: "Pediatric Hospital",
    email: "pediatrics@kidshospital.com",
    status: "NORMAL",
    usedBeds: 45,
    totalBeds: 80,
    address: "654 Maple Drive, City, Country",
  },
];

// Simulated API response
export const getHospitalsResponse = () => ({
  success: true,
  message: "Hospitals retrieved successfully",
  data: hospitalsData,
  timestamp: new Date().toISOString(),
});
