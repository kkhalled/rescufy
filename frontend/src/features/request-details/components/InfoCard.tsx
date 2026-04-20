import type { ReactNode } from "react";

interface InfoCardProps {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}

const InfoCard = ({ icon, title, children }: InfoCardProps) => {
  return (
    <div
      style={{
        borderColor: "var(--border-default)",
        boxShadow: "var(--shadow-card)",
      }}
      className="bg-bg-card rounded-xl p-4 md:p-6 space-y-4 border"
    >
      <div
        style={{
          color: "var(--text-heading)",
        }}
        className="flex items-center gap-3 font-semibold"
      >
        <span
          style={{
            color: "var(--brand-primary)",
          }}
          className="text-lg"
        >
          {icon}
        </span>
        <span className="text-lg">{title}</span>
      </div>
      {children}
    </div>
  );
};

export default InfoCard;
