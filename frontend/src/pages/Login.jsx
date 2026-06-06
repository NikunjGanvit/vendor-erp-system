import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthForm from '../components/AuthForm';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    setError('');
    setLoading(true);

    const result = await login({
      email: formData.email,
      password: formData.password,
    });

    setLoading(false);
    if (result.success) {
      navigate('/', { replace: true });
    } else {
      setError(result.message);
    }
  };

  const fields = [
    {
      name: 'email',
      label: 'Email Address',
      type: 'email',
      placeholder: 'you@example.com',
      required: true,
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      placeholder: '••••••••',
      required: true,
    },
  ];

  return (
    <AuthForm
      title="Sign In to ERP"
      subtitle="Access your vendor and procurement dashboard"
      fields={fields}
      onSubmit={handleSubmit}
      buttonText="Sign In"
      error={error}
      loading={loading}
      footerText="New to ERP?"
      footerLinkText="Create an account"
      footerLinkTo="/register"
    />
  );
}
