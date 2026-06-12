import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-6 bg-panel">
      <div className="flex items-center gap-3">
        <FontAwesomeIcon icon={faTriangleExclamation} className="text-[32px] text-accent" />
        <h1 className="font-display text-[32px] text-white">
          404
        </h1>
      </div>
      <p className="text-[14px] text-dim">Page not found.</p>
      <button
        type="button"
        onClick={() => navigate('/')}
        className="rounded-[5px] bg-accent px-5 py-2.5 text-[13px] font-semibold text-black transition hover:bg-accent-hover"
      >
        Back to home
      </button>
    </div>
  );
}
