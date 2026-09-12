import { useState } from "react";
import type { EventItem, EventType, EventLifecycle } from "../../types";
import FormField, { inputClass } from "../FormField";

const TYPE_OPTIONS: EventType[] = [
  "Conference",
  "Seminar",
  "Workshop",
  "Guest Lecture",
  "Call for Papers",
];
const LIFECYCLE_OPTIONS: EventLifecycle[] = ["Draft", "Preview", "Published", "Past"];

export default function EventForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: EventItem | null;
  onSave: (e: EventItem) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<EventItem>(
    initial ?? {
      id: `e-${Date.now()}`,
      title: "",
      type: "Seminar",
      date: new Date().toISOString().slice(0, 10),
      location: "",
      registrationLink: "",
      researchArea: "",
      lifecycle: "Draft",
      speakerIds: [],
      updatedAt: new Date().toISOString().slice(0, 10),
    },
  );

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!form.title.trim()) return;
    onSave({ ...form, updatedAt: new Date().toISOString().slice(0, 10) });
  };

  return (
    <form onSubmit={submit}>
      <FormField label="Event title">
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
            onChange={(e) => setForm({ ...form, type: e.target.value as EventType })}
          >
            {TYPE_OPTIONS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Date">
          <input
            type="date"
            className={inputClass}
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
        </FormField>
      </div>
      <FormField label="Location" hint="Leave blank if venue is still to be confirmed.">
        <input
          className={inputClass}
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
        />
      </FormField>
      <FormField label="Registration link">
        <input
          className={inputClass}
          value={form.registrationLink ?? ""}
          onChange={(e) =>
            setForm({ ...form, registrationLink: e.target.value || undefined })
          }
        />
      </FormField>
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Research area">
          <input
            className={inputClass}
            value={form.researchArea}
            onChange={(e) => setForm({ ...form, researchArea: e.target.value })}
          />
        </FormField>
        <FormField label="Status" hint="Draft → Preview → Published workflow">
          <select
            className={inputClass}
            value={form.lifecycle}
            onChange={(e) =>
              setForm({ ...form, lifecycle: e.target.value as EventLifecycle })
            }
          >
            {LIFECYCLE_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </FormField>
      </div>

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
          {initial ? "Save changes" : "Add event"}
        </button>
      </div>
    </form>
  );
}
