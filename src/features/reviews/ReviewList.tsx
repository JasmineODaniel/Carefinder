import { Star } from 'lucide-react';
import { Spinner } from '../../components/ui/Spinner';
import type { Review } from './useReviews';

interface ReviewListProps {
  reviews: Review[];
  loading: boolean;
  error: string | null;
}

export function ReviewList({ reviews, loading, error }: ReviewListProps) {
  if (loading) {
    return (
      <div className="mt-6 flex justify-center py-8">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div role="alert" className="mt-6 text-[13px] text-error">
        Couldn&apos;t load reviews. {error}
      </div>
    );
  }

  if (reviews.length === 0) return null;

  return (
    <div className="mt-6 space-y-4">
      <h3 className="font-display text-[15px] font-semibold text-ink">
        Reviews ({reviews.length})
      </h3>
      {reviews.map((review) => (
        <article key={review.id} className="rounded-card border border-line bg-surface p-5">
          <div className="mb-2 flex items-center gap-2">
            <div className="flex gap-0.5" aria-label={`${review.rating} out of 5 stars`}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`size-4 ${i < review.rating ? 'fill-accent text-accent' : 'text-line'}`}
                  strokeWidth={1.5}
                />
              ))}
            </div>
            <time className="text-[12px] text-soft" dateTime={review.created_at}>
              {new Date(review.created_at).toLocaleDateString('en-NG', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </time>
          </div>
          {review.text && <p className="text-[14px] text-soft">{review.text}</p>}
        </article>
      ))}
    </div>
  );
}
