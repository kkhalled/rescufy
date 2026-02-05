import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faTrash,
  faLocationDot,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import { faHospital } from "@fortawesome/free-regular-svg-icons";

interface HospitalCardProps {
  id: string;
  name: string;
  email: string;
  status: "NORMAL" | "BUSY" | "CRITICAL" | "FULL";
  usedBeds: number;
  totalBeds: number;
  address: string;
  onCall?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function HospitalCard({
  id,
  name,
  email,
  status,
  usedBeds,
  totalBeds,
  address,
  onCall,
  onEdit,
  onDelete,
}: HospitalCardProps) {
  const percent = Math.round((usedBeds / totalBeds) * 100);
  const freeBeds = totalBeds - usedBeds;

  const statusColor: Record<typeof status, string> = {
    NORMAL: "text-emerald-600 dark:text-emerald-400",
    BUSY: "text-amber-600 dark:text-amber-400",
    CRITICAL: "text-orange-600 dark:text-orange-400",
    FULL: "text-red-600 dark:text-red-400",
  };

  const statusBgColor: Record<typeof status, string> = {
    NORMAL: "bg-emerald-500/15 dark:bg-emerald-500/25",
    BUSY: "bg-amber-500/15 dark:bg-amber-500/25",
    CRITICAL: "bg-orange-500/15 dark:bg-orange-500/25",
    FULL: "bg-red-500/15 dark:bg-red-500/25",
  };

  const capacityBgColor: Record<typeof status, string> = {
    NORMAL: "bg-emerald-500/5 dark:bg-emerald-500/10",
    BUSY: "bg-amber-500/5 dark:bg-amber-500/10",
    CRITICAL: "bg-orange-500/5 dark:bg-orange-500/10",
    FULL: "bg-red-500/5 dark:bg-red-500/10",
  };

  const barColor: Record<typeof status, string> = {
    NORMAL: "from-emerald-400 to-emerald-600",
    BUSY: "from-amber-400 to-amber-600",
    CRITICAL: "from-orange-400 to-orange-600",
    FULL: "from-red-400 to-red-600",
  };

  return (
    <div
      className="
      group
      w-full
      rounded-xl
      bg-bg-card
      
      p-4
      shadow-sm
      hover:shadow-md
      dark:hover:shadow-lg
      transition-all
      duration-300
      ease-out
    "
    >
      {/* Header with status badge */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 dark:bg-primary/20 text-primary shrink-0 text-sm">
              <FontAwesomeIcon icon={faHospital} />
            </div>

            <div className="flex-1 min-w-0 ">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 truncate">
                  {name}
                </h3>
                <span
                  className={`
                inline-flex
                px-1 py-0.5
                rounded-full
                text-[8px]
                font-medium
                ${statusBgColor[status]}
                ${statusColor[status]}
                mt-1
              `}
                >
                  {status}
                </span>
              </div>

              <div className="flex items-center gap-2 mt-0.5 text-xs text-neutral-600 dark:text-neutral-400">
                <span className="truncate" title={email}>
                  {email}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Admin action buttons */}
        <div className="flex gap-1.5 shrink-0">
          <button
            onClick={onEdit}
            className="
              p-2
              rounded-lg
              text-neutral-500
              dark:text-neutral-400
              hover:text-primary
              hover:bg-primary/10
              dark:hover:bg-primary/20
              transition-colors
              duration-200
              opacity-0
              group-hover:opacity-100
              text-xs
              cursor-pointer
            "
            title="Edit hospital"
          >
            <FontAwesomeIcon icon={faPenToSquare} />
          </button>
          <button
            onClick={onDelete}
            className="
              p-2
              rounded-lg
              text-neutral-500
              dark:text-neutral-400
              hover:text-red-500
              hover:bg-red-50
              dark:hover:bg-red-950/30
              transition-colors
              duration-200
              opacity-0
              group-hover:opacity-100
              text-xs
              cursor-pointer
            "
            title="Delete hospital"
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      </div>

      {/* Bed Capacity Section */}
      <div className={`mb-3 p-3 rounded-lg ${capacityBgColor[status]}`}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
            Capacity
          </span>
          <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
            {usedBeds}/{totalBeds}
          </span>
        </div>

        {/* Animated progress bar */}
        <div className="h-2 rounded-full bg-neutral-200 dark:bg-neutral-700 overflow-hidden">
          <div
            className={`h-full bg-linear-to-r ${barColor[status]} transition-all duration-500 ease-out`}
            style={{ width: `${percent}%` }}
          />
        </div>

        {/* Capacity stats */}
        <div className="grid grid-cols-3 gap-2 mt-2">
          <div className="text-center">
            <div className="text-xs text-neutral-600 dark:text-neutral-400">
              Used
            </div>
            <div className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
              {usedBeds}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-neutral-600 dark:text-neutral-400">
              Free
            </div>
            <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
              {freeBeds}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-neutral-600 dark:text-neutral-400">
              Usage
            </div>
            <div className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
              {percent}%
            </div>
          </div>
        </div>
      </div>

      {/* ID section */}
      <div className="mb-3 flex items-center gap-1 text-xs font-medium text-neutral-700 dark:text-neutral-300">
        <span>ID:</span>
        <span className="font-semibold text-primary">{id}</span>
      </div>

      {/* Address section */}
      <div className="flex items-center gap-2 mb-3 text-xs text-neutral-600 dark:text-neutral-400">
        <div className="flex items-center justify-center w-4 h-4 shrink-0 text-neutral-500 dark:text-neutral-400">
          <FontAwesomeIcon icon={faLocationDot} />
        </div>
        <span className="truncate" title={address}>
          {address}
        </span>
      </div>

      {/* Call button */}
      <button
        onClick={onCall}
        className="
          w-full
          flex items-center justify-center gap-1.5
          rounded-lg
          bg-linear-to-r
          from-primary
          to-primary/90
          hover:from-primary/95
          hover:to-primary/85
          dark:from-primary
          dark:to-primary/90
          text-white
          px-3
          py-2
          text-xs
          font-semibold
          shadow-sm
          hover:shadow-md
          transition-all
          duration-200
          active:scale-95
          cursor-pointer
        "
      >
        <FontAwesomeIcon icon={faPhone} className="text-xs" />
        <span>Call</span>
      </button>
    </div>
  );
}
