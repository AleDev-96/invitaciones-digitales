import type { ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'secondary' | 'danger';

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-stone-800 text-white hover:bg-stone-700',
  secondary: 'border border-stone-300 bg-white text-stone-800 hover:bg-stone-100',
  danger: 'border border-red-200 bg-white text-red-700 hover:bg-red-50',
};

export function Button({
  variant = 'secondary',
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      type="button"
      className={`min-h-11 rounded-lg px-4 py-2 text-base font-semibold disabled:cursor-not-allowed disabled:opacity-50 ${VARIANTS[variant]} ${className}`}
      {...props}
    />
  );
}

export const inputClass =
  'min-h-11 w-full rounded-lg border border-stone-300 bg-white px-3 text-base text-stone-900 focus:border-stone-600 focus:outline-none';

export function Notice({ children }: { children: string }) {
  return (
    <p role="alert" className="rounded-lg bg-amber-50 px-4 py-3 text-base text-amber-900">
      {children}
    </p>
  );
}
