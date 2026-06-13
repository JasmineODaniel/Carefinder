import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMagnifyingGlass,
  faLocationDot,
  faDownload,
  faShareNodes,
  faShield,
  faClock,
  faGlobe,
} from '@fortawesome/free-solid-svg-icons';
import { PageLayout } from '../components/layout/PageLayout';

const STATS = [
  { value: '2,000+', label: 'Hospitals indexed' },
  { value: '36',     label: 'States covered' },
  { value: '20+',    label: 'Specialties' },
  { value: 'Free',   label: 'No account needed' },
];

const STEPS = [
  { num: '01', title: 'Search',         body: 'Type a hospital name, city, or LGA. Instant results, no login required.' },
  { num: '02', title: 'Filter',         body: 'Narrow by specialty or ownership. Use geolocation to see hospitals within any radius.' },
  { num: '03', title: 'Export or share', body: 'Download a CSV with the columns you choose, or send a shareable link by email.' },
];

const SPECIALTIES = [
  'General Medicine', 'Maternity & Obstetrics', 'Pediatrics', 'Cardiology',
  'Dental', 'Oncology', 'Ophthalmology', 'Emergency',
  'Orthopedics', 'Dermatology', 'Psychiatry', 'Radiology',
];

const SPECIALTY_BUBBLES: { name: string; size: number; cx: number; cy: number; variant: 'accent' | 'dark' | 'outline' }[] = [
  { name: 'Emergency',        size: 86,  cx: 351, cy: 209, variant: 'accent'  },
  { name: 'Cardiology',       size: 92,  cx: 183, cy: 254, variant: 'dark'    },
  { name: 'Dental',           size: 80,  cx: 322, cy: 371, variant: 'outline' },
  { name: 'General Medicine', size: 110, cx: 459, cy: 232, variant: 'outline' },
  { name: 'Dermatology',      size: 102, cx: 248, cy: 98,  variant: 'accent'  },
  { name: 'Maternity',        size: 104, cx: 112, cy: 358, variant: 'dark'    },
  { name: 'Pediatrics',       size: 98,  cx: 432, cy: 386, variant: 'outline' },
  { name: 'Ophthalmology',    size: 94,  cx: 570, cy: 280, variant: 'dark'    },
  { name: 'Oncology',         size: 88,  cx: 485, cy: 75,  variant: 'accent'  },
  { name: 'Orthopedics',      size: 86,  cx: 75,  cy: 75,  variant: 'outline' },
  { name: 'Psychiatry',       size: 82,  cx: 75,  cy: 485, variant: 'dark'    },
  { name: 'Radiology',        size: 88,  cx: 485, cy: 485, variant: 'outline' },
];

const FEATURES = [
  { icon: faLocationDot, title: 'Interactive Map',  body: 'Every result pinned live on Mapbox. Click any marker for full contact details.' },
  { icon: faDownload,    title: 'CSV Export',       body: 'Download filtered results as CSV. Pick exactly which columns to include.' },
  { icon: faShareNodes,  title: 'Shareable Links',  body: 'Each search generates a unique URL preserving all your filters.' },
  { icon: faShield,      title: 'Verified Records', body: 'Admin-managed data with Supabase Row Level Security at the database layer.' },
  { icon: faClock,       title: 'Visiting Hours',   body: 'Each hospital profile shows visiting hours, phone, email, and full specialty info.' },
  { icon: faGlobe,       title: 'Nationwide',        body: 'All 36 states and the FCT covered — from Lagos Island to rural LGAs.' },
];

