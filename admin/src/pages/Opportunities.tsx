import { useMemo, useState } from "react";
import PageHeader from "../components/PageHeader";
import FilterBar from "../components/FilterBar";
import Table, { type Column } from "../components/Table";
import Badge from "../components/Badge";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";
import EmptyState from "../components/EmptyState";
import OpportunityForm from "../components/forms/OpportunityForm";
import { useData } from "../context/DataContext";
import type { Opportunity } from "../types";
import { formatDate } from "../lib/format";
import { Star } from "lucide-react";

export default function Opportunities() {
  const { opportunities, upsertOpportunity, deleteOpportunity } = useData();

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [editing, setEditing] = useState<Opportunity | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [toDelete, setToDelete] = useState<Opportunity | null>(null);

  const typeOptions = useMemo(
    () => Array.from(new Set(opportunities.map((o) => o.type))).sort(),
    [opportunities],
  );

  const filtered = opportunities.filter((o) => {
    const matchesSearch = o.title.toLowerCase().includes(search.toLowerCase());
    const matchesType = !typeFilter || o.type === typeFilter;
    const matchesStatus = !statusFilter || o.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const columns: Column<Opportunity>[] = [
    {
      header: "Opportunity",
      render: (o) => (
        <div>
          <p className="font-semibold">{o.title}</p>
          <p className="text-xs text-navy-800/50">{o.provider}</p>
        </div>
      ),
    },
    { header: "Type", render: (o) => o.type },
    { header: "Research area", render: (o) => o.researchArea },
    { header: "Deadline", render: (o) => formatDate(o.deadline) },
    { header: "Status", render: (o) => <Badge>{o.status}</Badge> },
  ];

  return (
    <>
      <PageHeader title="Opportunities" />

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
            label: "All statuses",
            value: statusFilter,
            options: ["Draft", "Open", "Closing Soon", "Closed"],
            onChange: setStatusFilter,
          },
        ]}
        addLabel="New Opportunity"
        onAdd={() => {
          setEditing(null);
          setFormOpen(true);
        }}
      />

      {filtered.length === 0 ? (
        <EmptyState
          icon={Star}
          title="No opportunities found"
          description="Try a different search term, or add the first opportunity record."
        />
      ) : (
        <Table
          columns={columns}
          rows={filtered}
          onEdit={(o) => {
            setEditing(o);
            setFormOpen(true);
          }}
          onDelete={(o) => setToDelete(o)}
        />
      )}

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? "Edit opportunity" : "New opportunity"}
      >
        <OpportunityForm
          initial={editing}
          onCancel={() => setFormOpen(false)}
          onSave={(o) => {
            upsertOpportunity(o);
            setFormOpen(false);
          }}
        />
      </Modal>

      <ConfirmDialog
        open={!!toDelete}
        onCancel={() => setToDelete(null)}
        onConfirm={() => {
          if (toDelete) deleteOpportunity(toDelete.id);
          setToDelete(null);
        }}
        title="Remove opportunity?"
        description={`This will remove "${toDelete?.title ?? "this opportunity"}" from the list. This can't be undone.`}
      />
    </>
  );
}
