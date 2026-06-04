import type { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'accent' | 'success';
}

export function Badge({ children, variant = 'default' }: BadgeProps) {
  const variants: Record<string, string> = {
    default: 'bg-muted text-soft',
    accent: 'bg-tint text-accent',
    success: 'bg-green-50 text-green-700',
  };

  return (
    <span
      className={`inline-flex items-center rounded-[5px] px-2.5 py-1 text-[11px] font-medium capitalize ${variants[variant]}`}
    >
      {children}
    </span>
  );
}
