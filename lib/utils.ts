import { type ClassValue } from 'clsx';

/**
 * Lightweight, zero-runtime-dependency class name combiner compatible with shadcn/ui.
 * Safely handles strings, conditionals, arrays, and undefined/null.
 */
export function cn(...inputs: (string | undefined | null | false | boolean | number)[]) {
  return inputs.filter(Boolean).join(' ');
}
