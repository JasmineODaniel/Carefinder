import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Download,
  Share2,
  MapPin,
  ArrowRight,
  Shield,
  Clock,
  Globe,
  Star,
  Phone,
} from 'lucide-react';
import { PageLayout } from '../components/layout/PageLayout';

const STATS = [
  { value: '2,000+', label: 'Hospitals indexed' },
  { value: '36', label: 'States covered' },
  { value: '20+', label: 'Specialties' },
  { value: 'Free', label: 'No account needed' },
];

const STEPS = [
  {
    num: '01',
    title: 'Search',
    body: 'Type a hospital name, city, or LGA. Instant results, no login required.',
  },
  {
    num: '02',
    title: 'Filter',
    body: 'Narrow by specialty or ownership. Use geolocation to see hospitals within any radius.',
  },
  {
    num: '03',
    title: 'Export or share',
    body: 'Download a CSV with the columns you choose, or send a shareable link by email.',
  },
];

const SPECIALTIES = [
  'General Medicine',
  'Maternity & Obstetrics',
  'Pediatrics',
  'Cardiology',
  'Dental',
  'Oncology',
  'Ophthalmology',
  'Emergency',
  'Orthopedics',
  'Dermatology',
  'Psychiatry',
  'Radiology',
];

const FEATURES = [
  {
    icon: MapPin,
    title: 'Interactive Map',
    body: 'Every result pinned live on Mapbox. Click any marker for full contact details.',
  },
  {
    icon: Download,
    title: 'CSV Export',
    body: 'Download filtered results as CSV. Pick exactly which columns to include.',
  },
  {
    icon: Share2,
    title: 'Shareable Links',
    body: 'Each search generates a unique URL preserving all your filters.',
  },
  {
    icon: Shield,
    title: 'Verified Records',
    body: 'Admin-managed data with Supabase Row Level Security at the database layer.',
  },
  {
    icon: Clock,
    title: 'Visiting Hours',
    body: 'Each hospital profile shows visiting hours, phone, email, and full specialty info.',
  },
  {
    icon: Globe,
    title: 'Nationwide',
    body: 'All 36 states and the FCT covered — from Lagos Island to rural LGAs.',
  },
];

const PREVIEW_CARDS = [
  {
    name: 'Lagos University Teaching Hospital',
    location: 'Yaba, Lagos',
    distance: '2.1 km',
    rating: 4.8,
    reviews: 124,
    type: 'Public',
    specialties: ['General Medicine', 'Emergency', 'Pediatrics'],
  },
  {
    name: 'St. Nicholas Hospital',
    location: 'Lagos Island, Lagos',
    distance: '3.8 km',
    rating: 4.5,
    reviews: 86,
    type: 'Private',
    specialties: ['Cardiology', 'Oncology'],
  },
];

