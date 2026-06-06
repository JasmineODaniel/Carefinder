import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, ChevronLeft } from 'lucide-react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { PageLayout } from '../components/layout/PageLayout';
import { Badge } from '../components/ui/Badge';
import { RatingWidget } from '../features/reviews/RatingWidget';
import { ReviewForm } from '../features/reviews/ReviewForm';
import { ReviewList } from '../features/reviews/ReviewList';
import { useReviews } from '../features/reviews/useReviews';
import { supabase } from '../lib/supabase';
import type { Hospital } from '../types/hospital';

export function HospitalDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    supabase
      .from('hospitals')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data, error: err }) => {
        if (err) setError(err.message);
        else setHospital(data);
        setLoading(false);
      });
  }, [id]);

  const { reviews, loading: reviewsLoading, error: reviewsError, addReview } =
    useReviews(id ?? '');

  if (loading) {
    return (
      <PageLayout>
        <div className="mx-auto max-w-4xl px-6 py-12">
          <div className="h-8 w-48 animate-pulse rounded-card bg-muted" />
          <div className="mt-6 h-64 animate-pulse rounded-card bg-muted" />
        </div>
      </PageLayout>
    );
  }

  if (error || !hospital) {
    return (
      <PageLayout>
        <div className="mx-auto max-w-4xl px-6 py-12">
          <p className="text-[14px] text-error">Hospital not found.</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 rounded-[5px] text-[14px] font-medium text-accent hover:underline"
          >
            Go back
          </button>
        </div>
      </PageLayout>
    );
  }

  const descriptionHtml = hospital.description
    ? DOMPurify.sanitize(String(marked.parse(hospital.description)))
    : null;

  return (
    <PageLayout>
      <div className="mx-auto max-w-4xl px-6 py-8">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-1.5 rounded-[5px] text-[14px] font-medium text-soft transition-colors hover:text-ink"
        >
          <ChevronLeft className="size-4" strokeWidth={2} />
          Back to results
        </button>

        <div className="rounded-card border border-line bg-surface p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="font-display text-[24px] text-ink">{hospital.name.toUpperCase()}</h1>
              <p className="mt-1 flex items-center gap-1.5 text-[14px] text-soft">
                <MapPin className="size-4" strokeWidth={2} />
                {[hospital.address, hospital.lga, hospital.city].filter(Boolean).join(', ')}
              </p>
            </div>
            <Badge variant={hospital.ownership === 'public' ? 'accent' : 'default'}>
              {hospital.ownership}
            </Badge>
          </div>

          {hospital.specialties?.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {hospital.specialties.map((s) => (
                <Badge key={s}>{s}</Badge>
              ))}
            </div>
          )}

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {hospital.phone && (
              <a
                href={`tel:${hospital.phone}`}
                className="flex items-center gap-2 text-[14px] text-soft transition-colors hover:text-accent"
              >
                <Phone className="size-4" strokeWidth={2} />
                {hospital.phone}
              </a>
            )}
            {hospital.email && (
              <a
                href={`mailto:${hospital.email}`}
                className="flex items-center gap-2 text-[14px] text-soft transition-colors hover:text-accent"
              >
                <Mail className="size-4" strokeWidth={2} />
                {hospital.email}
              </a>
            )}
            {hospital.visiting_hours && (
              <div className="flex items-start gap-2 text-[14px] text-soft">
                <Clock className="mt-0.5 size-4 shrink-0" strokeWidth={2} />
                <span>{hospital.visiting_hours}</span>
              </div>
            )}
          </div>

          {descriptionHtml && (
            <div
              className="prose prose-sm mt-6 max-w-none text-soft"
              dangerouslySetInnerHTML={{ __html: descriptionHtml }}
            />
          )}
        </div>

        <div className="mt-8">
          <RatingWidget
            rating={hospital.rating ?? null}
            count={hospital.review_count}
          />
          <ReviewForm onSubmit={addReview} />
          <ReviewList reviews={reviews} loading={reviewsLoading} error={reviewsError} />
        </div>
      </div>
    </PageLayout>
  );
}
