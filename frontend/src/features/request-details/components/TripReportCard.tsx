import { faFileLines } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import InfoCard from "./InfoCard";

interface TripReportCardProps {
  tripReport: Record<string, unknown> | null;
}

export default function TripReportCard({ tripReport }: TripReportCardProps) {
  return (
    <InfoCard title="Trip Report" icon={<FontAwesomeIcon icon={faFileLines} />}>
      {tripReport ? (
        <pre
          style={{
            backgroundColor: "var(--surface-soft)",
            color: "var(--text-body)",
            borderColor: "var(--border-default)",
          }}
          className="overflow-x-auto rounded-lg border p-3 text-xs"
        >
          {JSON.stringify(tripReport, null, 2)}
        </pre>
      ) : (
        <p style={{ color: "var(--text-muted)" }} className="text-sm">No trip report yet.</p>
      )}
    </InfoCard>
  );
}
