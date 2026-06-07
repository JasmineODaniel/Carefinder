import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Download,
  Share2,
  MapPin,
  ArrowRight,
  Shield,
  Clock,
  Globe,
  Search,
  Star,
  Plus,
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

const RIGHT_GRID_IMAGES = [
  'https://images.unsplash.com/photo-1551190822-a9333d879b1f?auto=format&w=240&q=80',
  'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&w=240&q=80',
  'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&w=240&q=80',
  'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&w=240&q=80',
  'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&w=240&q=80',
  'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&w=240&q=80',
  'https://images.unsplash.com/photo-1576671081837-49000212a370?auto=format&w=240&q=80',
  'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&w=240&q=80',
  'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&w=240&q=80',
];

const ROBOT_IMG =
  'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&w=600&q=80';

export function HomePage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    navigate(`/search${query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ''}`);
  }

  return (
    <PageLayout>

      {/* HERO — 3-PANEL LAYOUT */}
      <section className="bg-[#0a0a0a]">
        <div
          className="grid min-h-[calc(100vh-56px)]"
          style={{ gridTemplateColumns: '1fr 0.65fr 0.9fr' }}
        >

          {/* PANEL 1 — white, headline + search + robot image */}
          <div className="flex flex-col justify-between border-r border-[#1a1a1a] bg-white p-8 lg:p-10">

            <div>
              <span className="inline-flex items-center gap-1.5 rounded-[5px] border border-[#e2e8f0] bg-[#f8fafc] px-2.5 py-1 text-[10px] font-semibold tracking-[0.18em] text-[#64748b]">
                <span className="size-1.5 rounded-full bg-accent" />
                NIGERIA'S HOSPITAL DIRECTORY
              </span>

              <h1 className="mt-5 font-display text-[48px] leading-[1.05] tracking-tight text-black lg:text-[56px]">
                Find the<br />
                Right<br />
                <span className="inline-block rounded-[5px] bg-black px-3 py-1 text-accent">
                  Hospital.
                </span>
              </h1>

              <p className="mt-5 max-w-xs text-[14px] leading-relaxed text-[#64748b]">
                Search 2,000+ verified hospitals across Nigeria by specialty, city, or proximity — free for everyone.
              </p>

              <form onSubmit={handleSearch} className="mt-6 flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#94a3b8]" strokeWidth={2} />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Hospital name, city or LGA…"
                    className="w-full rounded-[5px] border border-[#e2e8f0] bg-[#f8fafc] py-3 pl-9 pr-3 text-[13px] text-[#0f172a] placeholder-[#94a3b8] outline-none transition focus:border-accent focus:bg-white"
                  />
                </div>
                <button
                  type="submit"
                  className="rounded-[5px] bg-black px-5 py-3 text-[12px] font-semibold text-white transition hover:bg-accent hover:text-black"
                >
                  SEARCH
                </button>
              </form>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {['Cardiology', 'Maternity', 'Emergency', 'Pediatrics'].map((s) => (
                  <button
                    key={s}
                    onClick={() => navigate(`/search?specialty=${encodeURIComponent(s)}`)}
                    className="rounded-[5px] border border-[#e2e8f0] px-3 py-1 text-[11px] text-[#64748b] transition hover:border-accent hover:text-accent"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative mt-8 overflow-hidden rounded-[5px]" style={{ height: 240 }}>
              <img
                src={ROBOT_IMG}
                alt="AI medical assistance"
                className="h-full w-full object-cover"
                style={{ filter: 'grayscale(0.15)' }}
              />
              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/20 to-transparent p-5">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-[10px] font-semibold tracking-widest text-accent">
                      AI-ASSISTED SEARCH
                    </p>
                    <p className="mt-1 font-display text-[18px] font-bold text-white">
                      2,000+ Records
                    </p>
                  </div>
                  <button
                    onClick={() => navigate('/search')}
                    className="flex items-center gap-1.5 rounded-[5px] bg-accent px-4 py-2 text-[11px] font-bold text-black transition hover:bg-white"
                  >
                    SEARCH NOW
                    <ArrowRight className="size-3.5" strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* PANEL 2 — black + aqua, stats */}
          <div className="flex flex-col border-r border-[#1a1a1a]">

            <div className="flex flex-1 flex-col justify-between bg-accent p-7">
              <div className="flex items-center justify-between">
                <div className="grid size-9 place-items-center rounded-full bg-black">
                  <Plus className="size-4 text-accent" strokeWidth={2.5} />
                </div>
                <span className="text-[10px] font-semibold tracking-widest text-black/60">
                  HOSPITALS
                </span>
              </div>

              <div>
                <p className="font-display text-[52px] font-black leading-none text-black">
                  2K+
                </p>
                <p className="mt-1 text-[11px] font-bold tracking-widest text-black">
                  INDEXED
                </p>
                <p className="mt-2 text-[12px] leading-snug text-black/60">
                  Verified across all 36 states and the FCT of Nigeria.
                </p>
              </div>
            </div>

            <div className="relative flex items-center justify-center" style={{ height: 0 }}>
              <div
                className="absolute z-10 grid size-12 place-items-center rounded-full border-4 border-[#0a0a0a] bg-accent"
                style={{ top: '-24px' }}
              >
                <Star className="size-5 fill-black text-black" strokeWidth={0} />
              </div>
            </div>

            <div className="flex flex-1 flex-col justify-between bg-[#0a0a0a] p-7 pt-10">
              <div className="flex items-center justify-between">
                <div className="grid size-9 place-items-center rounded-full border border-[#222] bg-[#111]">
                  <Globe className="size-4 text-accent" strokeWidth={1.8} />
                </div>
                <span className="text-[10px] font-semibold tracking-widest text-[#444]">
                  STATES
                </span>
              </div>

              <div>
                <p className="font-display text-[52px] font-black leading-none text-white">
                  36
                </p>
                <p className="mt-1 text-[11px] font-bold tracking-widest text-accent">
                  COVERED
                </p>
                <p className="mt-2 text-[12px] leading-snug text-[#444]">
                  From Lagos Island to the most rural LGAs — nationwide.
                </p>
              </div>

              <button
                onClick={() => navigate('/search?view=map')}
                className="flex w-full items-center justify-between rounded-[5px] border border-[#222] px-4 py-2.5 text-[11px] font-semibold text-[#888] transition hover:border-accent hover:text-accent"
              >
                <span>EXPLORE THE MAP</span>
                <ArrowRight className="size-3.5" strokeWidth={2.5} />
              </button>
            </div>
          </div>

          {/* PANEL 3 — dark, 3×3 image bento */}
          <div className="flex flex-col gap-0 bg-[#0a0a0a] p-4">

            <div className="mb-3 flex items-center justify-between">
              <span className="text-[10px] font-semibold tracking-[0.2em] text-[#333]">
                HOSPITALS ACROSS NIGERIA
              </span>
              <button
                onClick={() => navigate('/search')}
                className="flex items-center gap-1 text-[10px] font-semibold text-accent transition hover:text-white"
              >
                VIEW ALL <ArrowRight className="size-2.5" strokeWidth={2.5} />
              </button>
            </div>

            <div className="grid flex-1 grid-cols-3 gap-2" style={{ gridTemplateRows: 'repeat(3, 1fr)' }}>
              {RIGHT_GRID_IMAGES.map((src, i) => (
                <div
                  key={i}
                  className="overflow-hidden"
                  style={{ borderRadius: '10px', filter: 'grayscale(0.4) brightness(0.8)' }}
                >
                  <img
                    src={src}
                    alt=""
                    className="h-full w-full object-cover transition duration-500 hover:scale-110 hover:grayscale-0 hover:brightness-100"
                  />
                </div>
              ))}
            </div>

            <div className="mt-3 flex items-center gap-2 rounded-[5px] border border-[#1a1a1a] bg-[#111] px-4 py-2.5">
              <Shield className="size-3.5 text-accent" strokeWidth={2} />
              <span className="text-[11px] text-[#555]">
                All records verified by our admin team
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="border-b border-[#1a1a1a] bg-[#0d0d0d]">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <div className="grid grid-cols-2 divide-x divide-[#1a1a1a] sm:grid-cols-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="px-6 py-2 first:pl-0 last:pr-0">
                <p className="font-display text-[28px] text-accent">
                  {stat.value}
                </p>
                <p className="mt-0.5 text-[12px] text-[#555]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="about" className="scroll-mt-6 border-b border-[#1a1a1a] bg-[#0a0a0a]">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <p className="font-display text-[10px] tracking-[0.2em] text-accent">
            HOW IT WORKS
          </p>
          <h2 className="mt-3 font-display text-[24px] leading-tight text-white md:text-[30px]">
            THREE STEPS TO THE RIGHT CARE.
          </h2>

          {/* Road SVG — desktop */}
          <div className="relative mt-12 hidden md:block" style={{ height: '380px' }}>
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1200 380" preserveAspectRatio="xMidYMid meet">
              <path d="M 0,110 L 140,110 C 230,110 280,185 330,235 C 390,295 440,305 540,305 L 660,305 C 760,305 810,235 860,185 C 910,140 960,110 1060,110 L 1200,110"
                fill="none" stroke="#1a1a1a" strokeWidth="44" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M 0,110 L 140,110 C 230,110 280,185 330,235 C 390,295 440,305 540,305 L 660,305 C 760,305 810,235 860,185 C 910,140 960,110 1060,110 L 1200,110"
                fill="none" stroke="#222" strokeWidth="30" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M 0,110 L 140,110 C 230,110 280,185 330,235 C 390,295 440,305 540,305 L 660,305 C 760,305 810,235 860,185 C 910,140 960,110 1060,110 L 1200,110"
                fill="none" stroke="#00e5d4" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="18 14" />
              <circle cx="200" cy="110" r="20" fill="#00e5d4" /><circle cx="200" cy="110" r="9" fill="#0a0a0a" />
              <circle cx="600" cy="305" r="20" fill="#00e5d4" /><circle cx="600" cy="305" r="9" fill="#0a0a0a" />
              <circle cx="1000" cy="110" r="20" fill="#00e5d4" /><circle cx="1000" cy="110" r="9" fill="#0a0a0a" />
            </svg>
            <div className="absolute" style={{ left: '8%', top: 0, maxWidth: '190px' }}>
              <p className="font-display text-[9px] tracking-widest text-accent">STEP 01</p>
              <h3 className="mt-1 font-display text-[28px] text-white">SEARCH</h3>
              <p className="mt-1.5 text-[12px] leading-relaxed text-[#555]">Hospital name, city, or LGA. Instant results.</p>
            </div>
            <div className="absolute text-center" style={{ left: '42%', bottom: '8px', maxWidth: '200px' }}>
              <p className="text-[12px] leading-relaxed text-[#555]">Filter by specialty, ownership, or geolocation radius.</p>
              <h3 className="mt-2 font-display text-[28px] text-white">FILTER</h3>
              <p className="font-display text-[9px] tracking-widest text-accent">STEP 02</p>
            </div>
            <div className="absolute text-right" style={{ right: '4%', top: 0, maxWidth: '190px' }}>
              <p className="font-display text-[9px] tracking-widest text-accent">STEP 03</p>
              <h3 className="mt-1 font-display text-[28px] text-white">EXPORT</h3>
              <p className="mt-1.5 text-[12px] leading-relaxed text-[#555]">Download CSV or share a link by email.</p>
            </div>
          </div>

          {/* Mobile steps */}
          <div className="mt-10 flex flex-col gap-0 md:hidden">
            {STEPS.map((step, i, arr) => (
              <div key={step.num} className="flex gap-5">
                <div className="flex flex-col items-center">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-[5px] bg-accent">
                    <span className="font-display text-[10px] text-black">{step.num}</span>
                  </div>
                  {i < arr.length - 1 && <div className="mt-2 w-[2px] flex-1 bg-[#1a1a1a]" />}
                </div>
                <div className="pb-10 pt-1">
                  <p className="font-display text-[22px] text-white">{step.title.toUpperCase()}</p>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-[#555]">{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SPECIALTIES */}
      <section className="border-b border-[#1a1a1a] bg-[#0d0d0d]">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <p className="font-display text-[10px] tracking-[0.2em] text-accent">
            BROWSE BY SPECIALTY
          </p>
          <div className="mt-3 flex items-end justify-between gap-4">
            <h2 className="font-display text-[24px] leading-tight text-white md:text-[30px]">
              FIND EXACTLY WHAT YOU NEED.
            </h2>
            <button
              onClick={() => navigate('/search')}
              className="hidden shrink-0 items-center gap-1.5 rounded-[5px] border border-[#222] px-4 py-2 text-[13px] font-medium text-[#888] transition hover:border-accent hover:text-accent sm:flex"
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
                className="flex items-center justify-between rounded-[5px] border border-[#1a1a1a] bg-[#111] px-4 py-3 text-left text-[13px] font-medium text-[#888] transition hover:border-accent hover:text-accent"
              >
                <span>{specialty}</span>
                <ArrowRight className="size-3.5 shrink-0 text-[#333]" strokeWidth={2} />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="border-b border-[#1a1a1a] bg-[#0a0a0a]">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <p className="font-display text-[10px] tracking-[0.2em] text-accent">
            FEATURES
          </p>
          <h2 className="mt-3 font-display text-[24px] leading-tight text-white md:text-[30px]">
            BUILT FOR REAL USE.
          </h2>
          <div className="mt-10 grid gap-px border border-[#1a1a1a] bg-[#1a1a1a] sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="flex flex-col gap-4 bg-[#0a0a0a] p-6 transition-colors hover:bg-[#111]"
              >
                <span className="grid size-9 place-items-center rounded-[5px] bg-tint text-accent">
                  <feature.icon className="size-[18px]" strokeWidth={2} />
                </span>
                <h3 className="font-display text-[12px] tracking-[0.12em] text-white">
                  {feature.title.toUpperCase()}
                </h3>
                <p className="text-[14px] leading-relaxed text-[#555]">{feature.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="bg-accent">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="font-display text-[24px] leading-tight text-black md:text-[32px]">
                START FINDING HOSPITALS NOW.
              </h2>
              <p className="mt-3 text-[15px] text-black/60">
                No account required. Free for everyone in Nigeria.
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-3">
              <button
                onClick={() => navigate('/search')}
                className="rounded-[5px] bg-black px-6 py-3 text-[14px] font-semibold text-accent transition hover:bg-[#0d0d0d]"
              >
                Find a hospital
              </button>
              <button
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
