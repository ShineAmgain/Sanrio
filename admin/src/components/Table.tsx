import { SquarePen, Trash2 } from "lucide-react";
import type { ReactNode } from "react";

export interface Column<T> {
  header: string;
  render: (row: T) => ReactNode;
  className?: string;
}

export default function Table<T extends { id: string }>({
  columns,
  rows,
  onEdit,
  onDelete,
}: {
  columns: Column<T>[];
  rows: T[];
  onEdit: (row: T) => void;
  onDelete: (row: T) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] border-collapse text-sm">
        <thead>
          <tr className="text-left">
            {columns.map((col) => (
              <th
                key={col.header}
                className="whitespace-nowrap px-3 pb-3 font-bold text-navy-800"
              >
                {col.header}
              </th>
            ))}
            <th className="w-20" />
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.id}
              className="border-t border-navy-800/10 hover:bg-navy-50/60"
            >
              {columns.map((col) => (
                <td
                  key={col.header}
                  className={`px-3 py-3.5 align-middle text-navy-800 ${col.className ?? ""}`}
                >
                  {col.render(row)}
                </td>
              ))}
              <td className="px-3 py-3.5 text-right">
                <div className="flex justify-end gap-1">
                  <button
                    onClick={() => onEdit(row)}
                    aria-label="Edit"
                    className="rounded-md p-1.5 text-navy-800 hover:bg-navy-100"
                  >
                    <SquarePen size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(row)}
                    aria-label="Delete"
                    className="rounded-md p-1.5 text-navy-800 hover:bg-navy-100"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
