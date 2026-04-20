import { faClock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import InfoCard from "./InfoCard";
import { useTranslation } from "react-i18next";

interface TimelineEvent {
  title: string;
  time: string;
  description?: string | null;
}

interface TimelineCardProps {
  events: TimelineEvent[];
}

const TimelineCard = ({ events }: TimelineCardProps) => {
  const { t } = useTranslation("requests");
  return (
    <InfoCard title={t("details.timeline")} icon={<FontAwesomeIcon icon={faClock} />}>
      <div className="space-y-3">
        {events.map((event, index) => (
          <div key={index} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div
                style={{ backgroundColor: "var(--brand-primary)" }}
                className="w-2 h-2 rounded-full mt-2"
              ></div>
              {index !== events.length - 1 && (
                <div
                  style={{
                    backgroundColor: "var(--border-default)",
                  }}
                  className="w-0.5 h-12 my-1"
                ></div>
              )}
            </div>
            <div className="pb-3">
              <p
                style={{ color: "var(--text-heading)" }}
                className="text-sm font-semibold"
              >
                {event.title}
              </p>
              <p style={{ color: "var(--text-muted)" }} className="text-xs">
                {event.time}
              </p>
              {event.description && (
                <p
                  style={{ color: "var(--text-body)" }}
                  className="text-xs mt-1"
                >
                  {event.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </InfoCard>
  );
};

export default TimelineCard;
