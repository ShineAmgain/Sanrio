import { useMemo, useState } from "react";
import PageHeader from "../components/PageHeader";
import FilterBar from "../components/FilterBar";
import Table, { type Column } from "../components/Table";
import Badge from "../components/Badge";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";
import EmptyState from "../components/EmptyState";
import ResearcherForm from "../components/forms/ResearcherForm";
import { useData } from "../context/DataContext";
import type { Researcher } from "../types";
import { Users } from "lucide-react";

export default function Researchers() {
  const { researchers, upsertResearcher, deleteResearcher } = useData();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [areaFilter, setAreaFilter] = useState("");
  const [editing, setEditing] = useState<Researcher | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [toDelete, setToDelete] = useState<Researcher | null>(null);

  const areaOptions = useMemo(
    () => Array.from(new Set(researchers.map((r) => r.researchArea))).sort(),
    [researchers],
  );

  const filtered = researchers.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.department.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || r.status === statusFilter;
    const matchesArea = !areaFilter || r.researchArea === areaFilter;
    return matchesSearch && matchesStatus && matchesArea;
  });

  const columns: Column<Researcher>[] = [
    {
      header: "Name",
      render: (r) => (
        <div>
          <p className="font-semibold">{r.name}</p>
          <p className="text-xs text-navy-800/50">{r.email}</p>
        </div>
      ),
    },
    { header: "Position", render: (r) => r.position },
    { header: "Department", render: (r) => r.department },
    { header: "Research area", render: (r) => r.researchArea },
    { header: "Projects", render: (r) => r.projectIds.length },
    { header: "Status", render: (r) => <Badge>{r.status}</Badge> },
  ];

  return (
    <>
      <PageHeader title="Researchers" />

      <FilterBar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by name, department ..."
        filters={[
          {
            label: "All statuses",
            value: statusFilter,
            options: ["Active", "Invited", "Archived"],
            onChange: setStatusFilter,
          },
          {
            label: "All research areas",
            value: areaFilter,
            options: areaOptions,
            onChange: setAreaFilter,
          },
        ]}
        addLabel="New Researcher"
        onAdd={() => {
          setEditing(null);
          setFormOpen(true);
        }}
      />

      {filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No researchers found"
          description="Try a different search term, or add the first researcher to the directory."
        />
      ) : (
        <Table
          columns={columns}
          rows={filtered}
          onEdit={(r) => {
            setEditing(r);
            setFormOpen(true);
          }}
          onDelete={(r) => setToDelete(r)}
        />
      )}

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? "Edit researcher" : "New researcher"}
      >
        <ResearcherForm
          initial={editing}
          onCancel={() => setFormOpen(false)}
          onSave={(r) => {
            upsertResearcher(r);
            setFormOpen(false);
          }}
        />
      </Modal>

      <ConfirmDialog
        open={!!toDelete}
        onCancel={() => setToDelete(null)}
        onConfirm={() => {
          if (toDelete) deleteResearcher(toDelete.id);
          setToDelete(null);
        }}
        title="Remove researcher?"
        description={`This will remove ${toDelete?.name ?? "this researcher"} from the directory. This can't be undone.`}
      />
    </>
  );
}
