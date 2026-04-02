import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTruckMedical,
  faLocationCrosshairs,
  faBell,
  faUsers,
  faStar,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";

const features = [
  {
    icon: faTruckMedical,
    key: "dispatch",
    gradient: "from-emerald-500 to-green-600",
  },
  {
    icon: faLocationCrosshairs,
    key: "location",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: faBell,
    key: "alerts",
    gradient: "from-amber-400 to-orange-500",
  },
];

const stats = [
  { value: "10K+", label: "Responses", icon: faUsers },
  { value: "4.9★", label: "Rating", icon: faStar },
  { value: "24/7", label: "Active", icon: faClock },
];

export default function SignUpHero() {
  const { t } = useTranslation("auth");

  return (
    <div className="min-h-screen flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-indigo-800 dark:from-indigo-950 dark:via-slate-900 dark:to-slate-950">
      {/* Decorative circle */}
      <div className="absolute top-[15%] right-[-8%] w-[300px] h-[300px] rounded-full bg-white/5 blur-sm pointer-events-none" />
      <div className="absolute bottom-[20%] left-[-5%] w-[200px] h-[200px] rounded-full bg-white/5 blur-sm pointer-events-none" />

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col justify-center px-8 md:px-14 lg:px-16 py-12">
        {/* Trust Badge */}
        <div className="login-fade-up mb-10">
          <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white/90 text-xs font-semibold px-4 py-2 rounded-full border border-white/10">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            Trusted by 10,000+ responders
          </span>
        </div>

        {/* Headline */}
        <div className="login-fade-up-delay-1">
          <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-black text-white leading-[1.1] tracking-tight">
            {t("signUpHero.mainHeadline")}
            <br />
            <span className="text-white/60 font-bold italic">
              {t("signUpHero.mainHeadlineHighlight")}
            </span>
          </h1>
        </div>

        {/* Subtitle */}
        <p className="login-fade-up-delay-2 mt-5 text-white/60 text-base md:text-lg max-w-md leading-relaxed">
          Empowering emergency response with real-time intelligence and seamless
          coordination.
        </p>

        {/* Feature Cards — Vertical List */}
        <div className="login-fade-up-delay-3 mt-10 flex flex-col gap-3 max-w-md">
          {features.map((f) => (
            <div
              key={f.key}
              className="flex items-center gap-4 bg-white/10 hover:bg-white/15 backdrop-blur-sm rounded-2xl px-5 py-4 border border-white/5 transition-all duration-300 group cursor-default"
            >
              <div
                className={`h-10 w-10 min-w-10 rounded-xl bg-gradient-to-br ${f.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
              >
                <FontAwesomeIcon
                  icon={f.icon}
                  className="text-white text-sm"
                />
              </div>
              <div>
                <p className="font-bold text-white text-sm">
                  {t(`signUpHero.features.${f.key}.title`)}
                </p>
                <p className="text-white/50 text-xs leading-relaxed">
                  {t(`signUpHero.features.${f.key}.description`)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Bar — Bottom */}
      <div className="relative z-10 border-t border-white/10 bg-white/5 backdrop-blur-sm">
        <div className="flex items-center justify-around px-8 py-5">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-1">
              <span className="text-2xl md:text-3xl font-black text-white tracking-tight">
                {s.value}
              </span>
              <span className="text-xs text-white/50 font-medium uppercase tracking-wider">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
