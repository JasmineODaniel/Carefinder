import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Header } from './Header';

export function PageLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-canvas font-body text-ink">
      <Header />
      <main className="flex-1">{children}</main>
      <footer className="border-t border-line bg-surface">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <Link to="/" className="flex items-center gap-2">
                <span className="grid size-6 place-items-center rounded-[5px] bg-accent text-white">
                  <Plus className="size-3.5" strokeWidth={2.5} />
                </span>
                <span className="font-display text-[14px] tracking-tight text-ink">CAREFINDER</span>
              </Link>
              <p className="mt-2 max-w-[220px] text-[12px] leading-relaxed text-soft">
                Helping Nigerians find verified hospitals quickly.
              </p>
            </div>

            <div className="flex gap-12 text-[13px]">
              <div className="flex flex-col gap-2">
                <p className="font-display text-[10px] tracking-widest text-soft">PRODUCT</p>
                <Link to="/search" className="text-soft transition-colors hover:text-ink">Search</Link>
                <Link to="/search?view=map" className="text-soft transition-colors hover:text-ink">Map</Link>
                <Link to="/#about" className="text-soft transition-colors hover:text-ink">How it works</Link>
              </div>
              <div className="flex flex-col gap-2">
                <p className="font-display text-[10px] tracking-widest text-soft">ADMIN</p>
                <Link to="/admin/login" className="text-soft transition-colors hover:text-ink">Log in</Link>
                <Link to="/admin" className="text-soft transition-colors hover:text-ink">Dashboard</Link>
              </div>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-between border-t border-line pt-6">
            <p className="text-[11px] text-soft">
              © {new Date().getFullYear()} Carefinder
            </p>
            <p className="text-[11px] text-soft">Built for Nigeria</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
