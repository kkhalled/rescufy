export type Hospital = {
  id: string;
  name: string;
  status: "NORMAL" | "BUSY" | "CRITICAL" | "FULL";
  email: string;
  usedBeds: number;
  totalBeds: number;
  address: string;
};
