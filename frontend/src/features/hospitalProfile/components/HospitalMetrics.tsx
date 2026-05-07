
import CompactMetric from "./CompactMetric";

type Props = {
  totalBeds: string;
  availableBeds: string;
  occupancy: number;
};

export default function HospitalMetrics({
  totalBeds,
  availableBeds,
  occupancy,
}: Props) {
  return (
    <div
      className="
        grid grid-cols-2 gap-3
        sm:grid-cols-3
      "
    >
      <CompactMetric
        label="Total Beds"
        value={totalBeds}
      />

      <CompactMetric
        label="Available Beds"
        value={availableBeds}
        tone="success"
      />

      <CompactMetric
        label="Occupancy"
        value={`${occupancy}%`}
        tone={
          occupancy > 85
            ? "danger"
            : occupancy > 70
            ? "warning"
            : "success"
        }
      />
    </div>
  );
}
