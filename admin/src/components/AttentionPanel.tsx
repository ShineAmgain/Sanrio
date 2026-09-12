import { useNavigate } from "react-router-dom";
import type { AttentionItem } from "../types";
import Badge from "./Badge";
import Card from "./Card";
import EmptyState from "./EmptyState";
import { ShieldCheck } from "lucide-react";

export default function AttentionPanel({ items }: { items: AttentionItem[] }) {
  const navigate = useNavigate();

  return (
    <Card>
      <h2 className="mb-4 text-xl font-bold text-navy-800">Needs attention</h2>

      {items.length === 0 ? (
        <EmptyState
          icon={ShieldCheck}
          title="All clear"
          description="No data-quality issues detected right now."
        />
      ) : (
        <div className="divide-y divide-navy-800/10">
          {items.map((item) => (
            <div key={item.id} className="flex items-start gap-4 py-4 first:pt-0 last:pb-0">
              <span
                className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${
                  item.severity === "CRITICAL" ? "bg-critical-text" : "bg-warning-text"
                }`}
              />
              <div className="flex-1">
                <p className="font-bold text-navy-800">{item.title}</p>
                <p className="mt-0.5 text-sm text-navy-800/65">{item.detail}</p>
                <button
                  onClick={() => navigate(item.linkTo)}
                  className="mt-1 text-sm font-bold text-navy-700 underline-offset-2 hover:underline"
                >
                  {item.linkLabel}
                </button>
              </div>
              <Badge tone={item.severity === "CRITICAL" ? "critical" : "warning"}>
                {item.severity}
              </Badge>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
