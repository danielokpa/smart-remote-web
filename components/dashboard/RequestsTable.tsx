"use client";

import clsx from "clsx";
import { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";

export interface TableColumn<T> {
  key: keyof T | string;
  title: string;
  align?: "left" | "center" | "right";
  width?: string;
  render?: (row: T) => ReactNode;
  className?: string;
}

interface RequestsTableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  loading?: boolean;
  skeleton?: ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
  onRowClick?: (row: T) => void;
  rowKey: (row: T) => string;
  rowClassName?: string;
}

function getAlignment(align?: "left" | "center" | "right") {
  switch (align) {
    case "center":
      return {
        th: "text-center",
        td: "text-center",
        wrapper: "justify-center",
      };

    case "right":
      return {
        th: "text-right",
        td: "text-right",
        wrapper: "justify-end",
      };

    default:
      return {
        th: "text-left",
        td: "text-left",
        wrapper: "justify-start",
      };
  }
}

export default function RequestsTable<T>({
  columns,
  data,
  loading,
  skeleton,
  emptyTitle = "No data found",
  emptyDescription = "There is currently no data available.",
  onRowClick,
  rowKey,
  rowClassName,
}: RequestsTableProps<T>) {
  return (
    <div className="rounded-2xl bg-[#251a34] border border-white/10 overflow-hidden">
      <div className="relative overflow-x-auto">
        <table className="w-full min-w-[720px]">
          {/* ================= HEAD ================= */}
          <thead className="bg-white/[0.02] border-b border-white/10">
            <tr>
              {columns.map((column) => {
                const align = getAlignment(column.align);

                return (
                  <th
                    key={String(column.key)}
                    className={clsx(
                      "px-6 py-4 text-sm font-semibold text-white whitespace-nowrap",
                      align.th,
                      column.className
                    )}
                    style={{
                      width: column.width,
                    }}
                  >
                    {column.title}
                  </th>
                );
              })}
            </tr>
          </thead>

          {/* ================= BODY ================= */}
          <tbody>
            {/* Loading */}
            {loading && skeleton}

            {/* Empty */}
            {!loading && data.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-14 text-center"
                >
                  <p className="text-white font-semibold text-[15px]">
                    {emptyTitle}
                  </p>

                  <p className="text-[#8E94A4] text-sm mt-1">
                    {emptyDescription}
                  </p>
                </td>
              </tr>
            )}

            {/* Rows */}
            {!loading &&
              data.map((row) => (
                <tr
                  key={rowKey(row)}
                  onClick={() => onRowClick?.(row)}
                  className={clsx(
                    `
                    border-b border-white/5
                    hover:bg-white/[0.03]
                    transition-all duration-200
                  `,
                    onRowClick && "cursor-pointer group",
                    rowClassName
                  )}
                >
                  {columns.map((column) => {
                    const align = getAlignment(column.align);

                    return (
                      <td
                        key={String(column.key)}
                        className={clsx(
                          "px-6 py-5 text-sm text-white",
                          align.td,
                          column.className
                        )}
                      >
                        <div
                          className={clsx(
                            "flex items-center",
                            align.wrapper
                          )}
                        >
                          {column.render
                            ? column.render(row)
                            : String(
                                row[column.key as keyof T] ?? "—"
                              )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}