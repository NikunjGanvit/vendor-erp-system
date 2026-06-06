import React from 'react';

export const getFormFields = () => [
  {
    name: 'role',
    label: 'Role Name',
    type: 'text',
    required: true,
    placeholder: 'Manager, Operator, Auditor...',
    fullWidth: false,
  },
  {
    name: 'is_active',
    label: 'Mark as Active Role',
    type: 'checkbox',
    required: false,
    description: 'Deactivated roles cannot be assigned to new system users.',
    fullWidth: true,
  },
];

export const getTableColumns = () => [
  {
    key: 'role',
    label: 'Role Designation',
    sortable: true,
    filterable: true,
    defaultVisible: true,
  },
  {
    key: 'is_active',
    label: 'Active Status',
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
