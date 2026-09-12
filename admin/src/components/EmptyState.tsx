import type { LucideIcon } from "lucide-react";

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-navy-800/25 py-16 text-center">
      <div className="rounded-full bg-navy-50 p-3 text-navy-800/50">
        <Icon size={22} />
      </div>
      <p className="text-sm font-bold text-navy-800">{title}</p>
      <p className="max-w-xs text-sm text-navy-800/60">{description}</p>
      {action}
    </div>
  );
}
