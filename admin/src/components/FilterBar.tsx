import { Search, Plus, ChevronDown } from "lucide-react";

export interface SelectFilter {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

export default function FilterBar({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search by title, name ...",
  filters = [],
  addLabel,
  onAdd,
}: {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filters?: SelectFilter[];
  addLabel: string;
  onAdd: () => void;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-center gap-3">
      <div className="relative min-w-[240px] flex-1">
        <Search
          size={17}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-navy-800/40"
        />
        <input
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          type="text"
          placeholder={searchPlaceholder}
          className="w-full rounded-lg bg-navy-50 py-2.5 pl-11 pr-4 text-sm text-navy-800 placeholder:text-navy-800/40 outline-none ring-1 ring-transparent focus:ring-navy-600/30"
        />
      </div>

      {filters.map((f) => (
        <div key={f.label} className="relative">
          <select
            value={f.value}
            onChange={(e) => f.onChange(e.target.value)}
            className="appearance-none rounded-lg border border-navy-800/15 bg-white py-2.5 pl-4 pr-9 text-sm font-medium text-navy-800 outline-none focus:border-navy-600/40"
          >
            <option value="">{f.label}</option>
            {f.options.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
          <ChevronDown
            size={15}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-navy-800/50"
          />
        </div>
      ))}

      <button
        onClick={onAdd}
        className="ml-auto flex items-center gap-1.5 rounded-lg bg-navy-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy-700"
      >
        <Plus size={16} />
        {addLabel}
      </button>
    </div>
  );
}
