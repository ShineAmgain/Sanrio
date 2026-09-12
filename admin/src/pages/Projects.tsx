import { useMemo, useState } from "react";
import PageHeader from "../components/PageHeader";
import FilterBar from "../components/FilterBar";
import Table, { type Column } from "../components/Table";
import Badge from "../components/Badge";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";
import EmptyState from "../components/EmptyState";
import ProjectForm from "../components/forms/ProjectForm";
import { useData } from "../context/DataContext";
import type { Project } from "../types";
import { formatDate } from "../lib/format";
import { FileText } from "lucide-react";

export default function Projects() {
  const { projects, researcherName, upsertProject, deleteProject } = useData();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [areaFilter, setAreaFilter] = useState("");
  const [editing, setEditing] = useState<Project | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [toDelete, setToDelete] = useState<Project | null>(null);

  const areaOptions = useMemo(
    () => Array.from(new Set(projects.map((p) => p.researchArea))).sort(),
    [projects],
  );

  // surface duplicate project codes so the table itself flags the issue,
  // not just the dashboard's Needs attention panel
  const duplicateCodes = useMemo(() => {
    const counts = new Map<string, number>();
    projects.forEach((p) => counts.set(p.projectCode, (counts.get(p.projectCode) ?? 0) + 1));
    return new Set([...counts].filter(([, n]) => n > 1).map(([code]) => code));
  }, [projects]);

  const filtered = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.projectCode.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || p.status === statusFilter;
    const matchesArea = !areaFilter || p.researchArea === areaFilter;
    return matchesSearch && matchesStatus && matchesArea;
  });

  const columns: Column<Project>[] = [
    {
      header: "Project",
      render: (p) => (
        <div>
          <p className="font-semibold">{p.title}</p>
          <p className="flex items-center gap-1.5 text-xs text-navy-800/50">
            {p.projectCode}
            {duplicateCodes.has(p.projectCode) && (
              <Badge tone="critical">Duplicate ID</Badge>
            )}
          </p>
        </div>
      ),
    },
    { header: "Research area", render: (p) => p.researchArea },
    { header: "Lead researcher", render: (p) => researcherName(p.leadResearcherId) },
    {
      header: "Timeline",
      render: (p) => `${formatDate(p.startDate)} – ${formatDate(p.endDate)}`,
    },
    { header: "Status", render: (p) => <Badge>{p.status}</Badge> },
  ];

  return (
    <>
      <PageHeader title="Projects" />

      <FilterBar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by title, project ID ..."
        filters={[
          {
            label: "All statuses",
            value: statusFilter,
            options: ["Proposed", "Ongoing", "Completed", "Archived"],
            onChange: setStatusFilter,
          },
          {
            label: "All research areas",
            value: areaFilter,
            options: areaOptions,
            onChange: setAreaFilter,
          },
        ]}
        addLabel="New Project"
        onAdd={() => {
          setEditing(null);
          setFormOpen(true);
        }}
      />

      {filtered.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No projects found"
          description="Try a different search term, or add the first project record."
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
        title={editing ? "Edit project" : "New project"}
      >
        <ProjectForm
          initial={editing}
          onCancel={() => setFormOpen(false)}
          onSave={(p) => {
            upsertProject(p);
            setFormOpen(false);
          }}
        />
      </Modal>

      <ConfirmDialog
        open={!!toDelete}
        onCancel={() => setToDelete(null)}
        onConfirm={() => {
          if (toDelete) deleteProject(toDelete.id);
          setToDelete(null);
        }}
        title="Archive project?"
        description={`This will remove ${toDelete?.title ?? "this project"} from the active list. This can't be undone.`}
      />
    </>
  );
}
