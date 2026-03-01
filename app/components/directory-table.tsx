"use client";

import { useMemo, useState } from "react";

type DirectoryRow = {
  id: number;
  name: string;
  union: string;
  position: string;
  phone: string;
  email: string;
};

type DirectoryTableProps = {
  rows: DirectoryRow[];
  pageSize?: number;
};

export default function DirectoryTable({ rows, pageSize = 6 }: DirectoryTableProps) {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));

  const pagedRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return rows.slice(start, start + pageSize);
  }, [page, pageSize, rows]);

  const startIndex = rows.length === 0 ? 0 : (page - 1) * pageSize + 1;
  const endIndex = Math.min(page * pageSize, rows.length);

  return (
    <div>
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-100 text-slate-700">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">LGA / Union</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Email</th>
            </tr>
          </thead>
          <tbody>
            {pagedRows.map((row) => (
              <tr key={row.id} className="border-t border-slate-100">
                <td className="px-4 py-3">{row.id}</td>
                <td className="px-4 py-3 font-medium text-slate-900">{row.name}</td>
                <td className="px-4 py-3">{row.union}</td>
                <td className="px-4 py-3">{row.position}</td>
                <td className="px-4 py-3 whitespace-nowrap">{row.phone}</td>
                <td className="px-4 py-3">{row.email || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-col gap-3 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
        <p>
          Showing {startIndex}-{endIndex} of {rows.length}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={page === 1}
            className="rounded-full border border-slate-300 px-4 py-2 font-medium text-slate-700 transition hover:border-red-600 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Prev
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, index) => {
              const pageNumber = index + 1;
              const isActive = pageNumber === page;

              return (
                <button
                  key={pageNumber}
                  type="button"
                  onClick={() => setPage(pageNumber)}
                  className={`h-9 w-9 rounded-full text-sm font-semibold transition ${
                    isActive
                      ? "bg-red-600 text-white"
                      : "border border-slate-300 text-slate-700 hover:border-red-600 hover:text-red-700"
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={page === totalPages}
            className="rounded-full border border-slate-300 px-4 py-2 font-medium text-slate-700 transition hover:border-red-600 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
