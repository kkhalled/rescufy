import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTruckMedical,
  faLocationCrosshairs,
  faBell,
  faFileMedical,
} from "@fortawesome/free-solid-svg-icons";
import signUpImg from "../../../../assets/images/authImages/signUpImg.jpg";
import Logo from "@/shared/common/Logo";


export default function SignUpHero() {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative overflow-hidden"
      style={{
        backgroundImage: `url(${signUpImg})`,
      }}
    >
      {/* ADAPTIVE OVERLAY: 
        - Light Mode: White/Blue linear (makes image subtle, text dark)
        - Dark Mode: Dark Blue/Black linear (makes text white)
      */}
      <div className="absolute inset-0 bg-linear-to-br from-slate-50/95  via-slate-100/90 to-slate-200/85  dark:from-blue-950/90 dark:via-slate-900/90 dark:to-black/95 transition-all duration-500 z-0"></div>

      <div className="relative z-10 max-w-4xl px-6 md:px-10 py-6 md:py-6">
        {/* Branding */}
        <Logo text={"Rescufy"} />

        {/* Headline */}
        <h1 className="text-4xl md:text-5xl text-indigo-950 dark:text-white font-black leading-tight tracking-tight drop-shadow-sm transition-colors">
          Real-Time Emergency
          <br />
          <span className="bg-linear-to-r from-violet-600 to-indigo-500 dark:from-cyan-400 dark:to-blue-500 bg-clip-text text-transparent">
            Saving seconds, Saving lives
          </span>
        </h1>

        <p className="mt-4 text-lg text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed transition-colors"></p>

        {/* Section Title */}
        <div className="mt-10">
          <div className="flex items-center gap-3 mb-10">
            <div className="h-px w-8 bg-violet-500 dark:bg-cyan-500/50"></div>
            <h2 className="text-sm uppercase tracking-wider text-indigo-600 dark:text-cyan-400 font-bold">
              Mission-Critical Capabilities
            </h2>
          </div>

          {/* Feature Cards Container */}
          <div className="grid  xl:grid-cols-2 gap-4 max-w-3xl">
            {/* Feature 1 */}
            <div className="rounded-2xl p-4 md:p-5 flex gap-4 bg-white/60 dark:bg-slate-600/10 backdrop-blur-xl border border-slate-200 dark:border-white/10 shadow-lg dark:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
              <div className="h-10 w-10 min-w-10 rounded-lg flex items-center justify-center bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                <FontAwesomeIcon icon={faTruckMedical} className="text-lg" />
              </div>
              <div>
                <p className="font-semibold text-slate-800 dark:text-white">
                  Real-Time Dispatch
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Assign units instantly & track fleet movement live.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="rounded-2xl p-4 md:p-5 flex  gap-4 bg-white/60 dark:bg-slate-600/10 backdrop-blur-xl border border-slate-200 dark:border-white/10 shadow-lg dark:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
              <div className="h-10 w-10 min-w-10  rounded-lg flex items-center justify-center bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20">
                <FontAwesomeIcon
                  icon={faLocationCrosshairs}
                  className="text-lg"
                />
              </div>
              <div>
                <p className="font-semibold text-slate-800 dark:text-white">
                  Location Intelligence
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  GPS routing with ETA context & route awareness.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="rounded-2xl p-4 md:p-5 flex  gap-4 bg-white/60 dark:bg-slate-600/10 backdrop-blur-xl border border-slate-200 dark:border-white/10 shadow-lg dark:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
              <div className="h-10 w-10 min-w-10  rounded-lg flex items-center justify-center bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20">
                <FontAwesomeIcon icon={faBell} className="text-lg" />
              </div>
              <div>
                <p className="font-semibold text-slate-800 dark:text-white">
                  Smart Alerts
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Priority-based notifications for critical cases.
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="rounded-2xl p-4 md:p-5 flex  gap-4 bg-white/60 dark:bg-slate-600/10 backdrop-blur-xl border border-slate-200 dark:border-white/10 shadow-lg dark:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
              <div className="h-10 w-10 min-w-10  rounded-lg flex items-center justify-center bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400 border border-purple-200 dark:border-purple-500/20">
                <FontAwesomeIcon icon={faFileMedical} className="text-lg" />
              </div>
              <div>
                <p className="font-semibold text-slate-800 dark:text-white">
                  Incident Reports
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Structured medical & operational documentation.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
