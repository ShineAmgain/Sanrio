import { useState } from "react";
import type { Project, ProjectStatus } from "../../types";
import { useData } from "../../context/DataContext";
import FormField, { inputClass } from "../FormField";

const STATUS_OPTIONS: ProjectStatus[] = [
  "Proposed",
  "Ongoing",
  "Completed",
  "Archived",
];

export default function ProjectForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: Project | null;
  onSave: (p: Project) => void;
  onCancel: () => void;
}) {
  const { researchers } = useData();
  const [form, setForm] = useState<Project>(
    initial ?? {
      id: `p-${Date.now()}`,
      projectCode: "",
      title: "",
      researchArea: "",
      status: "Proposed",
      leadResearcherId: researchers[0]?.id ?? "",
      teamIds: [],
      startDate: new Date().toISOString().slice(0, 10),
      endDate: new Date().toISOString().slice(0, 10),
      description: "",
      updatedAt: new Date().toISOString().slice(0, 10),
    },
  );

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.projectCode.trim()) return;
    onSave({ ...form, updatedAt: new Date().toISOString().slice(0, 10) });
  };

  const dateOrderInvalid = new Date(form.endDate) < new Date(form.startDate);

  return (
    <form onSubmit={submit}>
      <FormField label="Project title">
        <input
          required
          className={inputClass}
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
      </FormField>
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Project ID" hint="e.g. RD-2026-014">
          <input
            required
            className={inputClass}
            value={form.projectCode}
            onChange={(e) => setForm({ ...form, projectCode: e.target.value })}
          />
        </FormField>
        <FormField label="Research area">
          <input
            className={inputClass}
            value={form.researchArea}
            onChange={(e) => setForm({ ...form, researchArea: e.target.value })}
          />
        </FormField>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Status">
          <select
            className={inputClass}
            value={form.status}
            onChange={(e) =>
              setForm({ ...form, status: e.target.value as ProjectStatus })
            }
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Lead researcher">
          <select
            className={inputClass}
            value={form.leadResearcherId}
            onChange={(e) =>
              setForm({ ...form, leadResearcherId: e.target.value })
            }
          >
            {researchers.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </FormField>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Start date">
          <input
            type="date"
            className={inputClass}
            value={form.startDate}
            onChange={(e) => setForm({ ...form, startDate: e.target.value })}
          />
        </FormField>
        <FormField
          label="End date"
          hint={dateOrderInvalid ? "End date is before the start date." : undefined}
        >
          <input
            type="date"
            className={`${inputClass} ${dateOrderInvalid ? "border-critical-text" : ""}`}
            value={form.endDate}
            onChange={(e) => setForm({ ...form, endDate: e.target.value })}
          />
        </FormField>
      </div>
      <FormField label="Description">
        <textarea
          rows={3}
          className={inputClass}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
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
          {initial ? "Save changes" : "Add project"}
        </button>
      </div>
    </form>
  );
}
