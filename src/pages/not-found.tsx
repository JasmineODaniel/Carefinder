import { useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-6 bg-[#1c1c1c]">
      <div className="flex items-center gap-3">
        <AlertCircle className="size-8 text-accent" strokeWidth={1.5} />
        <h1 className="font-display text-[32px] text-white">
          404
        </h1>
      </div>
      <p className="text-[14px] text-[#555]">Page not found.</p>
      <button
        onClick={() => navigate('/')}
        className="rounded-[5px] bg-accent px-5 py-2.5 text-[13px] font-semibold text-on-accent transition hover:bg-accent-hover"
      >
        Back to home
      </button>
    </div>
  );
}
