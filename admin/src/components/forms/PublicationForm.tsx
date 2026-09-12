import { useState } from "react";
import type { Publication, PublicationType } from "../../types";
import { useData } from "../../context/DataContext";
import FormField, { inputClass } from "../FormField";

const TYPE_OPTIONS: PublicationType[] = [
  "Journal Article",
  "Conference Paper",
  "Book Chapter",
  "Research Report",
  "Working Paper",
];

export default function PublicationForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: Publication | null;
  onSave: (p: Publication) => void;
  onCancel: () => void;
}) {
  const { researchers, projects } = useData();
  const [form, setForm] = useState<Publication>(
    initial ?? {
      id: `pub-${Date.now()}`,
      title: "",
      authorIds: [],
      year: new Date().getFullYear(),
      type: "Journal Article",
      researchArea: "",
      venue: "",
      updatedAt: new Date().toISOString().slice(0, 10),
    },
  );

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    onSave({ ...form, updatedAt: new Date().toISOString().slice(0, 10) });
  };

  const toggleAuthor = (id: string) => {
    setForm((f) => ({
      ...f,
      authorIds: f.authorIds.includes(id)
        ? f.authorIds.filter((a) => a !== id)
        : [...f.authorIds, id],
    }));
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
              setForm({ ...form, type: e.target.value as PublicationType })
            }
          >
            {TYPE_OPTIONS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Year">
          <input
            type="number"
            className={inputClass}
            value={form.year}
            onChange={(e) => setForm({ ...form, year: Number(e.target.value) })}
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
        <FormField label="Venue">
          <input
            className={inputClass}
            value={form.venue}
            onChange={(e) => setForm({ ...form, venue: e.target.value })}
          />
        </FormField>
      </div>
      <FormField label="DOI" hint="Leave blank if not yet assigned.">
        <input
          className={inputClass}
          value={form.doi ?? ""}
          onChange={(e) => setForm({ ...form, doi: e.target.value || undefined })}
        />
      </FormField>
      <FormField label="Related project">
        <select
          className={inputClass}
          value={form.relatedProjectId ?? ""}
          onChange={(e) =>
            setForm({ ...form, relatedProjectId: e.target.value || undefined })
          }
        >
          <option value="">None</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title}
            </option>
          ))}
        </select>
      </FormField>
      <FormField label="Authors">
        <div className="flex flex-wrap gap-2">
          {researchers.map((r) => (
            <button
              type="button"
              key={r.id}
              onClick={() => toggleAuthor(r.id)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                form.authorIds.includes(r.id)
                  ? "bg-navy-800 text-white"
                  : "bg-navy-50 text-navy-800"
              }`}
            >
              {r.name}
            </button>
          ))}
        </div>
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
          {initial ? "Save changes" : "Add publication"}
        </button>
      </div>
    </form>
  );
}
