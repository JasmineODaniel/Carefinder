interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Spinner({ size = 'md', className = '' }: SpinnerProps) {
  const sizes: Record<string, string> = {
    sm: 'size-4',
    md: 'size-6',
    lg: 'size-8',
  };

  return (
    <span
      role="status"
      aria-label="Loading"
      className={`inline-block animate-spin rounded-full border-2 border-current border-t-transparent text-accent ${sizes[size]} ${className}`}
    />
  );
}
