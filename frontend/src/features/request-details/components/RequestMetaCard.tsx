import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import InfoCard from "./InfoCard";

interface RequestMetaCardProps {
  id: number;
  userId: string;
  patientName: string;
  patientPhone: string;
  isSelfCase: boolean;
  numberOfPeopleAffected: number;
  address: string;
  latitude: number;
  longitude: number;
  requestStatus: number;
  createdAt: string;
  updatedAt: string;
  comment: string | null;
}

function formatDateTime(iso: string): string {
  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleString();
}

export default function RequestMetaCard({
  id,
  userId,
  patientName,
  patientPhone,
  isSelfCase,
  numberOfPeopleAffected,
  address,
  latitude,
  longitude,
  requestStatus,
  createdAt,
  updatedAt,
  comment,
}: RequestMetaCardProps) {
  const rows = [
    { label: "Request ID", value: String(id) },
    { label: "User ID", value: userId || "-", dir: "ltr" as const },
    { label: "Patient Name", value: patientName || "-" },
    { label: "Patient Phone", value: patientPhone || "-", dir: "ltr" as const },
    { label: "Self Case", value: isSelfCase ? "Yes" : "No" },
    { label: "People Affected", value: String(numberOfPeopleAffected) },
    { label: "Address", value: address || "-" },
    { label: "Latitude", value: Number.isFinite(latitude) ? String(latitude) : "-", dir: "ltr" as const },
    { label: "Longitude", value: Number.isFinite(longitude) ? String(longitude) : "-", dir: "ltr" as const },
    { label: "Status Code", value: String(requestStatus) },
    { label: "Created At", value: formatDateTime(createdAt) },
    { label: "Updated At", value: formatDateTime(updatedAt) },
  ];

  return (
    <InfoCard title="Request Meta" icon={<FontAwesomeIcon icon={faCircleInfo} />}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
        {rows.map((row) => (
          <div key={row.label} className="rounded-lg border border-border p-3 bg-surface-muted/30">
            <p style={{ color: "var(--text-muted)" }} className="text-xs">
              {row.label}
            </p>
            <p style={{ color: "var(--text-heading)" }} className="font-semibold" dir={row.dir || "auto"}>
              {row.value}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-border p-3 bg-surface-muted/30">
        <p style={{ color: "var(--text-muted)" }} className="text-xs">
          Comment
        </p>
        <p style={{ color: "var(--text-heading)" }} className="font-semibold whitespace-pre-wrap">
          {comment?.trim() || "-"}
        </p>
      </div>
    </InfoCard>
  );
}
