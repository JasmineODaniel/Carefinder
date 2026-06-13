import { useMemo, useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLocationDot,
  faMagnifyingGlass,
  faTableColumns,
  faList,
  faDownload,
  faShareNodes,
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import { PageLayout } from '../components/layout/PageLayout';
import { HospitalCard } from '../features/hospitals/HospitalCard';
import { FilterBar } from '../features/hospitals/FilterBar';
import { HospitalMap } from '../features/map/HospitalMap';
import { ExportModal } from '../features/export/ExportModal';
import { ShareModal } from '../features/share/ShareModal';
import { useHospitals } from '../features/hospitals/useHospitals';
import { useNearbyHospitals, type HospitalWithDistance } from '../features/hospitals/useNearbyHospitals';

type Ownership = 'all' | 'public' | 'private';
type ViewMode = 'list' | 'map' | 'split';

const PAGE_SIZE = 12;

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [query, setQuery] = useState(searchParams.get('q') ?? '');
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>(
    searchParams.getAll('specialty'),
  );
  const [ownership, setOwnership] = useState<Ownership>(
    (searchParams.get('ownership') as Ownership) ?? 'all',
  );
  const [nearMe, setNearMe] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [radiusKm, setRadiusKm] = useState(Number(searchParams.get('radius') ?? 10));
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>(
    (searchParams.get('view') as ViewMode) ?? 'split',
  );
  const [showExport, setShowExport] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [page, setPage] = useState(1);

  const { hospitals, loading: hospitalsLoading, error: hospitalsError } = useHospitals();
  const usingRadius = nearMe && !!coords;
  const nearby = useNearbyHospitals(usingRadius ? coords : null, usingRadius ? radiusKm : null);

  const base = usingRadius ? nearby.data : hospitals;
  const loading = usingRadius ? nearby.loading : hospitalsLoading;
  const error = usingRadius ? nearby.error : hospitalsError;

  const allSpecialties = useMemo(() => {
    const set = new Set<string>();
    hospitals.forEach((h) => h.specialties?.forEach((s) => set.add(s)));
    return [...set].sort();
  }, [hospitals]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return base.filter((h) => {
      const matchesText =
        !q || [h.name, h.city, h.lga].filter(Boolean).some((f) => f!.toLowerCase().includes(q));
      const matchesOwnership = ownership === 'all' || h.ownership === ownership;
      const matchesSpecialty =
        selectedSpecialties.length === 0 ||
        selectedSpecialties.some((s) => h.specialties?.includes(s));
      return matchesText && matchesOwnership && matchesSpecialty;
    });
  }, [base, query, ownership, selectedSpecialties]);

  const totalPages = Math.ceil(results.length / PAGE_SIZE);
  const pageResults = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [query, ownership, selectedSpecialties, nearMe, radiusKm]);

  useEffect(() => {
    const params: Record<string, string | string[]> = {};
    if (query) params.q = query;
    if (ownership !== 'all') params.ownership = ownership;
    if (selectedSpecialties.length) params.specialty = selectedSpecialties;
    if (nearMe) params.radius = String(radiusKm);
    if (viewMode !== 'split') params.view = viewMode;
    setSearchParams(params as Record<string, string>, { replace: true });
  }, [query, ownership, selectedSpecialties, nearMe, radiusKm, viewMode]);

  const hasActiveFilters =
    query.trim() !== '' || ownership !== 'all' || selectedSpecialties.length > 0 || nearMe;

  function toggleSpecialty(s: string) {
    setSelectedSpecialties((prev) => (prev.includes(s) ? [] : [s]));
  }

  function toggleNearMe() {
    if (nearMe) {
      setNearMe(false);
      return;
    }
    if (coords) {
      setNearMe(true);
      return;
    }
    if (!('geolocation' in navigator)) {
      setLocationError("Geolocation isn't supported on this device.");
      return;
    }
    setLocating(true);
    setLocationError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setNearMe(true);
        setLocating(false);
      },
      () => {
        setLocationError("Couldn't get your location. Check browser permissions and try again.");
        setLocating(false);
      },
      { enableHighAccuracy: false, timeout: 10000 },
    );
  }

  function clearFilters() {
    setQuery('');
    setOwnership('all');
    setSelectedSpecialties([]);
    setNearMe(false);
  }

  const showMap = viewMode === 'map' || viewMode === 'split';
  const showList = viewMode === 'list' || viewMode === 'split';

  return (
    <PageLayout>
      <div className="border-b border-line bg-surface px-6 py-4">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center gap-3">
            <div className="flex w-full max-w-[260px] items-center gap-2 rounded-[5px] border border-line bg-canvas px-3 py-2.5 transition-colors focus-within:border-accent">
              <FontAwesomeIcon icon={faLocationDot} className="shrink-0 text-[14px] text-soft" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search hospital name"
                aria-label="Search hospitals"
                className="min-w-0 flex-1 bg-transparent text-[13px] text-ink placeholder:text-soft focus:outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="rounded-[5px] px-1.5 py-0.5 text-[11px] text-soft transition-colors hover:bg-muted hover:text-ink"
                >
                  Clear
                </button>
              )}
              <FontAwesomeIcon icon={faMagnifyingGlass} className="shrink-0 text-[13px] text-soft" />
            </div>

            <div className="flex flex-1 items-center justify-end gap-2">
              <div className="hidden items-center rounded-[5px] border border-line bg-canvas sm:inline-flex">
                {(
                  [
                    { mode: 'split' as ViewMode, icon: faTableColumns, label: 'Split view' },
                    { mode: 'list' as ViewMode, icon: faList, label: 'List view' },
                    { mode: 'map' as ViewMode, icon: faLocationDot, label: 'Map view' },
                  ] as const
                ).map(({ mode, icon, label }) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setViewMode(mode)}
                    title={label}
                    aria-label={label}
                    className={`rounded-[5px] px-3 py-2.5 text-[13px] transition-colors ${
                      viewMode === mode ? 'bg-accent text-white' : 'text-soft hover:text-ink'
                    }`}
                  >
                    <FontAwesomeIcon icon={icon} />
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setShowExport(true)}
                title="Export CSV"
                aria-label="Export CSV"
                className="rounded-[5px] border border-line bg-canvas px-3 py-2.5 text-[13px] text-ink transition-colors hover:bg-muted"
              >
                <FontAwesomeIcon icon={faDownload} />
              </button>
              <button
                type="button"
                onClick={() => setShowShare(true)}
                title="Share"
                aria-label="Share"
                className="rounded-[5px] bg-accent px-3 py-2.5 text-[13px] text-white transition-colors hover:bg-accent-hover"
              >
                <FontAwesomeIcon icon={faShareNodes} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-4">
        <FilterBar
          specialties={allSpecialties}
          selectedSpecialties={selectedSpecialties}
          onToggleSpecialty={toggleSpecialty}
          ownership={ownership}
          onOwnershipChange={setOwnership}
          nearMe={nearMe}
          onToggleNearMe={toggleNearMe}
          locating={locating}
          locationError={locationError}
          radiusKm={radiusKm}
          onRadiusChange={setRadiusKm}
          hasActiveFilters={hasActiveFilters}
          onClear={clearFilters}
        />
      </div>

      <div
        className={`mx-auto max-w-6xl px-6 pb-12 ${
          viewMode === 'split' ? 'grid gap-6 lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_460px]' : ''
        }`}
      >
        {showList && (
          <div>
            <p className="mb-4 text-[12px] text-soft">
              {loading ? (
                'Loading…'
              ) : (
                <>
                  <span className="font-semibold text-ink">{results.length}</span>{' '}
                  {results.length === 1 ? 'hospital' : 'hospitals'}
                  {usingRadius && <> within {radiusKm} km</>}
                  {query && <> matching &ldquo;{query}&rdquo;</>}
                </>
              )}
            </p>

            {error && (
              <div
                role="alert"
                className="rounded-[5px] border border-error-border bg-error-bg p-5 text-[14px] text-error"
              >
                Couldn&apos;t load hospitals. {error}
              </div>
            )}

            {!error && (
              <>
                {loading ? (
                  <SkeletonGrid split={viewMode === 'split'} />
                ) : results.length === 0 ? (
                  <div className="rounded-[5px] border border-dashed border-line p-12 text-center">
                    <p className="font-display text-[14px] text-ink">NO HOSPITALS FOUND</p>
                    <p className="mt-1 text-[13px] text-soft">Try widening your filters or radius.</p>
                  </div>
                ) : (
                  <>
                    <div
                      className={`grid grid-cols-1 gap-3 ${
                        viewMode === 'split' ? '' : 'sm:grid-cols-2 lg:grid-cols-3'
                      }`}
                    >
                      {pageResults.map((h) => (
                        <HospitalCard
                          key={h.id}
                          hospital={h}
                          distanceKm={
                            usingRadius ? (h as HospitalWithDistance).distance_km : undefined
                          }
                          onSelect={(hospital) => navigate(`/hospitals/${hospital.id}`)}
                          compact={viewMode === 'split'}
                        />
                      ))}
                    </div>

                    {totalPages > 1 && (
                      <div className="mt-6 flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => setPage((p) => Math.max(1, p - 1))}
                          disabled={page === 1}
                          className="rounded-[5px] border border-line px-3 py-2 text-[12px] text-soft transition-colors hover:border-accent hover:text-accent disabled:opacity-30"
                        >
                          <FontAwesomeIcon icon={faChevronLeft} />
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                          .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                          .reduce<(number | 'ellipsis')[]>((acc, p, idx, arr) => {
                            if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push('ellipsis');
                            acc.push(p);
                            return acc;
                          }, [])
                          .map((p, idx) =>
                            p === 'ellipsis' ? (
                              <span key={`ellipsis-${idx}`} className="px-1 text-[12px] text-soft">…</span>
                            ) : (
                              <button
                                key={p}
                                type="button"
                                onClick={() => setPage(p as number)}
                                className={`rounded-[5px] px-3 py-2 text-[12px] font-medium transition-colors ${
                                  page === p
                                    ? 'bg-accent text-white'
                                    : 'border border-line text-soft hover:border-accent hover:text-accent'
                                }`}
                              >
                                {p}
                              </button>
                            ),
                          )}

                        <button
                          type="button"
                          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                          disabled={page === totalPages}
                          className="rounded-[5px] border border-line px-3 py-2 text-[12px] text-soft transition-colors hover:border-accent hover:text-accent disabled:opacity-30"
                        >
                          <FontAwesomeIcon icon={faChevronRight} />
                        </button>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        )}

        {showMap && (
          <div className={viewMode === 'split' ? 'hidden lg:block' : ''}>
            <HospitalMap
              hospitals={results}
              center={coords}
              onSelect={(h) => navigate(`/hospitals/${h.id}`)}
            />
          </div>
        )}
      </div>

      <ExportModal
        open={showExport}
        onClose={() => setShowExport(false)}
        hospitals={results}
        query={query}
      />
      <ShareModal
        open={showShare}
        onClose={() => setShowShare(false)}
        hospitals={results}
      />
    </PageLayout>
  );
}

function SkeletonGrid({ split }: { split: boolean }) {
  return (
    <div
      className={`grid grid-cols-1 gap-3 ${split ? '' : 'sm:grid-cols-2 lg:grid-cols-3'}`}
    >
      {Array.from({ length: split ? 4 : 6 }).map((_, i) => (
        <div key={i} className="h-[160px] animate-pulse rounded-[5px] border border-line bg-muted" />
      ))}
    </div>
  );
}
