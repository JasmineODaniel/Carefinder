import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 font-semibold transition-colors rounded-[5px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

  const variants: Record<string, string> = {
    primary: 'bg-accent text-on-accent hover:bg-accent-hover',
    secondary: 'border border-line bg-surface text-ink hover:bg-muted',
    ghost: 'text-soft hover:text-ink hover:bg-muted',
    danger: 'bg-error-bg text-error border border-error-border hover:bg-red-100',
  };

  const sizes: Record<string, string> = {
    sm: 'px-3 py-1.5 text-[13px]',
    md: 'px-5 py-2.5 text-[14px]',
    lg: 'px-6 py-3.5 text-[15px]',
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
