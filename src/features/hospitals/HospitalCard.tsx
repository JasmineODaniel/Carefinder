import { MapPin, Phone, Star, Hospital as HospitalIcon } from 'lucide-react';
import type { Hospital } from '../../types/hospital';

interface HospitalCardProps {
  hospital: Hospital;
  rating?: number | null;
  reviewCount?: number;
  distanceKm?: number;
  onSelect?: (hospital: Hospital) => void;
}

const MAX_VISIBLE_SPECIALTIES = 3;

export function HospitalCard({ hospital, rating, reviewCount, distanceKm, onSelect }: HospitalCardProps) {
  const { name, city, lga, phone, specialties = [], ownership } = hospital;

  const visible = specialties.slice(0, MAX_VISIBLE_SPECIALTIES);
  const overflow = specialties.length - visible.length;

  return (
    <article
      onClick={() => onSelect?.(hospital)}
      className="group relative flex cursor-pointer flex-col gap-4 overflow-hidden rounded-[5px]
                 border border-line bg-surface p-5 transition-all duration-200
                 hover:-translate-y-0.5 hover:border-accent
                 hover:shadow-[0_12px_36px_-12px_rgba(45,91,255,0.35)]"
    >
      <span
        aria-hidden
        className="absolute inset-y-0 left-0 w-[3px] origin-top scale-y-0 rounded-[5px]
                   bg-accent transition-transform duration-200 group-hover:scale-y-100"
      />

      <header className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-[5px] bg-tint text-accent">
            <HospitalIcon className="size-4.5" strokeWidth={2} />
          </span>
          <div className="min-w-0">
            <h3 className="truncate font-display text-[13px] leading-snug text-ink">{name.toUpperCase()}</h3>
            <p className="mt-0.5 flex items-center gap-1 text-[12px] text-soft">
              <MapPin className="size-3 shrink-0" strokeWidth={2} />
              <span className="truncate">{[lga, city].filter(Boolean).join(', ')}</span>
            </p>
          </div>
        </div>

        <OwnershipBadge ownership={ownership} />
      </header>

      {specialties.length > 0 && (
        <ul className="flex flex-wrap gap-1.5">
          {visible.map((s) => (
            <li
              key={s}
              className="rounded-[5px] bg-muted px-2.5 py-1 text-[11px] font-medium capitalize text-soft"
            >
              {s}
            </li>
          ))}
          {overflow > 0 && (
            <li className="rounded-[5px] px-2.5 py-1 text-[11px] font-medium text-accent">
              +{overflow} more
            </li>
          )}
        </ul>
      )}

      <footer className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-line pt-3">
        <RatingDisplay rating={rating ?? null} count={reviewCount} />
        {phone && (
          <span className="flex items-center gap-1.5 text-[12px] text-soft">
            <Phone className="size-3" strokeWidth={2} />
            {phone}
          </span>
        )}
        {typeof distanceKm === 'number' && (
          <span className="ml-auto rounded-[5px] bg-tint px-2.5 py-1 text-[11px] font-semibold text-accent">
            {distanceKm.toFixed(1)} km
          </span>
        )}
      </footer>
    </article>
  );
}

function OwnershipBadge({ ownership }: { ownership: Hospital['ownership'] }) {
  const isPublic = ownership === 'public';
  return (
    <span
      className={`shrink-0 rounded-[5px] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${
        isPublic ? 'bg-tint text-accent' : 'bg-muted text-soft'
      }`}
    >
      {ownership}
    </span>
  );
}

function RatingDisplay({ rating, count }: { rating: number | null; count?: number }) {
  if (rating == null) {
    return <span className="text-[11px] font-medium text-soft">No reviews yet</span>;
  }
  return (
    <span className="flex items-center gap-1.5 text-[12px]">
      <Star className="size-3.5 fill-accent text-accent" strokeWidth={2} />
      <span className="font-semibold text-ink">{rating.toFixed(1)}</span>
      {typeof count === 'number' && <span className="text-soft">({count})</span>}
    </span>
  );
}
