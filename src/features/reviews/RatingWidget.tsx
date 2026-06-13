import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

interface RatingWidgetProps {
  rating: number | null;
  count?: number;
  size?: 'sm' | 'md';
}

export function RatingWidget({ rating, count, size = 'md' }: RatingWidgetProps) {
  if (rating == null) {
    return (
      <p className="text-[13px] text-soft">
        No reviews yet — be the first to rate this hospital.
      </p>
    );
  }

  const stars = Math.round(rating);
  const iconClass = size === 'sm' ? 'text-[16px]' : 'text-[20px]';

  return (
    <div className="flex items-center gap-2">
      <div
        className="flex items-center gap-0.5"
        aria-label={`${rating.toFixed(1)} out of 5 stars`}
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <FontAwesomeIcon
            key={i}
            icon={faStar}
            className={`${iconClass} ${i < stars ? 'text-accent' : 'text-line'}`}
          />
        ))}
      </div>
      <span className="font-semibold text-ink">{rating.toFixed(1)}</span>
      {typeof count === 'number' && (
        <span className="text-[13px] text-soft">
          ({count} {count === 1 ? 'review' : 'reviews'})
        </span>
      )}
    </div>
  );
}
