import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../utils/api';
import DynamicForm from '../../../components/DynamicForm';
import { getFormFields } from './config';

export default function CreateUser() {
  const navigate = useNavigate();
  const [roleOptions, setRoleOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch Roles for form options
  useEffect(() => {
    const fetchRoles = async () => {
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
        console.error('Failed to load roles:', err);
      }
    };
    fetchRoles();
  }, []);

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError('');
    try {
      const payload = {
        fullname: formData.fullname,
        email: formData.email,
        password: formData.password,
        phone_number: formData.phone_number || null,
        role_id: formData.role_id ? parseInt(formData.role_id, 10) : null,
        is_active: !!formData.is_active,
      };

      const response = await api.post('/users', payload);
      if (response.data?.success) {
        navigate('/admin/users');
      }
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  const fields = getFormFields(roleOptions).filter((f) => f.name !== 'role_id');

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">New User</h1>
        <p className="text-slate-400 text-sm mt-1">
          Add a new system operator or administrator to the network.
        </p>
      </div>

      <DynamicForm
        title="Account Parameters"
        fields={fields}
        onSubmit={handleSubmit}
        onCancel={() => navigate('/admin/users')}
        loading={loading}
        error={error}
      />
    </div>
  );
}
