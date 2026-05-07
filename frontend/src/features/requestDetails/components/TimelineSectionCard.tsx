import { Clock3 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/i18n/useLanguage";
import SectionCard from "./SectionCard";

interface TimelineEvent {
  title: string;
  time: string;
  description: string;
}

interface TimelineSectionCardProps {
  events: TimelineEvent[];
}

export default function TimelineSectionCard({ events }: TimelineSectionCardProps) {
  const { t } = useTranslation("requests");
  const { isRTL } = useLanguage();

  return (
    <SectionCard
      title={t("details.timeline")}
      icon={<Clock3 className="h-4 w-4" />}
      subtitle={t("details.adminLayout.sections.timeline.subtitle")}
    >
      <div className="space-y-3">
        {events.map((event, index) => (
          <div key={`${event.title}-${index}`} className={`flex gap-3 ${isRTL ? "flex-row-reverse text-right" : ""}`}>
            <div className="flex flex-col items-center">
              <span className="mt-1 h-2.5 w-2.5 rounded-full bg-primary" />
              {index < events.length - 1 ? <span className="mt-1 h-full w-0.5 bg-border" /> : null}
            </div>
            <div className="pb-2">
              <p className="text-sm font-semibold text-heading">{event.title}</p>
              <p className="text-xs text-muted">{event.time}</p>
              <p className="mt-1 text-xs text-body">{event.description}</p>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
