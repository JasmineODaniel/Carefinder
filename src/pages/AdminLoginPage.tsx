import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../features/auth/AuthContext';

const SLIDES = [
  {
    headline: (<>Manage Nigeria's<br /><span className="text-accent">Hospital Directory.</span></>),
    body: 'Add records, review submissions, and keep the directory accurate for everyone across all 36 states.',
  },
  {
    headline: (<>Admin access<br /><span className="text-accent">only.</span></>),
    body: 'Only verified administrators can sign in. All actions are logged and protected by Supabase RLS.',
  },
];

export function AdminLoginPage() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [slide, setSlide] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % SLIDES.length), 4000);
    return () => clearInterval(t);
  }, []);

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const err = await signIn(email, password);
    if (err) {
      setError(err);
      setLoading(false);
    } else {
      navigate('/admin');
    }
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden font-body">

      <div className="relative hidden flex-col items-center justify-between bg-panel p-8 lg:flex lg:w-[45%]">
        <div className="flex w-full items-center gap-2">
          <img src="/favicon.svg" alt="Carefinder logo" className="size-7 rounded-[5px]" />
          <span className="font-display text-[13px] tracking-tight text-white">CAREFINDER</span>
        </div>

        <div className="relative w-full flex-1">
          {SLIDES.map((s, i) => (
            <div
              key={i}
              className="absolute inset-0 flex flex-col items-center justify-center text-center transition-opacity duration-700"
              style={{ opacity: slide === i ? 1 : 0, pointerEvents: slide === i ? 'auto' : 'none' }}
            >
              <div className="mb-8 flex size-[88px] items-center justify-center rounded-[20px] bg-white/10 shadow-lg shadow-black/30">
                <img src="/favicon.svg" alt="" className="size-14 rounded-[12px]" />
              </div>
              <h2 className="font-display text-[28px] leading-[1.2] text-white">
                {s.headline}
              </h2>
              <p className="mt-4 max-w-[280px] text-[13px] leading-relaxed text-white/45">
                {s.body}
              </p>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setSlide(i)}
              className="h-2 rounded-full bg-white transition-all duration-500"
              style={{ width: slide === i ? 24 : 8, opacity: slide === i ? 1 : 0.2 }}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-1 flex-col bg-surface">
        <div className="flex items-center justify-between px-8 py-6">
          <Link to="/" className="flex items-center gap-2 lg:hidden">
            <img src="/favicon.svg" alt="Carefinder logo" className="size-6 rounded-[5px]" />
            <span className="font-display text-[13px] tracking-tight text-ink">CAREFINDER</span>
          </Link>
          <div className="hidden lg:block" />
          <Link to="/" className="text-[13px] text-soft transition-colors hover:text-ink">
            Back to site
          </Link>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center px-8 pb-10">
          <div className="w-full max-w-[360px]">
            <h1 className="font-display text-[26px] leading-[1.1] text-ink">
              Welcome back, Admin!
            </h1>
            <p className="mt-2 text-[13px] text-soft">
              Please enter your details to sign in to your account
            </p>

            <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4" noValidate>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-[12px] font-medium text-ink">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  required
                  aria-invalid={error ? true : undefined}
                  aria-describedby={error ? 'login-error' : undefined}
                  className="w-full rounded-[5px] border border-line px-4 py-3 text-[14px] text-ink placeholder:text-dim outline-none transition focus:border-ink"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="password" className="text-[12px] font-medium text-ink">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="minimum 8 characters"
                    required
                    aria-invalid={error ? true : undefined}
                    aria-describedby={error ? 'login-error' : undefined}
                    className="w-full rounded-[5px] border border-line px-4 py-3 pr-11 text-[14px] text-ink placeholder:text-dim outline-none transition focus:border-ink"
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-soft transition-colors hover:text-ink"
                  >
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="text-[14px]" />
                  </button>
                </div>
              </div>

              {error && (
                <p id="login-error" role="alert" className="text-[13px] text-error">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-1 w-full rounded-[5px] bg-accent py-3.5 text-[14px] font-semibold text-black transition hover:bg-accent-hover disabled:opacity-50"
              >
                {loading ? 'Signing in…' : 'Sign In'}
              </button>
            </form>

            <p className="mt-5 text-center text-[13px] text-soft">
              Forgot password?{' '}
              <a href="mailto:admin@carefinder.ng" className="text-ink underline hover:no-underline">
                Contact support
              </a>
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-line px-8 py-4">
          <p className="text-[11px] text-soft">© {new Date().getFullYear()} Carefinder</p>
          <div className="flex gap-5">
            <Link to="/" className="text-[11px] text-soft transition-colors hover:text-ink">Home</Link>
            <Link to="/search" className="text-[11px] text-soft transition-colors hover:text-ink">Search</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
