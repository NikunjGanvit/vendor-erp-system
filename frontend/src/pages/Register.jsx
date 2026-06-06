import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthForm from '../components/AuthForm';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    setError('');
    setLoading(true);

    const result = await register({
      fullname: formData.fullname,
      email: formData.email,
      password: formData.password,
      phone_number: formData.phone_number || null,
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
      name: 'fullname',
      label: 'Full Name',
      type: 'text',
      placeholder: 'John Doe',
      required: true,
    },
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
    {
      name: 'phone_number',
      label: 'Phone Number (Optional)',
      type: 'tel',
      placeholder: '+1 (555) 000-0000',
      required: false,
    },
  ];

  return (
    <AuthForm
      title="Create ERP Account"
      subtitle="Register to join the vendor management network"
      fields={fields}
      onSubmit={handleSubmit}
      buttonText="Create Account"
      error={error}
      loading={loading}
      footerText="Already have an account?"
      footerLinkText="Sign in"
      footerLinkTo="/login"
    />
  );
}
