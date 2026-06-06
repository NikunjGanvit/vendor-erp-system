import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../utils/api';
import DynamicTable from '../../../components/DynamicTable';
import { getTableColumns } from './config';

export default function RoleList() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Table state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sort, setSort] = useState([]);
  const [filters, setFilters] = useState([]);
  const [globalSearch, setGlobalSearch] = useState('');
  const [error, setError] = useState('');

  // Fetch Roles
  const fetchRoles = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const payload = {
        page,
        limit,
        sort,
        filters,
        globalSearch,
      };
      const response = await api.post('/roles/list', payload);
      if (response.data?.success && response.data?.data) {
        setData(response.data.data.roles || []);
        setTotalCount(response.data.data.totalCount || 0);
      }
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to load roles');
    } finally {
      setLoading(false);
    }
  }, [page, limit, sort, filters, globalSearch]);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  // Sort Handler
  const handleSortChange = (newSort) => {
    setSort(newSort);
    setPage(1);
  };

  // Filter Handler
  const columns = getTableColumns();
  const handleFilterChange = (newFilters) => {
    const mapped = newFilters.map((f) => {
      let val = f.value;
      if (f.field === 'is_active') {
        val = f.value === 'true';
      }
      return {
        field: f.field,
        operator: f.operator,
        value: val,
      };
    });
    setFilters(mapped);
    setPage(1);
  };

  // Delete Handler
  const handleDelete = async (id) => {
    setError('');
    try {
      const response = await api.delete(`/roles/${id}`);
      if (response.data?.success) {
        fetchRoles();
      }
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to delete role');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">System Roles</h1>
          <p className="text-slate-400 text-sm mt-1">
            Configure authorization groups, accessibility tags, and system ranks.
          </p>
        </div>
        <button
          onClick={() => navigate('/admin/roles/create')}
          className="px-5 py-2.5 bg-indigo-650 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
        >
          Create Role
        </button>
      </div>

      {/* Global Search & Alerts */}
      <div className="space-y-4">
        {error && (
          <div className="rounded-lg bg-rose-500/10 border border-rose-500/20 p-4 text-sm font-medium text-rose-250 animate-in fade-in slide-in-from-top-2">
            {error}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative w-full max-w-md">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Global search by role designation name..."
              value={globalSearch}
              onChange={(e) => {
                setGlobalSearch(e.target.value);
                setPage(1);
              }}
              className="block w-full pl-10 pr-4 py-2.5 bg-slate-900/40 border border-slate-900 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200"
            />
          </div>
        </div>
      </div>

      {/* Dynamic Data Grid */}
      <DynamicTable
        columns={columns}
        data={data}
        loading={loading}
        totalCount={totalCount}
        page={page}
        limit={limit}
        onPageChange={setPage}
        onLimitChange={setLimit}
        onSortChange={handleSortChange}
        onFilterChange={handleFilterChange}
        canView={true}
        canEdit={true}
        canDelete={true}
        onView={(row) => navigate(`/admin/roles/view/${row.id}`)}
        onEdit={(row) => navigate(`/admin/roles/edit/${row.id}`)}
        onDelete={handleDelete}
      />
    </div>
  );
}
