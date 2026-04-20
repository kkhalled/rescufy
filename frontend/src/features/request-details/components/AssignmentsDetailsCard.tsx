import { faListCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import InfoCard from "./InfoCard";
import type { RequestAssignment } from "../types/requestDetails.types.ts";

interface AssignmentsDetailsCardProps {
  assignments: RequestAssignment[];
}

function formatDateTime(iso: string | null): string {
  if (!iso) {
    return "-";
  }

  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleString();
}

export default function AssignmentsDetailsCard({ assignments }: AssignmentsDetailsCardProps) {
  return (
    <InfoCard title="Assignments" icon={<FontAwesomeIcon icon={faListCheck} />}>
      {assignments.length === 0 ? (
        <p style={{ color: "var(--text-muted)" }} className="text-sm">No assignments yet.</p>
      ) : (
        <div className="space-y-3">
          {assignments.map((assignment) => (
            <div key={assignment.id} className="rounded-lg border border-border p-3 bg-surface-muted/30">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                <div>
                  <p style={{ color: "var(--text-muted)" }} className="text-xs">Assignment ID</p>
                  <p style={{ color: "var(--text-heading)" }} className="font-semibold">{assignment.id}</p>
                </div>
                <div>
                  <p style={{ color: "var(--text-muted)" }} className="text-xs">Ambulance Plate</p>
                  <p style={{ color: "var(--text-heading)" }} className="font-semibold">{assignment.ambulancePlate || "-"}</p>
                </div>
                <div>
                  <p style={{ color: "var(--text-muted)" }} className="text-xs">Driver Name</p>
                  <p style={{ color: "var(--text-heading)" }} className="font-semibold">{assignment.driverName || "-"}</p>
                </div>
                <div>
                  <p style={{ color: "var(--text-muted)" }} className="text-xs">Hospital ID</p>
                  <p style={{ color: "var(--text-heading)" }} className="font-semibold">{assignment.hospitalId ?? "-"}</p>
                </div>
                <div>
                  <p style={{ color: "var(--text-muted)" }} className="text-xs">Hospital Name</p>
                  <p style={{ color: "var(--text-heading)" }} className="font-semibold">{assignment.hospitalName || "-"}</p>
                </div>
                <div>
                  <p style={{ color: "var(--text-muted)" }} className="text-xs">Distance (km)</p>
                  <p style={{ color: "var(--text-heading)" }} className="font-semibold">
                    {Number.isFinite(assignment.distanceKm) ? assignment.distanceKm.toFixed(3) : "-"}
                  </p>
                </div>
                <div>
                  <p style={{ color: "var(--text-muted)" }} className="text-xs">Status Code</p>
                  <p style={{ color: "var(--text-heading)" }} className="font-semibold">{assignment.status}</p>
                </div>
                <div>
                  <p style={{ color: "var(--text-muted)" }} className="text-xs">Assigned At</p>
                  <p style={{ color: "var(--text-heading)" }} className="font-semibold">{formatDateTime(assignment.assignedAt)}</p>
                </div>
                <div>
                  <p style={{ color: "var(--text-muted)" }} className="text-xs">Completed At</p>
                  <p style={{ color: "var(--text-heading)" }} className="font-semibold">{formatDateTime(assignment.completedAt)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </InfoCard>
  );
}
