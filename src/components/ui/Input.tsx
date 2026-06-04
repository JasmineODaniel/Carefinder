import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  id: string;
}

export function Input({ label, error, id, className = '', ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-[13px] font-medium text-ink">
          {label}
        </label>
      )}
      <input
        id={id}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`w-full rounded-[5px] border border-line bg-surface px-3 py-2.5 text-[14px] text-ink placeholder:text-soft transition-colors focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent ${error ? 'border-error-border' : ''} ${className}`}
        {...props}
      />
      {error && (
        <p id={`${id}-error`} role="alert" className="text-[12px] text-error">
          {error}
        </p>
      )}
    </div>
  );
}
