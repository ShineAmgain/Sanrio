import { useMemo, useState } from "react";
import PageHeader from "../components/PageHeader";
import FilterBar from "../components/FilterBar";
import Table, { type Column } from "../components/Table";
import Badge from "../components/Badge";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";
import EmptyState from "../components/EmptyState";
import EventForm from "../components/forms/EventForm";
import { useData } from "../context/DataContext";
import type { EventItem } from "../types";
import { formatDate } from "../lib/format";
import { CalendarDays } from "lucide-react";

export default function Events() {
  const { events, upsertEvent, deleteEvent } = useData();

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [editing, setEditing] = useState<EventItem | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [toDelete, setToDelete] = useState<EventItem | null>(null);

  const typeOptions = useMemo(
    () => Array.from(new Set(events.map((e) => e.type))).sort(),
    [events],
  );

  const filtered = events.filter((e) => {
    const matchesSearch = e.title.toLowerCase().includes(search.toLowerCase());
    const matchesType = !typeFilter || e.type === typeFilter;
    const matchesStatus = !statusFilter || e.lifecycle === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const columns: Column<EventItem>[] = [
    {
      header: "Event",
      render: (e) => (
        <div>
          <p className="font-semibold">{e.title}</p>
          <p className="text-xs text-navy-800/50">
            {e.location || "Location not set"}
            {!e.registrationLink && " · No registration link"}
          </p>
        </div>
      ),
    },
    { header: "Type", render: (e) => e.type },
    { header: "Date", render: (e) => formatDate(e.date) },
    { header: "Research area", render: (e) => e.researchArea },
    { header: "Status", render: (e) => <Badge>{e.lifecycle}</Badge> },
  ];

  return (
    <>
      <PageHeader title="Events" />

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
            options: ["Draft", "Preview", "Published", "Past"],
            onChange: setStatusFilter,
          },
        ]}
        addLabel="New Event"
        onAdd={() => {
          setEditing(null);
          setFormOpen(true);
        }}
      />

      {filtered.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="No events found"
          description="Try a different search term, or add the first event record."
        />
      ) : (
        <Table
          columns={columns}
          rows={filtered}
          onEdit={(e) => {
            setEditing(e);
            setFormOpen(true);
          }}
          onDelete={(e) => setToDelete(e)}
        />
      )}

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? "Edit event" : "New event"}
      >
        <EventForm
          initial={editing}
          onCancel={() => setFormOpen(false)}
          onSave={(e) => {
            upsertEvent(e);
            setFormOpen(false);
          }}
        />
      </Modal>

      <ConfirmDialog
        open={!!toDelete}
        onCancel={() => setToDelete(null)}
        onConfirm={() => {
          if (toDelete) deleteEvent(toDelete.id);
          setToDelete(null);
        }}
        title="Remove event?"
        description={`This will remove "${toDelete?.title ?? "this event"}" from the calendar. This can't be undone.`}
      />
    </>
  );
}
