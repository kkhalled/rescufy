import React from "react";

export default function Logo({text}) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      <div className="h-12 w-12 md:h-14 md:w-14 rounded-2xl bg-primary shadow-[0_0_15px_rgba(37,99,235,0.3)] flex items-center justify-center border border-white/20">
        <span className="text-xl md:text-2xl font-bold text-white">⌁</span>
      </div>

      {text && <div>
        {/* Text colors adapt: Dark Blue in light mode, White in dark mode */}
        <h2 className="text-[28px] md:text-[32px] font-bold leading-tight text-indigo-600 dark:text-white tracking-tight transition-colors">
          {text}
        </h2>
      </div>}
    </div>
  );
}
