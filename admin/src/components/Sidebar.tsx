import { NavLink } from "react-router-dom";
import {
  LayoutGrid,
  Users,
  FileText,
  SquarePen,
  CalendarDays,
  Star,
} from "lucide-react";
import LogoMark from "./LogoMark";

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: LayoutGrid, end: true },
  { to: "/researchers", label: "Researchers", icon: Users },
  { to: "/projects", label: "Projects", icon: FileText },
  { to: "/publications", label: "Publications", icon: SquarePen },
  { to: "/events", label: "Events", icon: CalendarDays },
  { to: "/opportunities", label: "Opportunities", icon: Star },
];

export default function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-20 flex w-64 flex-col bg-navy-800 px-5 py-7">
      <div className="mb-8 flex items-center gap-2.5 px-1">
        <LogoMark />
        <div className="leading-tight">
          <p className="text-[11px] font-medium text-navy-100/70">
            Islington College
          </p>
          <p className="text-sm font-bold text-white">
            Research &amp; Development
          </p>
        </div>
      </div>

      <div className="mb-6 h-px w-full bg-white/10" />

      <nav className="flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-white/10 text-white"
                  : "text-navy-100/75 hover:bg-white/5 hover:text-white"
              }`
            }
          >
            <Icon size={18} strokeWidth={2} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="rounded-lg bg-white/5 px-3.5 py-3 text-[11px] leading-relaxed text-navy-100/60">
        Sample admin data shown for demonstration — not genuine institutional
        records.
      </div>
    </aside>
  );
}
