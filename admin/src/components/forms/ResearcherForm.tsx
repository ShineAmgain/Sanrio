import { useState } from "react";
import type { Researcher, ResearcherStatus } from "../../types";
import FormField, { inputClass } from "../FormField";

const STATUS_OPTIONS: ResearcherStatus[] = ["Active", "Invited", "Archived"];

export default function ResearcherForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: Researcher | null;
  onSave: (r: Researcher) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<Researcher>(
    initial ?? {
      id: `r-${Date.now()}`,
      name: "",
      position: "",
      department: "",
      researchArea: "Unassigned",
      projectIds: [],
      status: "Invited",
      email: "",
      updatedAt: new Date().toISOString().slice(0, 10),
    },
  );

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSave({ ...form, updatedAt: new Date().toISOString().slice(0, 10) });
  };

  return (
    <form onSubmit={submit}>
      <FormField label="Full name">
        <input
          required
          className={inputClass}
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      </FormField>
      <FormField label="Email">
        <input
          type="email"
          required
          className={inputClass}
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
      </FormField>
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Position">
          <input
            className={inputClass}
            value={form.position}
            onChange={(e) => setForm({ ...form, position: e.target.value })}
          />
        </FormField>
        <FormField label="Department">
          <input
            className={inputClass}
            value={form.department}
            onChange={(e) => setForm({ ...form, department: e.target.value })}
          />
        </FormField>
      </div>
      <FormField label="Research area" hint='Use "Unassigned" if not yet placed on a project.'>
        <input
          className={inputClass}
          value={form.researchArea}
          onChange={(e) => setForm({ ...form, researchArea: e.target.value })}
        />
      </FormField>
      <FormField label="Status">
        <select
          className={inputClass}
          value={form.status}
          onChange={(e) =>
            setForm({ ...form, status: e.target.value as ResearcherStatus })
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
          {initial ? "Save changes" : "Add researcher"}
        </button>
      </div>
    </form>
  );
}
