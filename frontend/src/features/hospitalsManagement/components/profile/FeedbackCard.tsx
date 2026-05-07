import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

export type FeedbackCardProps = {
  userName: string;
  comment: string;
  rating: number | null;
  createdAt: string;
  locale: string;
};

export function FeedbackCard({ userName, comment, rating, createdAt, locale }: FeedbackCardProps) {
  return (
    <article className="rounded-xl border border-border/70 bg-surface-muted/20 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-heading">{userName}</p>
          <p className="mt-1 text-xs text-muted">
            {createdAt
              ? new Date(createdAt).toLocaleString(locale, {
                  dateStyle: "medium",
                  timeStyle: "short",
                })
              : "-"}
          </p>
        </div>

        <div className="flex items-center gap-1 text-amber-500">
          {Array.from({ length: 5 }).map((_, index) => (
            <FontAwesomeIcon
              key={index}
              icon={faStar}
              className={index < (rating ?? 0) ? "text-amber-500" : "text-border"}
            />
          ))}
        </div>
      </div>

      <p className="mt-3 text-sm leading-6 text-muted">{comment}</p>
    </article>
  );
}
