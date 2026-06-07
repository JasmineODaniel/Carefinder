import { Search, ChevronRight, HeartPulse } from 'lucide-react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthContext';

const NAV_LINKS = [
  { label: 'Find Hospitals', to: '/search', desc: 'Search the full directory' },
  { label: 'How It Works', to: '/#about', desc: 'Learn the 3-step process' },
  { label: 'Browse Specialties', to: '/search?specialty=', desc: 'Filter by medical category' },
];

export function Header() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 border-b border-[#1a1a1a] bg-[#0a0a0a]">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-3.5">

        <Link to="/" className="flex shrink-0 items-center gap-2.5">
          <span className="relative grid size-8 place-items-center rounded-[5px] bg-accent">
            <HeartPulse className="size-4 text-black" strokeWidth={2.5} />
          </span>
          <span className="font-display text-[13px] tracking-tight text-white">
            Care<span className="text-accent">finder</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex">
          {NAV_LINKS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `group flex flex-col rounded-[5px] px-4 py-2 transition-colors ${
                  isActive
                    ? 'bg-[#111] text-accent'
                    : 'text-[#888] hover:bg-[#111] hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className={`text-[13px] font-medium ${isActive ? 'text-accent' : ''}`}>
                    {item.label}
                  </span>
                  <span className="text-[10px] text-[#444] group-hover:text-[#555]">{item.desc}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <button
            onClick={() => navigate('/search')}
            className="hidden items-center gap-2 rounded-[5px] border border-[#222] bg-[#111] px-4 py-2 text-[12px] font-medium text-[#888] transition hover:border-accent hover:text-accent md:flex"
          >
            <Search className="size-3.5" strokeWidth={2} />
            <span>Search hospitals</span>
          </button>

          {user ? (
            <>
              <Link
                to="/admin"
                className="flex items-center gap-1 rounded-[5px] bg-accent px-4 py-2 text-[12px] font-semibold text-black transition hover:bg-accent-hover"
              >
                Dashboard <ChevronRight className="size-3.5" strokeWidth={2.5} />
              </Link>
              <button
                onClick={signOut}
                className="rounded-[5px] border border-[#222] px-3 py-2 text-[12px] font-medium text-[#666] transition hover:border-[#444] hover:text-white"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link
              to="/admin/login"
              className="flex items-center gap-1 rounded-[5px] bg-white px-4 py-2 text-[12px] font-semibold text-black transition hover:bg-accent"
            >
              Admin <ChevronRight className="size-3.5" strokeWidth={2.5} />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
