import React, { useState } from 'react';

export default function DynamicTable({
  columns = [],
  data = [],
  loading = false,
  totalCount = 0,
  page = 1,
  limit = 10,
  onPageChange,
  onLimitChange,
  onSortChange,
  onFilterChange,
  canView = false,
  canEdit = false,
  canDelete = false,
  onView,
  onEdit,
  onDelete,
}) {
  const [visibleColumns, setVisibleColumns] = useState(() => {
    return columns.reduce((acc, col) => {
      acc[col.key] = col.defaultVisible !== false;
      return acc;
    }, {});
  });
  const [showColumnDropdown, setShowColumnDropdown] = useState(false);
  const [activeSort, setActiveSort] = useState({ colId: '', sort: '' }); // { colId: 'fullname', sort: 'asc'|'desc' }
  const [filterValues, setFilterValues] = useState({});
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Toggle Column Visibility
  const toggleColumn = (key) => {
    setVisibleColumns((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Sort Handler
  const handleSort = (colKey, sortable) => {
    if (!sortable || !onSortChange) return;

    let newSort = 'asc';
    if (activeSort.colId === colKey) {
      if (activeSort.sort === 'asc') {
        newSort = 'desc';
      } else if (activeSort.sort === 'desc') {
        newSort = '';
      }
    }

    const sortParam = newSort ? { colId: colKey, sort: newSort } : null;
    setActiveSort({ colId: sortParam ? colKey : '', sort: newSort });
    onSortChange(sortParam ? [sortParam] : []);
  };

  // Filter Handler
  const handleFilterChange = (key, value, operator = 'contains') => {
    const newFilters = { ...filterValues, [key]: { value, operator } };
    if (!value) {
      delete newFilters[key];
    }
    setFilterValues(newFilters);

    if (onFilterChange) {
      const filtersArray = Object.keys(newFilters).map((colKey) => ({
        field: colKey,
        operator: newFilters[colKey].operator,
        value: newFilters[colKey].value,
      }));
      onFilterChange(filtersArray);
    }
  };

  // Render cell helper
  const renderCell = (row, col) => {
    const val = row[col.key];
    if (col.render) {
      return col.render(val, row);
    }
    if (typeof val === 'boolean') {
      return val ? (
        <span className="inline-flex items-center rounded-md bg-emerald-400/10 px-2 py-0.5 text-xs font-semibold text-emerald-400">
          Active
        </span>
      ) : (
        <span className="inline-flex items-center rounded-md bg-slate-800 px-2 py-0.5 text-xs font-semibold text-slate-400">
          Inactive
        </span>
      );
    }
    return val ?? '-';
  };

  const activeCols = columns.filter((col) => visibleColumns[col.key]);
  const hasActions = canView || canEdit || canDelete;

  return (
    <div className="space-y-4 relative">
      {/* Table Actions Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="text-sm text-slate-400">
          Showing <span className="font-semibold text-white">{data.length}</span> of{' '}
          <span className="font-semibold text-white">{totalCount}</span> entries
        </div>

        {/* Column Visibility Control */}
        <div className="relative">
          <button
            onClick={() => setShowColumnDropdown(!showColumnDropdown)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-905 hover:bg-slate-900 border border-slate-800 rounded-xl text-sm font-medium text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
            </svg>
            Columns
          </button>

          {showColumnDropdown && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setShowColumnDropdown(false)}></div>
              <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl p-3 shadow-2xl z-40 space-y-1">
                <div className="text-xs font-semibold text-slate-500 px-2 py-1 mb-1 uppercase tracking-wider">
                  Toggle Columns
                </div>
                {columns.map((col) => (
                  <label
                    key={col.key}
                    className="flex items-center gap-2.5 px-2.5 py-2 hover:bg-slate-800/50 rounded-xl text-sm text-slate-300 hover:text-white cursor-pointer select-none"
                  >
                    <input
                      type="checkbox"
                      checked={!!visibleColumns[col.key]}
                      onChange={() => toggleColumn(col.key)}
                      className="h-4 w-4 rounded border-slate-800 bg-slate-950 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-900 cursor-pointer"
                    />
                    {col.label}
                  </label>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Grid Table Card */}
      <div className="bg-slate-900/40 border border-slate-900 rounded-2xl overflow-hidden shadow-2xl relative">
        <div className="overflow-x-auto min-h-[250px]">
          <table className="w-full text-left border-collapse text-sm text-slate-300">
            <thead className="bg-slate-900/60 text-xs text-slate-400 uppercase tracking-wider border-b border-slate-900">
              <tr>
                {activeCols.map((col) => (
                  <th
                    key={col.key}
                    onClick={() => handleSort(col.key, col.sortable)}
                    className={`p-4 font-semibold select-none ${
                      col.sortable ? 'cursor-pointer hover:text-white transition-colors' : ''
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      {col.label}
                      {col.sortable && (
                        <span className="text-slate-600">
                          {activeSort.colId === col.key ? (
                            activeSort.sort === 'asc' ? '▲' : '▼'
                          ) : '↕'}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
                {hasActions && <th className="p-4 font-semibold text-right">Actions</th>}
              </tr>

              {/* Inline Filters Row */}
              <tr className="bg-slate-950/20 border-b border-slate-905">
                {activeCols.map((col) => (
                  <td key={col.key} className="p-3">
                    {col.filterable && (
                      col.filterType === 'select' ? (
                        <select
                          value={filterValues[col.key]?.value ?? ''}
                          onChange={(e) =>
                            handleFilterChange(col.key, e.target.value, col.filterOperator || 'equals')
                          }
                          className="w-full px-2.5 py-1.5 bg-slate-950/50 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 cursor-pointer"
                        >
                          <option value="">All</option>
                          {col.filterOptions?.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={col.filterType || 'text'}
                          placeholder={`Filter ${col.label.toLowerCase()}...`}
                          value={filterValues[col.key]?.value ?? ''}
                          onChange={(e) =>
                            handleFilterChange(
                              col.key,
                              e.target.value,
                              col.filterOperator || (col.filterType === 'number' ? 'number equals' : 'contains')
                            )
                          }
                          className="w-full px-2.5 py-1.5 bg-slate-950/50 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-650 focus:outline-none focus:border-indigo-500"
                        />
                      )
                    )}
                  </td>
                ))}
                {hasActions && <td></td>}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-900/60">
              {loading ? (
                <tr>
                  <td colSpan={activeCols.length + (hasActions ? 1 : 0)} className="py-20 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <svg className="animate-spin h-8 w-8 text-indigo-500" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="text-sm text-slate-400">Fetching records...</span>
                    </div>
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={activeCols.length + (hasActions ? 1 : 0)} className="py-20 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <svg className="w-10 h-10 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                      <span>No matching records found.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                data.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-900/10 transition-colors">
                    {activeCols.map((col) => (
                      <td key={col.key} className="p-4 text-slate-300 font-medium">
                        {renderCell(row, col)}
                      </td>
                    ))}
                    {hasActions && (
                      <td className="p-4 text-right space-x-1 shrink-0 whitespace-nowrap">
                        {canView && (
                          <button
                            onClick={() => onView && onView(row)}
                            className="px-2.5 py-1.5 bg-slate-950 hover:bg-slate-900 border border-slate-800 rounded-lg text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
                          >
                            View
                          </button>
                        )}
                        {canEdit && (
                          <button
                            onClick={() => onEdit && onEdit(row)}
                            className="px-2.5 py-1.5 bg-indigo-600/10 hover:bg-indigo-650/20 border border-indigo-500/25 rounded-lg text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
                          >
                            Edit
                          </button>
                        )}
                        {canDelete && (
                          <button
                            onClick={() => setDeleteConfirmId(row.id)}
                            className="px-2.5 py-1.5 bg-rose-600/10 hover:bg-rose-650/20 border border-rose-500/25 rounded-lg text-xs font-semibold text-rose-450 hover:text-rose-400 transition-colors cursor-pointer"
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="bg-slate-900/60 p-4 border-t border-slate-900 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Show</span>
            <select
              value={limit}
              onChange={(e) => onLimitChange && onLimitChange(Number(e.target.value))}
              className="bg-slate-950 border border-slate-850 px-2 py-1 rounded-md text-white focus:outline-none cursor-pointer"
            >
              {[5, 10, 20, 50].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <span>entries per page</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange && onPageChange(page - 1)}
              disabled={page <= 1 || loading}
              className="px-3.5 py-1.5 bg-slate-950 hover:bg-slate-900 disabled:opacity-40 disabled:hover:bg-slate-950 border border-slate-800 rounded-lg text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              Prev
            </button>
            <span className="text-xs text-slate-400 font-medium px-2">
              Page <span className="text-white font-bold">{page}</span> of{' '}
              <span className="text-white font-bold">{Math.max(1, Math.ceil(totalCount / limit))}</span>
            </span>
            <button
              onClick={() => onPageChange && onPageChange(page + 1)}
              disabled={page >= Math.ceil(totalCount / limit) || loading}
              className="px-3.5 py-1.5 bg-slate-950 hover:bg-slate-900 disabled:opacity-40 disabled:hover:bg-slate-950 border border-slate-800 rounded-lg text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal Dialog */}
      {deleteConfirmId !== null && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex gap-4">
              <div className="h-10 w-10 shrink-0 bg-rose-500/10 text-rose-450 border border-rose-500/15 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Confirm Deletion</h3>
                <p className="text-sm text-slate-400 mt-1">
                  Are you absolutely sure you want to delete this record? This action is permanent and cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 bg-slate-950 hover:bg-slate-900 border border-slate-850 rounded-xl text-sm font-medium text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (onDelete) {
                    onDelete(deleteConfirmId);
                  }
                  setDeleteConfirmId(null);
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-sm font-semibold transition-colors cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
