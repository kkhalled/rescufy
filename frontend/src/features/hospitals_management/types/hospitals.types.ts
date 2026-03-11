export type Hospital = {
  id: string;
  name: string;
  address: string;
  contactPhone: string;
  latitude: number;
  longitude: number;
  availableBeds: number;
  bedCapacity: number;
  createdAt?: string;
  updatedAt?: string;
};
