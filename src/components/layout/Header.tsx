import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGauge,
  faArrowRightFromBracket,
  faUserShield,
  faBars,
  faXmark,
  faHospital,
  faMagnifyingGlass,
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../features/auth/AuthContext';

export function Header() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-panel-border bg-panel">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-3.5">

        <Link to="/" className="flex shrink-0 items-center gap-2.5">
          <img src="/favicon.svg" alt="Carefinder logo" className="size-8 rounded-[5px]" />
          <span className="font-display text-[13px] tracking-tight text-white">
            CARE<span className="text-accent">FINDER</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 sm:flex">
          <Link to="/" className="text-[13px] text-dim transition-colors hover:text-white">
            Home
          </Link>
          <Link to="/search" className="text-[13px] text-dim transition-colors hover:text-white">
            Find Hospitals
          </Link>
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <div className="hidden sm:flex items-center gap-2">
            {user ? (
              <>
                <button
                  type="button"
                  onClick={() => navigate('/admin')}
                  title="Dashboard"
                  aria-label="Dashboard"
                  className="rounded-[5px] bg-accent px-3 py-2 text-[13px] text-white transition hover:bg-accent-hover"
                >
                  <FontAwesomeIcon icon={faGauge} />
                </button>
                <button
                  type="button"
                  onClick={signOut}
                  title="Sign out"
                  aria-label="Sign out"
                  className="rounded-[5px] border border-panel-border px-3 py-2 text-[13px] text-dim transition hover:border-soft hover:text-white"
                >
                  <FontAwesomeIcon icon={faArrowRightFromBracket} />
                </button>
              </>
            ) : (
              <Link
                to="/admin/login"
                title="Admin login"
                aria-label="Admin login"
                className="rounded-[5px] bg-accent px-3 py-2 text-[13px] text-white transition hover:bg-accent-hover"
              >
                <FontAwesomeIcon icon={faUserShield} />
              </Link>
            )}
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
            className="rounded-[5px] border border-panel-border px-3 py-2 text-[13px] text-dim transition hover:border-soft hover:text-white sm:hidden"
          >
            <FontAwesomeIcon icon={mobileOpen ? faXmark : faBars} />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-panel-border bg-panel px-6 pb-4 pt-3 sm:hidden">
          <nav className="flex flex-col gap-1">
            <Link
              to="/"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 rounded-[5px] px-3 py-2.5 text-[13px] text-dim transition-colors hover:bg-white/5 hover:text-white"
            >
              <FontAwesomeIcon icon={faHospital} className="w-4 text-center" />
              Home
            </Link>
            <Link
              to="/search"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 rounded-[5px] px-3 py-2.5 text-[13px] text-dim transition-colors hover:bg-white/5 hover:text-white"
            >
              <FontAwesomeIcon icon={faMagnifyingGlass} className="w-4 text-center" />
              Find Hospitals
            </Link>

            <div className="my-1 border-t border-panel-border" />

            {user ? (
              <>
                <button
                  type="button"
                  onClick={() => { navigate('/admin'); setMobileOpen(false); }}
                  className="flex items-center gap-3 rounded-[5px] px-3 py-2.5 text-[13px] text-dim transition-colors hover:bg-white/5 hover:text-white"
                >
                  <FontAwesomeIcon icon={faGauge} className="w-4 text-center" />
                  Dashboard
                </button>
                <button
                  type="button"
                  onClick={() => { signOut(); setMobileOpen(false); }}
                  className="flex items-center gap-3 rounded-[5px] px-3 py-2.5 text-[13px] text-dim transition-colors hover:bg-white/5 hover:text-white"
                >
                  <FontAwesomeIcon icon={faArrowRightFromBracket} className="w-4 text-center" />
                  Sign out
                </button>
              </>
            ) : (
              <Link
                to="/admin/login"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 rounded-[5px] px-3 py-2.5 text-[13px] text-dim transition-colors hover:bg-white/5 hover:text-white"
              >
                <FontAwesomeIcon icon={faUserShield} className="w-4 text-center" />
                Admin login
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
