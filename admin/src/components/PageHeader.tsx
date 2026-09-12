import { Search } from "lucide-react";
import type { ReactNode } from "react";

export default function PageHeader({
  title,
  action,
}: {
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-9 flex flex-wrap items-center justify-between gap-4">
      <h1 className="text-4xl font-extrabold tracking-tight text-navy-800">
        {title}
      </h1>
      <div className="flex items-center gap-3">
        {action}
        <div className="relative">
          <Search
            size={18}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-navy-800/50"
          />
          <input
            type="text"
            placeholder="Search..."
            className="w-64 rounded-full bg-navy-50 py-2.5 pl-11 pr-4 text-sm text-navy-800 placeholder:text-navy-800/40 outline-none ring-1 ring-transparent focus:ring-navy-600/30"
          />
        </div>
      </div>
    </div>
  );
}
