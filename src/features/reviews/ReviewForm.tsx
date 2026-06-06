import { useState } from 'react';
import { Star } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../auth/AuthContext';

interface ReviewFormProps {
  onSubmit: (rating: number, text: string) => Promise<void>;
}

export function ReviewForm({ onSubmit }: ReviewFormProps) {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!user) {
    return (
      <div className="mt-6 rounded-card border border-dashed border-line p-6 text-center">
        <p className="text-[14px] text-soft">
          <a href="/admin/login" className="text-accent hover:underline">
            Sign in
          </a>{' '}
          to leave a review.
        </p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="mt-6 rounded-[5px] bg-green-50 p-4 text-[14px] text-green-700">
        Thank you for your review!
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) {
      setError('Please select a star rating.');
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      await onSubmit(rating, text);
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit review.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 rounded-card border border-line bg-surface p-6">
      <h3 className="mb-4 font-display text-[15px] font-semibold text-ink">Leave a review</h3>

      <div className="mb-4">
        <p className="mb-2 text-[13px] font-medium text-ink">Rating</p>
        <div className="flex gap-1" role="radiogroup" aria-label="Star rating">
          {Array.from({ length: 5 }).map((_, i) => {
            const value = i + 1;
            return (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={rating === value}
                aria-label={`${value} star${value !== 1 ? 's' : ''}`}
                onClick={() => setRating(value)}
                onMouseEnter={() => setHovered(value)}
                onMouseLeave={() => setHovered(0)}
                className="rounded-[5px] p-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <Star
                  className={`size-7 transition-colors ${
                    value <= (hovered || rating) ? 'fill-accent text-accent' : 'text-line'
                  }`}
                  strokeWidth={1.5}
                />
              </button>
            );
          })}
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="review-text" className="mb-1.5 block text-[13px] font-medium text-ink">
          Review (optional)
        </label>
        <textarea
          id="review-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          placeholder="Share your experience…"
          className="w-full rounded-[5px] border border-line bg-surface px-3 py-2.5 text-[14px] text-ink placeholder:text-soft transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
        />
      </div>

      {error && (
        <p role="alert" className="mb-3 text-[13px] text-error">
          {error}
        </p>
      )}

      <Button type="submit" disabled={submitting}>
        {submitting ? 'Submitting…' : 'Submit review'}
      </Button>
    </form>
  );
}
