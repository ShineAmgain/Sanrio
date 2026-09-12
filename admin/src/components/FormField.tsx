import type { ReactNode } from "react";

export default function FormField({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <label className="mb-4 block">
      <span className="mb-1.5 block text-xs font-bold text-navy-800/80">
        {label}
      </span>
      {children}
      {hint && <span className="mt-1 block text-xs text-navy-800/50">{hint}</span>}
    </label>
  );
}

export const inputClass =
  "w-full rounded-lg border border-navy-800/20 bg-white px-3.5 py-2.5 text-sm text-navy-800 outline-none focus:border-navy-600/50";
