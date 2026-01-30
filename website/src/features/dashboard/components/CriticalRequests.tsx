import { faBell, faClock } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CriticalRequestCard from "./CriticalRequestCard";

export default function CriticalRequests() {
  return (
    <div
      className="
        relative
        text-heading
        
        py-2 md:py-6 md:px-3
        rounded-lg md:rounded-2xl
        overflow-hidden
        border border-red-500/20
        shadow-[0_0_60px_rgba(230,57,70,0.15)]
      "
    >
      {/* Red glow background */}
      <div className="absolute -inset-1 rounded-2xl bg-red-500/10 blur-3xl pointer-events-none" />

      <div className="relative">
        <header className=" border-b border-red-500/20 space-x-2 flex items-center py-3 md:py-1  mb-4 md:mb-6">
          <span>
            <FontAwesomeIcon icon={faBell} style={{ color: "#E63946" }} />
          </span>
          <span className="font-medium text-sm md:text-base">
            Critical Requests
          </span>
        </header>

        <div className="grid space-y-2">
          <CriticalRequestCard />
          <CriticalRequestCard />
        </div>
      </div>
    </div>
  );
}
