import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationArrow, faSpinner } from '@fortawesome/free-solid-svg-icons';

type Ownership = 'all' | 'public' | 'private';

interface FilterBarProps {
  specialties: string[];
  selectedSpecialties: string[];
  onToggleSpecialty: (specialty: string) => void;
  ownership: Ownership;
  onOwnershipChange: (ownership: Ownership) => void;
  nearMe: boolean;
  onToggleNearMe: () => void;
  locating: boolean;
  locationError: string | null;
  radiusKm: number;
  onRadiusChange: (km: number) => void;
  hasActiveFilters: boolean;
  onClear: () => void;
}

const OWNERSHIP_OPTIONS: { value: Ownership; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'public', label: 'Public' },
  { value: 'private', label: 'Private' },
];

const RADII = [5, 10, 25, 50];

export function FilterBar({
  specialties,
  selectedSpecialties,
  onToggleSpecialty,
  ownership,
  onOwnershipChange,
  nearMe,
  onToggleNearMe,
  locating,
  locationError,
  radiusKm,
  onRadiusChange,
  hasActiveFilters,
  onClear,
}: FilterBarProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="inline-flex rounded-[5px] bg-muted p-1">
          {OWNERSHIP_OPTIONS.map((opt) => {
            const active = ownership === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onOwnershipChange(opt.value)}
                className={`rounded-[5px] px-4 py-1.5 text-[13px] font-medium transition-colors ${
                  active ? 'bg-surface text-ink shadow-sm' : 'text-soft hover:text-ink'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={onToggleNearMe}
          disabled={locating}
          className={`inline-flex items-center gap-2 rounded-[5px] px-4 py-2 text-[13px] font-medium transition-colors disabled:opacity-70 ${
            nearMe
              ? 'bg-accent text-white hover:bg-accent-hover'
              : 'border border-line bg-surface text-ink hover:bg-muted'
          }`}
        >
          <FontAwesomeIcon
            icon={locating ? faSpinner : faLocationArrow}
            className={`text-[13px]${locating ? ' animate-spin' : ''}`}
          />
          {locating ? 'Locating…' : 'Near me'}
        </button>

        {nearMe && (
          <label className="inline-flex items-center gap-2 rounded-[5px] border border-line bg-surface px-4 py-2 text-[13px] text-soft">
            Within
            <select
              value={radiusKm}
              onChange={(e) => onRadiusChange(Number(e.target.value))}
              className="bg-transparent font-medium text-ink focus:outline-none"
            >
              {RADII.map((km) => (
                <option key={km} value={km}>
                  {km} km
                </option>
              ))}
            </select>
          </label>
        )}

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClear}
            className="ml-auto text-[13px] font-medium text-soft underline-offset-4 hover:text-ink hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

      {specialties.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {specialties.map((s) => {
            const active = selectedSpecialties.includes(s);
            return (
              <button
                key={s}
                type="button"
                onClick={() => onToggleSpecialty(s)}
                className={`rounded-[5px] px-3.5 py-1.5 text-[12px] font-medium capitalize transition-colors ${
                  active ? 'bg-accent text-white' : 'bg-muted text-soft hover:text-ink'
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>
      )}

      {locationError && (
        <p role="alert" className="text-[12px] text-error">
          {locationError}
        </p>
      )}
    </div>
  );
}
