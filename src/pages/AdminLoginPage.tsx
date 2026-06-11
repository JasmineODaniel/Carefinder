import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { useAuth } from '../features/auth/AuthContext';

const TAGS = ['Admin', 'Secure', 'Verified'];

export function AdminLoginPage() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
    <div className="flex h-screen w-screen overflow-hidden bg-canvas font-body">
      <div className="flex w-full flex-col lg:flex-row">
        <div className="relative flex w-full flex-col bg-surface lg:w-[44%] lg:min-h-screen">
          <div className="flex items-center justify-between px-7 py-5">
            <Link to="/" className="flex items-center gap-2">
              <img src="/favicon.svg" alt="Carefinder logo" className="size-7 rounded-[5px]" />
              <span className="font-display text-[14px] tracking-tight text-ink">CAREFINDER</span>
            </Link>
            <Link
              to="/"
              className="text-[13px] font-medium text-soft transition-colors hover:text-ink"
            >
              Back to site
            </Link>
          </div>

          <div className="flex flex-1 flex-col justify-between px-7 pb-8 pt-6">
            <div className="flex flex-col gap-7">
              <div className="flex flex-wrap gap-2">
                {TAGS.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-[5px] border border-line px-3 py-1 text-[11px] font-medium text-soft"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div>
                <h1 className="font-display text-[38px] leading-[1.05] tracking-tight text-ink md:text-[44px]">
                  ADMIN<br />PORTAL.
                </h1>
                <p className="mt-4 text-[14px] leading-relaxed text-soft">
                  Sign in to manage hospital records, review submissions, and moderate content.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="email" className="text-[12px] font-medium text-soft">
                    Email address
                  </label>
                  <div className="flex items-center gap-2 rounded-[5px] border border-line bg-canvas px-3 py-3 transition-colors focus-within:border-ink">
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@example.com"
                      required
                      className="min-w-0 flex-1 bg-transparent text-[14px] text-ink placeholder:text-soft focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="password" className="text-[12px] font-medium text-soft">
                    Password
                  </label>
                  <div className="flex items-center gap-2 rounded-[5px] border border-line bg-canvas px-3 py-3 transition-colors focus-within:border-ink">
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="min-w-0 flex-1 bg-transparent text-[14px] text-ink placeholder:text-soft focus:outline-none"
                    />
                  </div>
                </div>

                {error && (
                  <p role="alert" className="text-[13px] text-error">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-1 w-full rounded-[5px] bg-ink py-3.5 text-[14px] font-semibold text-surface transition-colors hover:bg-accent-hover disabled:opacity-50"
                >
                  {loading ? 'Signing in…' : 'Sign in'}
                </button>
              </form>
            </div>

            <div className="mt-8 flex flex-col gap-4 border-t border-line pt-6">
              {[
                { icon: '⊕', text: 'Only verified administrators can access this portal' },
                { icon: '◎', text: 'All actions are logged and protected by Supabase RLS' },
              ].map((item) => (
                <div key={item.text} className="flex items-start gap-3">
                  <span className="mt-0.5 text-[16px] text-soft">{item.icon}</span>
                  <p className="text-[12px] leading-relaxed text-soft">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative hidden flex-1 lg:block">
          <div className="absolute inset-0 bg-ink">
            <div className="flex h-full w-full items-center justify-center">
              <p className="text-[12px] text-surface/30">Place your image here</p>
            </div>
          </div>

          <div className="absolute bottom-8 left-6 right-6 rounded-[5px] border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-[5px] bg-white/10 text-surface">
                <Lock className="size-4" strokeWidth={2} />
              </span>
              <div>
                <p className="font-display text-[12px] tracking-wider text-surface">SECURE ACCESS</p>
                <p className="mt-0.5 text-[11px] text-surface/50">Protected by Supabase Auth + Row Level Security</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
