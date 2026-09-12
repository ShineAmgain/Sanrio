import type { ActivityEntry } from "../types";
import Card from "./Card";
import EmptyState from "./EmptyState";
import { timeAgo } from "../lib/format";
import { Activity } from "lucide-react";

const DOT_COLOR: Record<ActivityEntry["color"], string> = {
  teal: "bg-teal-dot",
  pink: "bg-pink-dot",
  cyan: "bg-cyan-dot",
};

export default function ActivityPanel({ entries }: { entries: ActivityEntry[] }) {
  return (
    <Card>
      <h2 className="mb-4 text-xl font-bold text-navy-800">Recent activity</h2>

      {entries.length === 0 ? (
        <EmptyState
          icon={Activity}
          title="Nothing yet"
          description="Activity will show up here as records are added or changed."
        />
      ) : (
        <ul className="space-y-4">
          {entries.slice(0, 6).map((entry) => (
            <li key={entry.id} className="flex items-start gap-3">
              <span
                className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${DOT_COLOR[entry.color]}`}
              />
              <p className="text-sm text-navy-800">
                <span className="font-bold">{entry.actor}</span>{" "}
                {entry.action}
                <span className="ml-2 text-xs font-medium text-navy-800/40">
                  {timeAgo(entry.timestamp)}
                </span>
              </p>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