export function HomePage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    navigate(`/search${query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ''}`);
  }

  return (
    <PageLayout>
      <section className="border-b border-line bg-surface">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_420px] xl:grid-cols-[1fr_460px]">
            <div>
              <span className="inline-flex items-center gap-2 rounded-[5px] bg-tint px-3 py-1.5 text-[11px] font-semibold tracking-widest text-accent">
                <span className="inline-block size-1.5 rounded-[2px] bg-accent" />
                NIGERIA&apos;S HOSPITAL DIRECTORY
              </span>

              <h1 className="mt-5 font-display text-[46px] leading-[1.03] tracking-tight text-ink md:text-[58px] lg:text-[66px]">
                FIND THE<br />RIGHT HOSPITAL.
              </h1>

              <p className="mt-5 max-w-md text-[16px] leading-relaxed text-soft">
                Search verified hospitals across Nigeria by specialty, city, or proximity. Export or share your results in one click.
              </p>

              <form
                onSubmit={handleSearch}
                className="mt-8 flex max-w-xl items-center gap-2 rounded-[5px] border border-line bg-surface p-2 shadow-[0_4px_24px_-4px_rgba(11,11,16,0.08)] transition-all duration-200 focus-within:border-accent focus-within:shadow-[0_4px_24px_-4px_rgba(45,91,255,0.16)]"
              >
                <Search className="ml-3 size-5 shrink-0 text-soft" strokeWidth={2} />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Hospital name, city, or LGA…"
                  className="min-w-0 flex-1 bg-transparent text-[15px] text-ink placeholder:text-soft focus:outline-none"
                />
                <button
                  type="submit"
                  className="rounded-[5px] bg-accent px-5 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-accent-hover"
                >
                  Search
                </button>
              </form>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => navigate('/search')}
                  className="rounded-[5px] bg-accent px-5 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-accent-hover"
                >
                  Browse all hospitals
                </button>
                <button
                  onClick={() => navigate('/search?view=map')}
                  className="inline-flex items-center gap-2 rounded-[5px] border border-line bg-surface px-5 py-2.5 text-[14px] font-medium text-ink transition-colors hover:bg-muted"
                >
                  <MapPin className="size-4" strokeWidth={2} />
                  Open map
                </button>
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute -inset-4 rounded-[5px] bg-gradient-to-br from-tint to-accent/10" />
                <div className="relative flex flex-col gap-3">
                  {PREVIEW_CARDS.map((card, i) => (
                    <div
                      key={card.name}
                      style={{ marginLeft: i === 1 ? '24px' : 0 }}
                      className="rounded-[5px] border border-line bg-surface p-4 shadow-[0_8px_32px_-8px_rgba(11,11,16,0.12)]"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate font-display text-[12px] text-ink">{card.name.toUpperCase()}</p>
                          <p className="mt-0.5 flex items-center gap-1 text-[11px] text-soft">
                            <MapPin className="size-3 shrink-0" strokeWidth={2} />
                            {card.location} &middot; {card.distance}
                          </p>
                        </div>
                        <span
                          className={`shrink-0 rounded-[5px] px-2 py-0.5 text-[10px] font-semibold ${
                            card.type === 'Public'
                              ? 'bg-tint text-accent'
                              : 'bg-muted text-soft'
                          }`}
                        >
                          {card.type}
                        </span>
                      </div>
                      <div className="mt-2.5 flex flex-wrap gap-1">
                        {card.specialties.map((s) => (
                          <span
                            key={s}
                            className="rounded-[5px] bg-muted px-2 py-0.5 text-[10px] font-medium text-soft"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                      <div className="mt-2.5 flex items-center gap-3 border-t border-line pt-2.5">
                        <span className="flex items-center gap-1 text-[11px]">
                          <Star className="size-3 fill-accent text-accent" strokeWidth={2} />
                          <span className="font-semibold text-ink">{card.rating}</span>
                          <span className="text-soft">({card.reviews})</span>
                        </span>
                        <span className="flex items-center gap-1 text-[11px] text-soft">
                          <Phone className="size-3" strokeWidth={2} />
                          080 0000 0000
                        </span>
                      </div>
                    </div>
                  ))}

                  <div className="mt-1 flex items-center justify-center">
                    <span className="rounded-[5px] bg-accent/8 px-3 py-1.5 text-[11px] font-semibold text-accent">
                      2,000+ hospitals across Nigeria
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-canvas">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <div className="grid grid-cols-2 divide-x divide-line sm:grid-cols-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="px-6 py-2 first:pl-0 last:pr-0">
                <p className="font-display text-[28px] text-ink">{stat.value}</p>
                <p className="mt-0.5 text-[12px] text-soft">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="scroll-mt-6 border-b border-line bg-surface">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <p className="font-display text-[10px] tracking-[0.2em] text-accent">HOW IT WORKS</p>
          <h2 className="mt-3 font-display text-[24px] leading-tight text-ink md:text-[30px]">
            THREE STEPS TO THE RIGHT CARE.
          </h2>
          <div className="mt-12 grid gap-10 sm:grid-cols-3">
            {STEPS.map((step) => (
              <div key={step.num} className="flex flex-col gap-3">
                <span className="font-display text-[44px] leading-none text-line">{step.num}</span>
                <div className="h-px w-8 bg-accent" />
                <h3 className="font-display text-[12px] tracking-[0.15em] text-ink">{step.title.toUpperCase()}</h3>
                <p className="text-[14px] leading-relaxed text-soft">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-canvas">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <p className="font-display text-[10px] tracking-[0.2em] text-accent">BROWSE BY SPECIALTY</p>
          <div className="mt-3 flex items-end justify-between gap-4">
            <h2 className="font-display text-[24px] leading-tight text-ink md:text-[30px]">
              FIND EXACTLY WHAT YOU NEED.
            </h2>
            <button
              onClick={() => navigate('/search')}
              className="hidden shrink-0 items-center gap-1.5 rounded-[5px] border border-line bg-surface px-4 py-2 text-[13px] font-medium text-ink transition-colors hover:bg-muted sm:flex"
            >
              View all
              <ArrowRight className="size-3.5" strokeWidth={2} />
            </button>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4">
            {SPECIALTIES.map((specialty) => (
              <button
                key={specialty}
                onClick={() => navigate(`/search?specialty=${encodeURIComponent(specialty)}`)}
                className="flex items-center justify-between rounded-[5px] border border-line bg-surface px-4 py-3 text-left text-[13px] font-medium text-ink transition-all hover:border-accent hover:bg-tint hover:text-accent hover:shadow-[0_2px_12px_-4px_rgba(45,91,255,0.20)]"
              >
                <span>{specialty}</span>
                <ArrowRight className="size-3.5 shrink-0 text-line transition-colors group-hover:text-accent" strokeWidth={2} />
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-surface">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <p className="font-display text-[10px] tracking-[0.2em] text-accent">FEATURES</p>
          <h2 className="mt-3 font-display text-[24px] leading-tight text-ink md:text-[30px]">
            BUILT FOR REAL USE.
          </h2>
          <div className="mt-10 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="flex flex-col gap-4 bg-surface p-6 transition-colors hover:bg-canvas"
              >
                <span className="grid size-9 place-items-center rounded-[5px] bg-tint text-accent">
                  <feature.icon className="size-[18px]" strokeWidth={2} />
                </span>
                <h3 className="font-display text-[12px] tracking-[0.12em] text-ink">{feature.title.toUpperCase()}</h3>
                <p className="text-[14px] leading-relaxed text-soft">{feature.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-accent">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="font-display text-[24px] leading-tight text-white md:text-[32px]">
                START FINDING HOSPITALS NOW.
              </h2>
              <p className="mt-3 text-[15px] text-white/70">No account required. Free for everyone in Nigeria.</p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-3">
              <button
                onClick={() => navigate('/search')}
                className="rounded-[5px] bg-white px-6 py-3 text-[14px] font-semibold text-accent transition-colors hover:bg-tint"
              >
                Find a hospital
              </button>
              <button
                onClick={() => navigate('/search?view=map')}
                className="rounded-[5px] border border-white/25 px-6 py-3 text-[14px] font-semibold text-white transition-colors hover:border-white/50 hover:bg-white/10"
              >
                Open the map
              </button>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
