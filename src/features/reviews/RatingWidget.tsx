import { Star } from 'lucide-react';

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
  const iconSize = size === 'sm' ? 'size-4' : 'size-5';

  return (
    <div className="flex items-center gap-2">
      <div
        className="flex items-center gap-0.5"
        aria-label={`${rating.toFixed(1)} out of 5 stars`}
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`${iconSize} ${i < stars ? 'fill-accent text-accent' : 'text-line'}`}
            strokeWidth={1.5}
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
