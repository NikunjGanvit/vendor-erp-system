import api from './api';

export const poInvoiceService = {
  getPOs: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: 'PO-2023-1001', vendor: 'Office Depot', amount: '$4,200', date: '2023-10-15', status: 'Issued' },
          { id: 'PO-2023-1002', vendor: 'Tech Supplies Co.', amount: '$15,000', date: '2023-10-20', status: 'Fulfilled' },
        ]);
      }, 800);
    });
  },

  getInvoices: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: 'INV-001', poId: 'PO-2023-1002', vendor: 'Tech Supplies Co.', amount: '$15,000', date: '2023-10-25', status: 'Paid' },
          { id: 'INV-002', poId: 'PO-2023-1001', vendor: 'Office Depot', amount: '$4,200', date: '2023-10-26', status: 'Pending Payment' },
        ]);
      }, 800);
    });
  },

  generatePO: async (data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ ...data, id: `PO-2023-${Math.floor(Math.random() * 1000) + 2000}`, status: 'Issued', date: new Date().toISOString().split('T')[0] });
      }, 1000);
    });
  },

  generateInvoice: async (poId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ id: `INV-${Math.floor(Math.random() * 1000)}`, poId, amount: 'Auto-Calculated', date: new Date().toISOString().split('T')[0], status: 'Generated' });
      }, 1000);
    });
  }
};
