import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'purple' | 'amber';
  size?: 'default' | 'sm' | 'lg' | 'icon' | 'xs';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    const variantStyles = {
      default: 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200 active:scale-[0.98]',
      purple: 'bg-purple-600 text-white hover:bg-purple-500 shadow-sm hover:shadow-purple-500/20 active:scale-[0.98]',
      amber: 'bg-amber-500 text-zinc-950 font-semibold hover:bg-amber-400 shadow-sm active:scale-[0.98]',
      destructive: 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 active:scale-[0.98]',
      outline: 'border border-zinc-800 bg-zinc-950/50 hover:bg-zinc-900 text-zinc-200 hover:text-white',
      secondary: 'bg-zinc-800 text-zinc-200 hover:bg-zinc-700 hover:text-white',
      ghost: 'hover:bg-zinc-800/60 text-zinc-400 hover:text-white',
      link: 'text-purple-400 underline-offset-4 hover:underline p-0 h-auto',
    }[variant];

    const sizeStyles = {
      default: 'h-9 px-4 py-2 text-xs font-medium',
      sm: 'h-8 rounded-lg px-3 text-xs',
      xs: 'h-7 rounded-md px-2.5 text-[11px]',
      lg: 'h-10 rounded-xl px-6 text-sm font-semibold',
      icon: 'h-8 w-8 rounded-lg p-0 flex items-center justify-center',
    }[size];

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center whitespace-nowrap rounded-lg transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-400 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer',
          variantStyles,
          sizeStyles,
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button };
