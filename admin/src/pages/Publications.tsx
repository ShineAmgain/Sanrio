import { useMemo, useState } from "react";
import PageHeader from "../components/PageHeader";
import FilterBar from "../components/FilterBar";
import Table, { type Column } from "../components/Table";
import Badge from "../components/Badge";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";
import EmptyState from "../components/EmptyState";
import PublicationForm from "../components/forms/PublicationForm";
import { useData } from "../context/DataContext";
import type { Publication } from "../types";
import { SquarePen } from "lucide-react";

export default function Publications() {
  const { publications, researchers, upsertPublication, deletePublication } = useData();

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [areaFilter, setAreaFilter] = useState("");
  const [editing, setEditing] = useState<Publication | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [toDelete, setToDelete] = useState<Publication | null>(null);

  const typeOptions = useMemo(
    () => Array.from(new Set(publications.map((p) => p.type))).sort(),
    [publications],
  );
  const areaOptions = useMemo(
    () => Array.from(new Set(publications.map((p) => p.researchArea))).sort(),
    [publications],
  );

  const authorNames = (ids: string[]) =>
    ids.map((id) => researchers.find((r) => r.id === id)?.name).filter(Boolean).join(", ") || "—";

  const filtered = publications.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchesType = !typeFilter || p.type === typeFilter;
    const matchesArea = !areaFilter || p.researchArea === areaFilter;
    return matchesSearch && matchesType && matchesArea;
  });

  const columns: Column<Publication>[] = [
    {
      header: "Title",
      render: (p) => (
        <div>
          <p className="font-semibold">{p.title}</p>
          <p className="text-xs text-navy-800/50">{authorNames(p.authorIds)}</p>
        </div>
      ),
    },
    { header: "Type", render: (p) => p.type },
    { header: "Year", render: (p) => p.year },
    { header: "Research area", render: (p) => p.researchArea },
    {
      header: "DOI",
      render: (p) =>
        p.doi ? (
          <span className="text-xs text-navy-800/70">{p.doi}</span>
        ) : (
          <Badge tone="warning">Missing DOI</Badge>
        ),
    },
  ];

  return (
    <>
      <PageHeader title="Publications" />

      <FilterBar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by title ..."
        filters={[
          {
            label: "All types",
            value: typeFilter,
            options: typeOptions,
            onChange: setTypeFilter,
          },
          {
            label: "All research areas",
            value: areaFilter,
            options: areaOptions,
            onChange: setAreaFilter,
          },
        ]}
        addLabel="New Publication"
        onAdd={() => {
          setEditing(null);
          setFormOpen(true);
        }}
      />

      {filtered.length === 0 ? (
        <EmptyState
          icon={SquarePen}
          title="No publications found"
          description="Try a different search term, or add the first publication record."
        />
      ) : (
        <Table
          columns={columns}
          rows={filtered}
          onEdit={(p) => {
            setEditing(p);
            setFormOpen(true);
          }}
          onDelete={(p) => setToDelete(p)}
        />
      )}

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? "Edit publication" : "New publication"}
      >
        <PublicationForm
          initial={editing}
          onCancel={() => setFormOpen(false)}
          onSave={(p) => {
            upsertPublication(p);
            setFormOpen(false);
          }}
        />
      </Modal>

      <ConfirmDialog
        open={!!toDelete}
        onCancel={() => setToDelete(null)}
        onConfirm={() => {
          if (toDelete) deletePublication(toDelete.id);
          setToDelete(null);
        }}
        title="Remove publication?"
        description={`This will remove "${toDelete?.title ?? "this publication"}" from the record. This can't be undone.`}
      />
    </>
  );
}
