export type Hospital = {
  id: string;
  name: string;
  address: string;
  contactPhone: string;
  latitude: number;
  longitude: number;
  availableBeds: number;
  bedCapacity: number;
  availableICU: number;
  icuCapacity: number;
  apiStatus: number;
  startingPrice: number;
  createdAt?: string;
  updatedAt?: string;
};
