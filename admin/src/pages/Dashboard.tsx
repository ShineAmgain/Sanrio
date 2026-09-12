import { useMemo, useState } from "react";
import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";
import AttentionPanel from "../components/AttentionPanel";
import ActivityPanel from "../components/ActivityPanel";
import FilterBar from "../components/FilterBar";
import Table, { type Column } from "../components/Table";
import Badge from "../components/Badge";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";
import ResearcherForm from "../components/forms/ResearcherForm";
import EmptyState from "../components/EmptyState";
import { useData } from "../context/DataContext";
import { getAttentionItems } from "../lib/attention";
import type { Researcher } from "../types";
import { Users } from "lucide-react";

export default function Dashboard() {
  const {
    researchers,
    projects,
    publications,
    events,
    opportunities,
    activity,
    upsertResearcher,
    deleteResearcher,
  } = useData();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [areaFilter, setAreaFilter] = useState("");
  const [editing, setEditing] = useState<Researcher | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [toDelete, setToDelete] = useState<Researcher | null>(null);

  const attentionItems = useMemo(
    () => getAttentionItems({ projects, events, opportunities, publications }),
    [projects, events, opportunities, publications],
  );

  const areaOptions = useMemo(
    () => Array.from(new Set(researchers.map((r) => r.researchArea))).sort(),
    [researchers],
  );

  const filteredResearchers = researchers.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.researchArea.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || r.status === statusFilter;
    const matchesArea = !areaFilter || r.researchArea === areaFilter;
    return matchesSearch && matchesStatus && matchesArea;
  });

  const columns: Column<Researcher>[] = [
    { header: "Name", render: (r) => <span className="font-semibold">{r.name}</span> },
    { header: "Research area", render: (r) => r.researchArea },
    { header: "Projects", render: (r) => r.projectIds.length },
    { header: "Status", render: (r) => <Badge>{r.status}</Badge> },
  ];

  return (
    <>
      <PageHeader title="Dashboard" />

      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard value={researchers.length} label="Researchers" />
        <StatCard value={projects.length} label="Projects" />
        <StatCard value={publications.length} label="Publications" />
        <StatCard value={events.length} label="Events" />
        <StatCard value={opportunities.length} label="Opportunities" />
      </div>

      <div className="mb-9 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <AttentionPanel items={attentionItems} />
        <ActivityPanel entries={activity} />
      </div>

      <h2 className="mb-4 text-2xl font-bold text-navy-800">Manage Records</h2>

      <FilterBar
        searchValue={search}
        onSearchChange={setSearch}
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

      {filteredResearchers.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No researchers match your filters"
          description="Try a different search term, or clear the status and research area filters."
        />
      ) : (
        <Table
          columns={columns}
          rows={filteredResearchers}
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
