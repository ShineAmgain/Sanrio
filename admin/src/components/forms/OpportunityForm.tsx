import { useState } from "react";
import type { Opportunity, OpportunityType, OpportunityStatus } from "../../types";
import FormField, { inputClass } from "../FormField";

const TYPE_OPTIONS: OpportunityType[] = [
  "Research Assistantship",
  "Internship",
  "Grant",
  "Call for Papers",
  "Competition",
];
const STATUS_OPTIONS: OpportunityStatus[] = ["Draft", "Open", "Closing Soon", "Closed"];

export default function OpportunityForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: Opportunity | null;
  onSave: (o: Opportunity) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<Opportunity>(
    initial ?? {
      id: `o-${Date.now()}`,
      title: "",
      type: "Research Assistantship",
      provider: "",
      researchArea: "",
      deadline: new Date().toISOString().slice(0, 10),
      status: "Draft",
      updatedAt: new Date().toISOString().slice(0, 10),
    },
  );

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    onSave({ ...form, updatedAt: new Date().toISOString().slice(0, 10) });
  };

  return (
    <form onSubmit={submit}>
      <FormField label="Title">
        <input
          required
          className={inputClass}
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
      </FormField>
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Type">
          <select
            className={inputClass}
            value={form.type}
            onChange={(e) =>
              setForm({ ...form, type: e.target.value as OpportunityType })
            }
          >
            {TYPE_OPTIONS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Provider">
          <input
            className={inputClass}
            value={form.provider}
            onChange={(e) => setForm({ ...form, provider: e.target.value })}
          />
        </FormField>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Research area">
          <input
            className={inputClass}
            value={form.researchArea}
            onChange={(e) => setForm({ ...form, researchArea: e.target.value })}
          />
        </FormField>
        <FormField label="Deadline">
          <input
            type="date"
            className={inputClass}
            value={form.deadline}
            onChange={(e) => setForm({ ...form, deadline: e.target.value })}
          />
        </FormField>
      </div>
      <FormField label="Status">
        <select
          className={inputClass}
          value={form.status}
          onChange={(e) =>
            setForm({ ...form, status: e.target.value as OpportunityStatus })
          }
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </FormField>

      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg px-4 py-2 text-sm font-semibold text-navy-800 hover:bg-navy-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-lg bg-navy-800 px-4 py-2 text-sm font-semibold text-white hover:bg-navy-700"
        >
          {initial ? "Save changes" : "Add opportunity"}
        </button>
      </div>
    </form>
  );
}
