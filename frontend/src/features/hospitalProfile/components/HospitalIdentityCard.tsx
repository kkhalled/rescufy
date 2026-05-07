
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHospital } from "@fortawesome/free-solid-svg-icons";

import HospitalMetrics from "./HospitalMetrics";

type Props = {
  hospital: any;
  form: any;
  occupancy: number;
  updateHospitalStatus?: (status: number) => void;
};

export default function HospitalIdentityCard({
  hospital,
  form,
  occupancy,
  updateHospitalStatus,
}: Props) {
  return (
    <div
      className="
        flex flex-col gap-5
        lg:flex-row lg:items-start lg:justify-between
      "
    >
      <div className="flex items-start gap-4">
        <div
          className="
            flex h-16 w-16
            shrink-0
            items-center justify-center
            rounded-2xl
            bg-cyan-500/10
            text-cyan-300
          "
        >
          <FontAwesomeIcon
            icon={faHospital}
            className="text-2xl"
          />
        </div>

        <div>
          <h3 className="text-xl font-bold text-heading">
            {form.name}
          </h3>

          <p className="mt-1 text-sm text-muted">
            {form.address}
          </p>

          <div className="mt-3">
            <select
              value={hospital.apiStatus ?? 0}
              onChange={(e) =>
                updateHospitalStatus?.(
                  Number(e.target.value)
                )
              }
              className="
                rounded-xl
                border border-white/[0.06]
                bg-background-second/50
                px-3 py-2
                text-sm text-heading
              "
            >
              <option value={0}>Normal</option>
              <option value={1}>Busy</option>
              <option value={2}>Critical</option>
              <option value={3}>Full</option>
            </select>
          </div>
        </div>
      </div>

      <HospitalMetrics
        totalBeds={form.totalBeds}
        availableBeds={form.availableBeds}
        occupancy={occupancy}
      />
    </div>
  );
}
