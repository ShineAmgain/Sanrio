import Modal from "./Modal";

export default function ConfirmDialog({
  open,
  onCancel,
  onConfirm,
  title,
  description,
}: {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
}) {
  return (
    <Modal open={open} onClose={onCancel} title={title}>
      <p className="text-sm text-navy-800/70">{description}</p>
      <div className="mt-6 flex justify-end gap-3">
        <button
          onClick={onCancel}
          className="rounded-lg px-4 py-2 text-sm font-semibold text-navy-800 hover:bg-navy-50"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="rounded-lg bg-critical-text px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
        >
          Delete
        </button>
      </div>
    </Modal>
  );
}
