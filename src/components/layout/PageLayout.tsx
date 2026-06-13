import type { ReactNode } from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Header } from './Header';

const FOOTER_LINES = [
  { text: 'Healthcare that',   dim: false },
  { text: 'reaches you,',      dim: false },
  { text: 'across every',      dim: true  },
  { text: 'state in Nigeria.', dim: true  },
];
const TOTAL_CHARS = FOOTER_LINES.reduce((s, l) => s + l.text.length, 0);

export function PageLayout({ children }: { children: ReactNode }) {
  const [charCount, setCharCount] = useState(0);
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    if (resetting) {
      const t = setTimeout(() => { setCharCount(0); setResetting(false); }, 900);
      return () => clearTimeout(t);
    }
    if (charCount >= TOTAL_CHARS) {
      setResetting(true);
      return;
    }
    const t = setTimeout(() => setCharCount((c) => c + 1), 55);
    return () => clearTimeout(t);
  }, [charCount, resetting]);

  return (
    <div className="flex min-h-screen flex-col bg-canvas font-body text-ink">
      <Header />
      <main className="flex-1">{children}</main>

      <footer className="bg-canvas px-4 pb-4 pt-6">
        <div className="overflow-hidden rounded-[12px] bg-panel">

          <div className="px-8 pt-10">
            <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">

              <div className="max-w-[360px]">
                <span className="inline-block rounded-[5px] border border-accent/25 bg-accent/10 px-3 py-1 text-[11px] font-medium tracking-widest text-accent/70">
                  CAREFINDER
                </span>
                <h2 className="mt-5 font-display text-[28px] leading-[1.15] md:text-[34px]">
                  {FOOTER_LINES.map((line, i) => {
                    const lineStart = FOOTER_LINES.slice(0, i).reduce((s, l) => s + l.text.length, 0);
                    const chars = Math.max(0, Math.min(charCount - lineStart, line.text.length));
                    const isActive = !resetting && charCount >= lineStart && charCount < lineStart + line.text.length;
                    return (
                      <span key={i} className={`block min-h-[1.15em] ${line.dim ? 'text-accent/50' : 'text-white'}`}>
                        {line.text.slice(0, chars)}
                        {isActive && <span className="animate-pulse opacity-80">|</span>}
                      </span>
                    );
                  })}
                </h2>
              </div>

              <div className="flex flex-wrap gap-10 text-[13px]">
                <div className="flex flex-col gap-3">
                  <p className="font-display text-[10px] tracking-[0.15em] text-white/30">PRODUCT</p>
                  <Link to="/search" className="text-white/55 transition-colors hover:text-white">Search</Link>
                  <Link to="/search?view=map" className="text-white/55 transition-colors hover:text-white">Map</Link>
                  <Link to="/#how-it-works" className="text-white/55 transition-colors hover:text-white">How it works</Link>
                </div>

                <div className="flex flex-col gap-3">
                  <p className="font-display text-[10px] tracking-[0.15em] text-white/30">ADMIN</p>
                  <Link to="/admin/login" className="text-white/55 transition-colors hover:text-white">Log in</Link>
                  <Link to="/admin" className="text-white/55 transition-colors hover:text-white">Dashboard</Link>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 select-none overflow-hidden leading-none">
            <p
              className="font-display font-bold tracking-tight text-accent/8"
              style={{ fontSize: 'clamp(72px, 13vw, 190px)', lineHeight: 0.85, animation: 'slide-lr 9s ease-in-out infinite' }}
            >
              CAREFINDER
            </p>
          </div>

          <div className="border-t border-white/[0.06] px-8 py-4">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[11px] text-white/30">
                © {new Date().getFullYear()} Carefinder. All rights reserved.
              </p>
              <p className="text-[11px] text-white/30">Built for Nigeria · Free to use</p>
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
}
