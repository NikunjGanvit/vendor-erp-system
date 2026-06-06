import api from './api';

export const approvalService = {
  getApprovals: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: 'APP-001', targetId: 'QT-102', type: 'Quotation', requestor: 'Jane Doe', amount: '$4,200', status: 'Pending Review' },
          { id: 'APP-002', targetId: 'RFQ-2023-004', type: 'RFQ', requestor: 'John Smith', amount: '-', status: 'Approved' },
        ]);
      }, 800);
    });
  },

  updateApproval: async (id, status, remarks) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ id, status, remarks, updated: true });
      }, 1000);
    });
  }
};
