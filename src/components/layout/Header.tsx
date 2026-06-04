import { Plus } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthContext';

const NAV_LINKS = [
  { label: 'Search', to: '/search' },
  { label: 'About', to: '/#about' },
];

export function Header() {
  const { user, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3.5">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="grid size-7 place-items-center rounded-[5px] bg-accent text-white">
            <Plus className="size-4" strokeWidth={2.5} />
          </span>
          <span className="font-display text-[15px] tracking-tight text-ink">CAREFINDER</span>
        </Link>

        <nav className="hidden items-center gap-0.5 md:flex">
          {NAV_LINKS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded-[5px] px-4 py-2 text-[13px] font-medium transition-colors ${
                  isActive ? 'bg-tint text-accent' : 'text-soft hover:bg-muted hover:text-ink'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Link
                to="/admin"
                className="hidden rounded-[5px] px-4 py-2 text-[13px] font-medium text-soft transition-colors hover:bg-muted hover:text-ink sm:inline-block"
              >
                Dashboard
              </Link>
              <button
                onClick={signOut}
                className="rounded-[5px] border border-line bg-surface px-4 py-2 text-[13px] font-semibold text-ink transition-colors hover:bg-muted"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/admin/login"
                className="hidden rounded-[5px] px-4 py-2 text-[13px] font-medium text-soft transition-colors hover:bg-muted hover:text-ink sm:inline-block"
              >
                Log in
              </Link>
              <Link
                to="/admin/login"
                className="rounded-[5px] bg-accent px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-accent-hover"
              >
                Admin
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
