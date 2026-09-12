import type { ReactNode } from "react";

export default function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-navy-800/25 bg-white p-6 ${className}`}
    >
      {children}
    </div>
  );
}
