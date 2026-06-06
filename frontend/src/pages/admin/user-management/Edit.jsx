import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../../utils/api';
import DynamicForm from '../../../components/DynamicForm';
import { getFormFields } from './config';

export default function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [roleOptions, setRoleOptions] = useState([]);
  const [initialValues, setInitialValues] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');

  // Fetch Roles and User details
  useEffect(() => {
    const fetchData = async () => {
      setFetching(true);
      setError('');
      try {
        // Fetch roles
        const rolesResponse = await api.post('/roles/list', { page: 1, limit: 100 });
        let options = [];
        if (rolesResponse.data?.success && rolesResponse.data?.data?.roles) {
          options = rolesResponse.data.data.roles.map((r) => ({
            value: r.id,
            label: r.role,
          }));
          setRoleOptions(options);
        }

        // Fetch User by ID
        const userResponse = await api.get(`/users/${id}`);
        if (userResponse.data?.success && userResponse.data?.data) {
          const u = userResponse.data.data.user;
          setInitialValues({
            fullname: u.fullname,
            email: u.email,
            password: '', // leave empty by default
            phone_number: u.phone_number || '',
            role_id: u.role_id || '',
            is_active: !!u.is_active,
          });
        }
      } catch (err) {
        setError(err.response?.data?.error?.message || 'Failed to load user information');
      } finally {
        setFetching(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError('');
    try {
      const payload = {
        fullname: formData.fullname,
        email: formData.email,
        phone_number: formData.phone_number || null,
        role_id: formData.role_id ? parseInt(formData.role_id, 10) : null,
        is_active: !!formData.is_active,
      };

      // Only include password if user typed something new
      if (formData.password) {
        payload.password = formData.password;
      }

      const response = await api.patch(`/users/${id}`, payload);
      if (response.data?.success) {
        navigate('/admin/users');
      }
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  const fields = getFormFields(roleOptions).filter(
    (field) => field.name !== 'role_id' && field.name !== 'password'
  );

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">Edit User</h1>
        <p className="text-slate-400 text-sm mt-1">
          Modify account credentials, role assignments, or active status.
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
          title="Account Parameters"
          fields={fields}
          initialValues={initialValues}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/admin/users')}
          loading={loading}
          error={error}
        />
      )}
    </div>
  );
}
