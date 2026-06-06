import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../utils/api';
import DynamicForm from '../../../components/DynamicForm';
import { getFormFields } from './config';

export default function CreateRole() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError('');
    try {
      const payload = {
        role: formData.role,
        is_active: !!formData.is_active,
      };

      const response = await api.post('/roles', payload);
      if (response.data?.success) {
        navigate('/admin/roles');
      }
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to create system role');
    } finally {
      setLoading(false);
    }
  };

  const fields = getFormFields();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">Create New Role</h1>
        <p className="text-slate-400 text-sm mt-1">
          Add a new authorization group to the permission classification system.
        </p>
      </div>

      <DynamicForm
        title="Role Parameters"
        fields={fields}
        onSubmit={handleSubmit}
        onCancel={() => navigate('/admin/roles')}
        loading={loading}
        error={error}
      />
    </div>
  );
}
