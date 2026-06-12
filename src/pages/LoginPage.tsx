import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

const GRID_IMAGES = [
  'https://images.unsplash.com/photo-1551190822-a9333d879b1f?auto=format&w=280&q=80',
  'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&w=280&q=80',
  'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&w=280&q=80',
  'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&w=280&q=80',
  'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&w=280&q=80',
  'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&w=280&q=80',
  'https://images.unsplash.com/photo-1576671081837-49000212a370?auto=format&w=280&q=80',
  'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&w=280&q=80',
  'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&w=280&q=80',
];

const FEATURE_PILLS = [
  { label: 'Maximum Coverage', accent: true },
  { label: 'Fast Geolocation' },
  { label: 'Verified Records' },
  { label: 'CSV Export' },
];

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  return (
    <div className="flex h-screen w-full overflow-hidden bg-panel">

      <div className="flex w-full flex-col justify-between p-10 md:w-[420px] lg:w-[480px]">

        <div className="flex items-center gap-2.5">
          <img src="/favicon.svg" alt="Carefinder logo" className="size-7 rounded-[5px]" />
          <span className="font-display text-[13px] tracking-tight text-white">
            Carefinder°
          </span>
        </div>

        <div className="flex flex-col gap-6">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.2em] text-accent">
              NIGERIA'S HOSPITAL DIRECTORY
            </p>
            <h1 className="mt-3 font-display text-[32px] leading-[1.1] text-white">
              Welcome back.
            </h1>
            <p className="mt-2 text-[14px] leading-relaxed text-soft">
              Find verified hospitals across all 36 states — no account required.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="login-email" className="text-[11px] font-medium tracking-widest text-dim">
                EMAIL (OPTIONAL)
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-[5px] border border-panel-border bg-black px-4 py-3 text-[14px] text-white placeholder:text-dim/50 outline-none transition focus:border-accent"
              />
            </div>

            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex w-full items-center justify-between rounded-[5px] bg-accent px-5 py-3.5 text-[13px] font-semibold text-black transition hover:bg-accent-hover"
            >
              <span>Enter Carefinder</span>
              <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-panel-border" />
            <span className="text-[11px] text-dim/50">or</span>
            <div className="h-px flex-1 bg-panel-border" />
          </div>

          <button
            type="button"
            onClick={() => navigate('/')}
            className="w-full rounded-[5px] border border-panel-border bg-transparent px-5 py-3 text-[13px] font-medium text-dim transition hover:border-soft hover:text-white"
          >
            Continue as guest
          </button>

          <p className="text-[11px] text-dim/40">
            Free for everyone in Nigeria. No data sold. No spam.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-display text-[24px] font-bold text-white">2,000+</span>
          <span className="text-[12px] text-soft">hospitals indexed across all 36 states</span>
        </div>
      </div>

      <div className="relative hidden flex-1 overflow-hidden p-4 md:block">
        <div
          className="grid gap-2"
          style={{
            gridTemplateColumns: 'repeat(3, 1fr)',
            gridTemplateRows: 'repeat(3, 1fr)',
            height: '100%',
          }}
        >
          {GRID_IMAGES.map((src, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-[5px]"
              style={{ filter: 'grayscale(0.3) brightness(0.8)' }}
            >
              <img
                src={src}
                alt=""
                className="h-full w-full object-cover transition duration-700 hover:scale-105 hover:brightness-110"
              />
            </div>
          ))}
        </div>

        <div className="absolute bottom-8 left-8 flex flex-wrap gap-2">
          {FEATURE_PILLS.map((pill) => (
            <span
              key={pill.label}
              className={`rounded-[5px] px-3 py-1.5 text-[11px] font-semibold ${
                pill.accent
                  ? 'bg-accent text-black'
                  : 'border border-panel-border bg-black/75 text-white'
              }`}
            >
              {pill.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
