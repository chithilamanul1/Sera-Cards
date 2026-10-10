import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'purple' | 'amber' | 'blue' | 'success';
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variantStyles = {
    default: 'border-transparent bg-zinc-100 text-zinc-900',
    secondary: 'border-transparent bg-zinc-800 text-zinc-300',
    destructive: 'border-red-500/30 bg-red-500/10 text-red-400',
    outline: 'border-zinc-800 text-zinc-300',
    purple: 'border-purple-500/30 bg-purple-500/10 text-purple-400',
    amber: 'border-amber-500/30 bg-amber-500/10 text-amber-400',
    blue: 'border-blue-500/30 bg-blue-500/10 text-blue-400',
    success: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
  }[variant];

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        variantStyles,
        className
      )}
      {...props}
    />
  );
}

export { Badge };
