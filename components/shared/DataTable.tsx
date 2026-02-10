"use client";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/components/ui/pagination";
import { cn } from "@/lib/styles";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import { useState } from "react";

export interface ColumnDef<T> {
  key: string;
  header: string;
  accessor?: (row: T) => unknown;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
}

interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  isLoading?: boolean;
  emptyMessage?: string;
  pagination?: {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
  onSort?: (key: string, direction: "asc" | "desc") => void;
  rowClassName?: (row: T) => string;
}

export function DataTable<T>({
  columns,
  data,
  isLoading = false,
  emptyMessage = "No data found.",
  pagination,
  onSort,
  rowClassName,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  function handleSort(key: string) {
    if (!onSort) return;
    const newDirection =
      sortKey === key && sortDirection === "asc" ? "desc" : "asc";
    setSortKey(key);
    setSortDirection(newDirection);
    onSort(key, newDirection);
  }

  function renderSortIcon(key: string) {
    if (sortKey !== key) return <ChevronsUpDown className="h-3 w-3 ml-1" />;
    return sortDirection === "asc" ? (
      <ChevronUp className="h-3 w-3 ml-1" />
    ) : (
      <ChevronDown className="h-3 w-3 ml-1" />
    );
  }

  if (isLoading) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead key={col.key} className={col.className}>
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, i) => (
            <TableRow key={i}>
              {columns.map((col) => (
                <TableCell key={col.key}>
                  <Skeleton className="h-4 w-full" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500">{emptyMessage}</div>
    );
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead
                key={col.key}
                className={cn(
                  col.sortable && onSort && "cursor-pointer select-none",
                  col.className
                )}
                onClick={
                  col.sortable && onSort
                    ? () => handleSort(col.key)
                    : undefined
                }
              >
                <div className="flex items-center">
                  {col.header}
                  {col.sortable && onSort && renderSortIcon(col.key)}
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, idx) => (
            <TableRow
              key={idx}
              className={rowClassName ? rowClassName(row) : undefined}
            >
              {columns.map((col) => (
                <TableCell key={col.key} className={col.className}>
                  {col.render
                    ? col.render(row)
                    : col.accessor
                      ? String(col.accessor(row) ?? "")
                      : ""}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {pagination && pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={pagination.onPageChange}
        />
      )}
    </div>
  );
}