export function HomePage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  function handleSearch(e: { preventDefault(): void }) {
    e.preventDefault();
    navigate(`/search${query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ''}`);
  }

  return (
    <PageLayout>

      <section className="relative min-h-[calc(100vh-56px)] overflow-hidden bg-canvas">

        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(var(--color-line) 1px, transparent 1px), linear-gradient(to right, var(--color-line) 1px, transparent 1px)`,
            backgroundSize: '68px 68px',
          }}
        />

        {[
          { top: 68,  left: 68  },
          { top: 204, left: 136 },
          { top: 68,  right: 136 },
          { top: 340, right: 68 },
          { bottom: 144, left: 68 },
        ].map((pos, i) => (
          <div key={i} className="pointer-events-none absolute hidden lg:block" style={pos}>
            <div className="size-17 overflow-hidden rounded-[5px] shadow-[0_4px_24px_rgba(0,0,0,0.14)] ring-1 ring-accent/40">
              <img
                src={`/assets/hop${i + 1}.jpg`}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover"
                style={{ filter: 'brightness(0.8) grayscale(0.2)' }}
              />
            </div>
          </div>
        ))}

        <div
          className="pointer-events-none absolute hidden size-4.5 rounded-full bg-accent shadow-lg shadow-accent/40 lg:block"
          style={{ bottom: 144, right: 68 }}
        />

        <div className="relative z-10 flex justify-center px-6 pt-5">
          <span className="inline-flex items-center gap-2 rounded-[5px] border border-line bg-surface px-3 py-1.5 text-[10px] font-semibold tracking-[0.18em] text-soft shadow-sm">
            <span className="size-1.5 rounded-full bg-accent" />
            ONLY 36 STATES AVAILABLE
          </span>
        </div>

        <div
          className="relative z-10 flex flex-col items-center justify-center px-6 text-center"
          style={{ minHeight: 'calc(100vh - 56px - 80px)', paddingTop: '4rem' }}
        >
          <h1 className="font-display max-w-xl text-[40px] leading-[1.07] tracking-tight text-ink md:text-[54px]">
            We help you <span className="relative -top-1.5 inline-block rounded-[5px] bg-accent px-3 py-1 text-[20px] italic text-black md:text-[27px]">find</span><br />
            verified <span className="relative -top-1.5 inline-block rounded-[5px] bg-accent px-3 py-1 text-[20px] italic text-black md:text-[27px]">hospitals</span><br />
            anywhere in Nigeria.
          </h1>

          <p className="mt-5 max-w-sm text-[14px] leading-relaxed text-soft">
            Search 2,000+ hospitals across all 36 states — filter by specialty, proximity, or ownership type. Free and open to everyone.
          </p>

          <form onSubmit={handleSearch} className="mt-7 w-full max-w-110">
            <div className="relative">
              <button
                type="submit"
                aria-label="Search"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-dim transition hover:text-ink"
              >
                <FontAwesomeIcon icon={faMagnifyingGlass} className="text-[14px]" />
              </button>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Hospital name, city or LGA…"
                aria-label="Search hospitals"
                className="w-full rounded-[5px] border border-accent bg-surface py-3 pl-9 pr-4 text-[13px] text-ink shadow-sm outline-none placeholder:text-dim transition focus:border-accent"
              />
            </div>
          </form>

          <div className="mt-3 flex flex-wrap justify-center gap-1.5">
            {['Open access', 'Privacy first', 'Works on mobile', 'Lightning fast'].map((label) => (
              <span
                key={label}
                className="rounded-[5px] border border-accent/25 bg-accent/10 px-3 py-1 text-[11px] font-medium text-accent"
              >
                {label}
              </span>
            ))}
          </div>
        </div>

        <div className="relative z-10 border-t border-line bg-surface/80 backdrop-blur-sm">
          <div className="mx-auto grid max-w-5xl grid-cols-2 divide-x divide-line sm:grid-cols-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="px-6 py-5 text-center">
                <p className="font-display text-[22px] font-black text-ink">{stat.value}</p>
                <p className="mt-0.5 text-[11px] font-medium text-dim">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="scroll-mt-6 border-b border-road-border bg-road">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <p className="font-display text-[10px] tracking-[0.2em] text-accent">HOW IT WORKS</p>
          <h2 className="mt-3 font-display text-[24px] leading-tight text-white md:text-[30px]">
            THREE STEPS TO THE RIGHT CARE.
          </h2>

          <div className="relative mt-12 hidden md:block" style={{ height: '460px' }}>
            <svg className="absolute inset-0 w-full" style={{ height: '380px' }} viewBox="0 0 1200 380" preserveAspectRatio="xMidYMid meet">
              <path d="M 0,110 L 140,110 C 230,110 280,185 330,235 C 390,295 440,305 540,305 L 660,305 C 760,305 810,235 860,185 C 910,140 960,110 1060,110 L 1200,110"
                fill="none" style={{ stroke: 'var(--color-panel-border)' }} strokeWidth="44" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M 0,110 L 140,110 C 230,110 280,185 330,235 C 390,295 440,305 540,305 L 660,305 C 760,305 810,235 860,185 C 910,140 960,110 1060,110 L 1200,110"
                fill="none" style={{ stroke: 'var(--color-panel)' }} strokeWidth="30" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M 0,110 L 140,110 C 230,110 280,185 330,235 C 390,295 440,305 540,305 L 660,305 C 760,305 810,235 860,185 C 910,140 960,110 1060,110 L 1200,110"
                fill="none" style={{ stroke: 'var(--color-accent)' }} strokeWidth="1.5" strokeLinecap="round" strokeDasharray="18 14" />
              <circle cx="200" cy="110" r="20" style={{ fill: 'var(--color-accent)' }} /><circle cx="200" cy="110" r="9" style={{ fill: 'var(--color-panel)' }} />
              <circle cx="600" cy="305" r="20" style={{ fill: 'var(--color-accent)' }} /><circle cx="600" cy="305" r="9" style={{ fill: 'var(--color-panel)' }} />
              <circle cx="1000" cy="110" r="20" style={{ fill: 'var(--color-accent)' }} /><circle cx="1000" cy="110" r="9" style={{ fill: 'var(--color-panel)' }} />
            </svg>
            <div className="absolute" style={{ left: '8%', top: 0, maxWidth: '190px' }}>
              <p className="font-display text-[9px] tracking-widest text-accent">STEP 01</p>
              <h3 className="mt-1 font-display text-[28px] text-white">SEARCH</h3>
              <p className="mt-1.5 text-[12px] leading-relaxed text-white/40">Hospital name, city, or LGA. Instant results.</p>
            </div>
            <div className="absolute text-center" style={{ left: '50%', transform: 'translateX(-50%)', top: '318px', maxWidth: '210px' }}>
              <p className="font-display text-[9px] tracking-widest text-accent">STEP 02</p>
              <h3 className="mt-1 font-display text-[28px] text-white">FILTER</h3>
              <p className="mt-1.5 text-[12px] leading-relaxed text-white/40">Filter by specialty, ownership, or geolocation radius.</p>
            </div>
            <div className="absolute text-right" style={{ right: '4%', top: 0, maxWidth: '190px' }}>
              <p className="font-display text-[9px] tracking-widest text-accent">STEP 03</p>
              <h3 className="mt-1 font-display text-[28px] text-white">EXPORT</h3>
              <p className="mt-1.5 text-[12px] leading-relaxed text-white/40">Download CSV or share a link by email.</p>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-0 md:hidden">
            {STEPS.map((step, i, arr) => (
              <div key={step.num} className="flex gap-5">
                <div className="flex flex-col items-center">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-[5px] bg-accent">
                    <span className="font-display text-[10px] text-black">{step.num}</span>
                  </div>
                  {i < arr.length - 1 && <div className="mt-2 w-0.5 flex-1 bg-panel-border" />}
                </div>
                <div className="pb-10 pt-1">
                  <p className="font-display text-[22px] text-white">{step.title.toUpperCase()}</p>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-white/40">{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative min-h-140 overflow-hidden border-b border-line bg-canvas">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
          <div className="max-w-75">
            <p className="font-display text-[10px] tracking-[0.2em] text-accent">BROWSE BY SPECIALTY</p>
            <h2 className="mt-3 font-display text-[28px] leading-[1.1] text-ink md:text-[36px]">
              FIND EXACTLY<br />WHAT YOU<br />NEED.
            </h2>
            <p className="mt-5 text-[14px] leading-relaxed text-soft">
              From routine checkups to specialist care — search by the exact treatment you need.
            </p>

            <div className="mt-6 flex flex-wrap gap-2 lg:hidden">
              {SPECIALTIES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => navigate(`/search?specialty=${encodeURIComponent(s)}`)}
                  className="rounded-full border border-line bg-surface px-4 py-2 text-[12px] text-soft transition hover:border-accent hover:text-accent"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute right-0 top-0 hidden lg:block" style={{ width: 560, height: 560 }}>
          <svg width="560" height="560" style={{ position: 'absolute', inset: 0 }} aria-hidden="true">
            <circle cx="280" cy="280" r="100"  fill="none" style={{ stroke: 'var(--color-dim)' }} strokeWidth="1.5" strokeDasharray="2 3" />
            <circle cx="280" cy="280" r="185"  fill="none" style={{ stroke: 'var(--color-dim)' }} strokeWidth="1.5" strokeDasharray="2 3" />
            <circle cx="280" cy="280" r="290"  fill="none" style={{ stroke: 'var(--color-dim)' }} strokeWidth="1.5" strokeDasharray="2 3" />
            <circle cx="280" cy="280" r="410"  fill="none" style={{ stroke: 'var(--color-dim)' }} strokeWidth="1"   strokeDasharray="2 3" />
            <circle cx="280" cy="280" r="7"    style={{ fill: 'var(--color-accent)' }} />
            <circle cx="280" cy="280" r="3"    fill="white" />
            <circle cx="380" cy="280" r="4"    style={{ fill: 'var(--color-accent)' }} />
            <circle cx="280" cy="180" r="4"    style={{ fill: 'var(--color-accent)' }} />
            <circle cx="440" cy="187" r="3.5"  style={{ fill: 'var(--color-accent)' }} />
            <circle cx="95"  cy="280" r="3"    style={{ fill: 'var(--color-dim)' }} />
            <circle cx="280" cy="465" r="3"    style={{ fill: 'var(--color-dim)' }} />
          </svg>

          {SPECIALTY_BUBBLES.map((b) => (
            <button
              key={b.name}
              type="button"
              onClick={() => navigate(`/search?specialty=${encodeURIComponent(b.name)}`)}
              className={`absolute flex items-center justify-center rounded-full text-center font-medium leading-tight transition hover:scale-105 ${
                b.variant === 'accent'
                  ? 'bg-accent text-black shadow-lg shadow-accent/20'
                  : b.variant === 'dark'
                  ? 'bg-panel text-white shadow-md'
                  : 'border-2 border-line bg-surface text-ink shadow-sm'
              }`}
              style={{
                width: b.size,
                height: b.size,
                top: b.cy,
                left: b.cx,
                transform: 'translate(-50%, -50%)',
                fontSize: b.size >= 100 ? 12 : 11,
                padding: 12,
              }}
            >
              {b.name}
            </button>
          ))}
        </div>
      </section>

      <section className="border-b border-road-border bg-road">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <p className="font-display text-[10px] tracking-[0.2em] text-accent">FEATURES</p>
          <h2 className="mt-3 font-display text-[24px] leading-tight text-white md:text-[30px]">
            BUILT FOR REAL USE.
          </h2>
          <div className="mt-10 grid gap-px border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="flex flex-col gap-4 bg-black/30 p-6 backdrop-blur-sm transition-colors hover:bg-black/20"
              >
                <span className="grid size-9 place-items-center rounded-[5px] bg-accent/20 text-accent">
                  <FontAwesomeIcon icon={feature.icon} className="text-[18px]" />
                </span>
                <h3 className="font-display text-[12px] tracking-[0.12em] text-white">
                  {feature.title.toUpperCase()}
                </h3>
                <p className="text-[14px] leading-relaxed text-white/60">{feature.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-accent">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="font-display text-[24px] leading-tight text-black md:text-[32px]">
                START FINDING HOSPITALS NOW.
              </h2>
              <p className="mt-3 text-[15px] text-black/60">No account required. Free for everyone in Nigeria.</p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-3">
              <button
                type="button"
                onClick={() => navigate('/search')}
                className="rounded-[5px] bg-black px-6 py-3 text-[14px] font-semibold text-accent transition hover:bg-panel"
              >
                Find a hospital
              </button>
              <button
                type="button"
                onClick={() => navigate('/search?view=map')}
                className="rounded-[5px] border border-black/20 px-6 py-3 text-[14px] font-semibold text-black transition hover:bg-black/10"
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
