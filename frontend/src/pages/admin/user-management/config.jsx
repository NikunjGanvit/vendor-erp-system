import React from 'react';

export const getFormFields = (roleOptions = []) => [
  {
    name: 'fullname',
    label: 'Full Name',
    type: 'text',
    required: true,
    placeholder: 'John Doe',
    fullWidth: false,
  },
  {
    name: 'email',
    label: 'Email Address',
    type: 'email',
    required: true,
    placeholder: 'john@example.com',
    fullWidth: false,
  },
  {
    name: 'password',
    label: 'Password',
    type: 'password',
    required: true,
    placeholder: '••••••••',
    fullWidth: false,
  },
  {
    name: 'phone_number',
    label: 'Phone Number',
    type: 'tel',
    required: false,
    placeholder: '+1 (555) 000-0000',
    fullWidth: false,
  },
  {
    name: 'role_id',
    label: 'Access Role',
    type: 'select',
    required: false,
    options: roleOptions,
    fullWidth: false,
  },
  {
    name: 'is_active',
    label: 'Mark as Active User',
    type: 'checkbox',
    required: false,
    description: 'Deactivated accounts cannot authenticate or complete transactions.',
    fullWidth: true,
  },
];

export const getTableColumns = (roleOptions = []) => [
  {
    key: 'fullname',
    label: 'Name',
    sortable: true,
    filterable: true,
    defaultVisible: true,
  },
  {
    key: 'email',
    label: 'Email',
    sortable: true,
    filterable: true,
    defaultVisible: true,
  },
  {
    key: 'phone_number',
    label: 'Phone Number',
    sortable: true,
    filterable: true,
    defaultVisible: true,
  },
  {
    key: 'role',
    label: 'Access Role',
    sortable: false,
    filterable: true,
    keyFilter: 'role_id', // key to send to backend filter builder
    filterType: 'select',
    filterOperator: 'number equals',
    filterOptions: roleOptions,
    defaultVisible: true,
    render: (val, row) => {
      if (!val) return <span className="text-slate-500 text-xs">No Role</span>;
      return (
        <span className="inline-flex items-center rounded-md bg-indigo-400/10 px-2 py-0.5 text-xs font-semibold text-indigo-400">
          {val}
        </span>
      );
    },
  },
  {
    key: 'is_active',
    label: 'Status',
    sortable: false,
    filterable: true,
    filterType: 'select',
    filterOperator: 'equals',
    filterOptions: [
      { value: 'true', label: 'Active' },
      { value: 'false', label: 'Inactive' },
    ],
    defaultVisible: true,
  },
];
