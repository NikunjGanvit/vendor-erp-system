import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../../utils/api';
import DynamicForm from '../../../components/DynamicForm';
import { getFormFields } from './config';

export default function EditRole() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');

  // Fetch Role details
  useEffect(() => {
    const fetchRole = async () => {
      setFetching(true);
      setError('');
      try {
        const response = await api.get(`/roles/${id}`);
        if (response.data?.success && response.data?.data?.role) {
          const r = response.data.data.role;
          setInitialValues({
            role: r.role,
            is_active: !!r.is_active,
          });
        }
      } catch (err) {
        setError(err.response?.data?.error?.message || 'Failed to load role details');
      } finally {
        setFetching(false);
      }
    };
    fetchRole();
  }, [id]);

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError('');
    try {
      const payload = {
        role: formData.role,
        is_active: !!formData.is_active,
      };

      const response = await api.patch(`/roles/${id}`, payload);
      if (response.data?.success) {
        navigate('/admin/roles');
      }
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to update system role');
    } finally {
      setLoading(false);
    }
  };

  const fields = getFormFields();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">Edit Role</h1>
        <p className="text-slate-400 text-sm mt-1">
          Modify authorization settings or toggled activation status of this system role.
        </p>
      </div>

      {fetching ? (
        <div className="py-20 text-center">
          <svg className="animate-spin h-8 w-8 text-indigo-500 mx-auto" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-sm text-slate-400 block mt-3">Loading details...</span>
        </div>
      ) : (
        <DynamicForm
          title="Role Parameters"
          fields={fields}
          initialValues={initialValues}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/admin/roles')}
          loading={loading}
          error={error}
        />
      )}
    </div>
  );
}
