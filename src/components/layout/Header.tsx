import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthContext';

export function Header() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 border-b border-[#1a1a1a] bg-[#1c1c1c]">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-3.5">

        <Link to="/" className="flex shrink-0 items-center gap-2.5">
          <img src="/favicon.svg" alt="Carefinder logo" className="size-8 rounded-[5px]" />
          <span className="font-display text-[13px] tracking-tight text-white">
            CARE<span className="text-accent">FINDER</span>
          </span>
        </Link>

        <div className="flex shrink-0 items-center gap-2">
          {user ? (
            <>
              <button
                onClick={() => navigate('/admin')}
                className="rounded-[5px] bg-accent px-4 py-2 text-[12px] font-semibold text-black transition hover:bg-accent-hover"
              >
                Dashboard
              </button>
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
              className="rounded-[5px] bg-white px-4 py-2 text-[12px] font-semibold text-black transition hover:bg-accent"
            >
              Admin
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
