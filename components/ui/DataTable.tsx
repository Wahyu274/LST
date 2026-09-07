import React from 'react';

export interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (row: T) => React.ReactNode;
  className?: string;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  isLoading?: boolean;
  emptyText?: string;
  // Pagination
  currentPage?: number;
  totalPages?: number;
  totalRecords?: number;
  onPageChange?: (page: number) => void;
  // Header Actions
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  searchPlaceholder?: string;
  filterElements?: React.ReactNode;
  headerActions?: React.ReactNode;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  isLoading = false,
  emptyText = 'Belum ada data tersedia.',
  currentPage = 1,
  totalPages = 1,
  totalRecords,
  onPageChange,
  searchQuery,
  onSearchChange,
  searchPlaceholder = 'Cari data...',
  filterElements,
  headerActions,
}: DataTableProps<T>) {
  return (
    <div className="space-y-4 font-sans">
      {/* Table Header Filter Bar */}
      {(onSearchChange || filterElements || headerActions) && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 border border-[#E2E8F0] rounded-[10px]">
          <div className="flex flex-wrap items-center gap-3 flex-1">
            {onSearchChange && (
              <div className="relative min-w-[240px] flex-1 max-w-sm">
                <input
                  type="text"
                  value={searchQuery || ''}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="w-full h-10 pl-9 pr-3.5 bg-[#F7F9FC] text-xs text-[#111827] border border-[#E2E8F0] rounded-[8px] focus:outline-none focus:border-[#1769E0] focus:bg-white transition-colors"
                />
                <svg
                  className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            )}
            {filterElements}
          </div>
          {headerActions && <div className="flex items-center gap-2">{headerActions}</div>}
        </div>
      )}

      {/* Table Surface */}
      <div className="bg-white border border-[#E2E8F0] rounded-[10px] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-[#F7F9FC] border-b border-[#E2E8F0] text-[#071426] uppercase font-bold tracking-wider sticky top-0 z-10">
              <tr>
                {columns.map((col, idx) => (
                  <th key={idx} className={`py-3.5 px-4 ${col.className || ''}`}>
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, rIdx) => (
                  <tr key={rIdx} className="animate-pulse">
                    {columns.map((_, cIdx) => (
                      <td key={cIdx} className="py-4 px-4">
                        <div className="h-4 bg-slate-100 rounded-[4px] w-3/4" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="py-12 text-center text-slate-400">
                    <p className="text-sm">{emptyText}</p>
                  </td>
                </tr>
              ) : (
                data.map((row) => (
                  <tr
                    key={keyExtractor(row)}
                    className="hover:bg-[#F7F9FC]/80 transition-colors h-[52px]"
                  >
                    {columns.map((col, cIdx) => (
                      <td key={cIdx} className={`py-3 px-4 text-[#111827] ${col.className || ''}`}>
                        {col.cell
                          ? col.cell(row)
                          : col.accessorKey
                          ? (row[col.accessorKey] as any)
                          : null}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {onPageChange && totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 bg-[#F7F9FC] border-t border-[#E2E8F0] text-xs text-slate-600">
            <div>
              Total: <span className="font-semibold text-[#071426]">{totalRecords ?? data.length}</span> record
            </div>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage <= 1}
                onClick={() => onPageChange(currentPage - 1)}
                className="px-3 py-1.5 bg-white border border-[#E2E8F0] rounded-[6px] text-xs text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Sebelumnya
              </button>
              <span className="font-medium text-[#071426]">
                {currentPage} / {totalPages}
              </span>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                className="px-3 py-1.5 bg-white border border-[#E2E8F0] rounded-[6px] text-xs text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Berikutnya
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
