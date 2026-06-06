import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../utils/api';
import DynamicTable from '../../../components/DynamicTable';
import { getTableColumns } from './config';

export default function UserList() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [roleOptions, setRoleOptions] = useState([]);
  
  // Table state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sort, setSort] = useState([]);
  const [filters, setFilters] = useState([]);
  const [globalSearch, setGlobalSearch] = useState('');
  const [error, setError] = useState('');

  // Role Assignment modal state
  const [assigningUser, setAssigningUser] = useState(null); // { id, role_id, fullname }
  const [selectedRoleId, setSelectedRoleId] = useState('');

  // Fetch Roles for filter/modal options
  const fetchRoles = useCallback(async () => {
    try {
      const response = await api.post('/roles/list', { page: 1, limit: 100 });
      if (response.data?.success && response.data?.data?.roles) {
        const options = response.data.data.roles.map((r) => ({
          value: r.id,
          label: r.role,
        }));
        setRoleOptions(options);
      }
    } catch (err) {
      console.error('Failed to fetch roles:', err);
    }
  }, []);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  // Fetch Users
  const fetchUsers = useCallback(async () => {
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
      const response = await api.post('/users/list', payload);
      if (response.data?.success && response.data?.data) {
        setData(response.data.data.users || []);
        setTotalCount(response.data.data.totalCount || 0);
      }
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [page, limit, sort, filters, globalSearch]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Sort Handler
  const handleSortChange = (newSort) => {
    setSort(newSort);
    setPage(1);
  };

  // Filter Handler
  const rawColumns = getTableColumns(roleOptions);
  
  // Override the role rendering to append the "Assign" button
  const columns = rawColumns.map((col) => {
    if (col.key === 'role') {
      return {
        ...col,
        render: (val, row) => (
          <div className="flex items-center gap-2">
            {val ? (
              <span className="inline-flex items-center rounded-md bg-indigo-400/10 px-2.5 py-0.5 text-xs font-semibold text-indigo-400">
                {val}
              </span>
            ) : (
              <span className="text-slate-500 text-xs">No Role</span>
            )}
            <button
              onClick={() => {
                setAssigningUser({
                  id: row.id,
                  role_id: row.role_id || '',
                  fullname: row.fullname,
                });
                setSelectedRoleId(row.role_id || '');
              }}
              className="px-2 py-1 bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-indigo-500/30 rounded-lg text-[10px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
            >
              Assign
            </button>
          </div>
        ),
      };
    }
    return col;
  });

  const handleFilterChange = (newFilters) => {
    const mapped = newFilters.map((f) => {
      const col = columns.find((c) => c.key === f.field);
      let val = f.value;
      if (f.field === 'is_active') {
        val = f.value === 'true';
      }
      return {
        field: col?.keyFilter || f.field,
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
      const response = await api.delete(`/users/${id}`);
      if (response.data?.success) {
        fetchUsers();
      }
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to delete user');
    }
  };

  // Assign Role Submission
  const handleAssignRoleSubmit = async () => {
    setError('');
    try {
      const payload = {
        userId: assigningUser.id,
        roleId: selectedRoleId ? parseInt(selectedRoleId, 10) : null,
      };
      const response = await api.post('/admin/assign-role', payload);
      if (response.data?.success) {
        setAssigningUser(null);
        fetchUsers();
      }
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to assign role');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">User Management</h1>
          <p className="text-slate-400 text-sm mt-1">
            Create, update, and search procurement system users.
          </p>
        </div>
        <button
          onClick={() => navigate('/admin/users/create')}
          className="px-5 py-2.5 bg-indigo-650 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
        >
          Create User
        </button>
      </div>

      {/* Global Search & Alerts */}
      <div className="space-y-4">
        {error && (
          <div className="rounded-lg bg-rose-500/10 border border-rose-500/20 p-4 text-sm font-medium text-rose-200 animate-in fade-in slide-in-from-top-2">
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
              placeholder="Global search by name, email, or phone number..."
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
        onView={(row) => navigate(`/admin/users/view/${row.id}`)}
        onEdit={(row) => navigate(`/admin/users/edit/${row.id}`)}
        onDelete={handleDelete}
      />

      {/* Role Assignment Modal */}
      {assigningUser !== null && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div>
              <h3 className="text-lg font-bold text-white">Assign Access Role</h3>
              <p className="text-sm text-slate-400 mt-1">
                Select an access role to assign to <span className="text-indigo-400 font-semibold">{assigningUser.fullname}</span>.
              </p>
            </div>

            <div>
              <label htmlFor="role-select" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                System Role
              </label>
              <select
                id="role-select"
                value={selectedRoleId}
                onChange={(e) => setSelectedRoleId(e.target.value)}
                className="block w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 cursor-pointer"
              >
                <option value="">No Role (Unassigned)</option>
                {roleOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-800/60">
              <button
                onClick={() => setAssigningUser(null)}
                className="px-4 py-2 bg-slate-950 hover:bg-slate-900 border border-slate-850 rounded-xl text-sm font-medium text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignRoleSubmit}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-550 text-white rounded-xl text-sm font-semibold transition-colors cursor-pointer"
              >
                Save Assignment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
