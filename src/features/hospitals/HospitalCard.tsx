import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faDownload } from '@fortawesome/free-solid-svg-icons';
import type { Hospital } from '../../types/hospital';

interface HospitalCardProps {
  hospital: Hospital;
  rating?: number | null;
  reviewCount?: number;
  distanceKm?: number;
  onSelect?: (hospital: Hospital) => void;
  compact?: boolean;
}

const MAX_VISIBLE_SPECIALTIES = 3;

function downloadHospital(h: Hospital) {
  const headers = 'Name,City,LGA,Phone,Ownership,Specialties';
  const row = [
    `"${h.name}"`,
    h.city ?? '',
    h.lga ?? '',
    h.phone ?? '',
    h.ownership ?? '',
    `"${(h.specialties ?? []).join('; ')}"`,
  ].join(',');
  const blob = new Blob([`${headers}\n${row}`], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${h.name.replace(/\s+/g, '-').toLowerCase()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function SpecialtyPills({ specialties, max }: { specialties: string[]; max: number }) {
  const visible = specialties.slice(0, max);
  const overflow = specialties.length - visible.length;
  if (!specialties.length) return null;
  return (
    <ul className="flex flex-wrap gap-1.5">
      {visible.map((s) => (
        <li key={s} className="rounded-[5px] bg-muted px-2.5 py-1 text-[11px] font-medium capitalize text-soft">
          {s}
        </li>
      ))}
      {overflow > 0 && (
        <li className="rounded-[5px] px-2.5 py-1 text-[11px] font-medium text-accent">
          +{overflow} more
        </li>
      )}
    </ul>
  );
}

function OwnershipBadge({ ownership }: { ownership: Hospital['ownership'] }) {
  return (
    <span
      className={`inline-block rounded-[5px] px-2.5 py-1 text-[10px] font-semibold capitalize ${
        ownership === 'public' ? 'bg-emerald-50 text-emerald-700' : 'bg-sky-50 text-sky-700'
      }`}
    >
      {ownership}
    </span>
  );
}

function DataField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-medium uppercase tracking-[0.08em] text-soft/60">{label}</p>
      <p className="mt-0.5 text-[12px] font-medium text-ink">{value}</p>
    </div>
  );
}

function cardKeyHandler(e: React.KeyboardEvent, onSelect?: () => void) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    onSelect?.();
  }
}

export function HospitalCard({ hospital, rating, reviewCount, distanceKm, onSelect, compact = false }: HospitalCardProps) {
  const { name, city, lga, phone, specialties = [], ownership } = hospital;
  const ratingText = rating != null
    ? `${rating.toFixed(1)} ★${reviewCount ? ` (${reviewCount})` : ''}`
    : 'No reviews yet';

  const cardClass = 'group flex cursor-pointer flex-col rounded-[5px] border border-line bg-surface transition-all duration-200 hover:border-accent hover:shadow-[0_8px_32px_-8px_rgba(0,229,212,0.18)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent';

  if (compact) {
    return (
      <article
        role="article"
        tabIndex={0}
        aria-label={name}
        onClick={() => onSelect?.(hospital)}
        onKeyDown={(e) => cardKeyHandler(e, () => onSelect?.(hospital))}
        className={cardClass}
      >
        <div className="flex items-start justify-between gap-2 px-4 pt-4">
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-display text-[12px] leading-snug text-ink">
              {name.toUpperCase()}
            </h3>
            <p className="mt-0.5 flex items-center gap-1 text-[10px] text-soft">
              <FontAwesomeIcon icon={faLocationDot} className="shrink-0 text-[9px]" />
              <span className="truncate">{[lga, city].filter(Boolean).join(', ')}</span>
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            <OwnershipBadge ownership={ownership} />
            <button
              type="button"
              aria-label={`Download ${name} details`}
              onClick={(e) => { e.stopPropagation(); downloadHospital(hospital); }}
              className="rounded-[5px] border border-line p-1 text-soft transition-colors hover:border-accent hover:text-accent"
            >
              <FontAwesomeIcon icon={faDownload} className="text-[11px]" />
            </button>
          </div>
        </div>

        <div className="mx-4 mt-3 grid grid-cols-2 gap-x-4 gap-y-2 border-t border-line pt-3">
          <DataField label="City" value={city ?? '—'} />
          <DataField label="LGA" value={lga ?? '—'} />
          <DataField label="Phone" value={phone || '—'} />
          <DataField label="Rating" value={ratingText} />
        </div>

        <div className="mx-4 mt-2.5">
          <SpecialtyPills specialties={specialties} max={2} />
        </div>

        <div className="mx-4 mt-3 flex items-center justify-between border-t border-line py-3">
          {typeof distanceKm === 'number' ? (
            <span className="rounded-[5px] bg-tint px-2 py-0.5 text-[10px] font-semibold text-accent">
              {distanceKm.toFixed(1)} km
            </span>
          ) : <span />}
          <span className="text-[11px] font-medium text-soft transition-colors group-hover:text-accent">
            View
          </span>
        </div>
      </article>
    );
  }

  return (
    <article
      role="button"
      tabIndex={0}
      aria-label={name}
      onClick={() => onSelect?.(hospital)}
      onKeyDown={(e) => cardKeyHandler(e, () => onSelect?.(hospital))}
      className={cardClass}
    >
      <div className="flex items-start justify-between gap-3 px-5 pt-5">
        <div className="min-w-0">
          <h3 className="truncate font-display text-[13px] leading-snug text-ink">
            {name.toUpperCase()}
          </h3>
          <p className="mt-1 flex items-center gap-1.5 text-[11px] text-soft">
            <FontAwesomeIcon icon={faLocationDot} className="shrink-0 text-[10px]" />
            <span className="truncate">{[lga, city].filter(Boolean).join(', ')}</span>
          </p>
        </div>
        <button
          type="button"
          aria-label={`Download ${name} details`}
          onClick={(e) => { e.stopPropagation(); downloadHospital(hospital); }}
          className="shrink-0 rounded-[5px] border border-line p-1.5 text-soft transition-colors hover:border-accent hover:text-accent"
        >
          <FontAwesomeIcon icon={faDownload} className="text-[13px]" />
        </button>
      </div>

      <div className="px-5 pt-3">
        <OwnershipBadge ownership={ownership} />
      </div>

      <div className="mx-5 mt-4 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-line pt-4">
        <DataField label="City" value={city ?? '—'} />
        <DataField label="LGA" value={lga ?? '—'} />
        <DataField label="Phone" value={phone || '—'} />
        <DataField label="Rating" value={ratingText} />
      </div>

      <div className="mx-5 mt-4">
        <SpecialtyPills specialties={specialties} max={MAX_VISIBLE_SPECIALTIES} />
      </div>

      <div className="mx-5 mt-4 flex items-center justify-between border-t border-line py-4">
        {typeof distanceKm === 'number' ? (
          <span className="rounded-[5px] bg-tint px-2.5 py-1 text-[11px] font-semibold text-accent">
            {distanceKm.toFixed(1)} km
          </span>
        ) : <span />}
        <span className="text-[12px] font-medium text-soft transition-colors group-hover:text-accent">
          View Details
        </span>
      </div>
    </article>
  );
}
