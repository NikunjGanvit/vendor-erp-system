import api from './api';

export const rfqService = {
  getRFQs: async () => {
    // MOCK IMPLEMENTATION
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: 'RFQ-2023-001', title: 'Q3 Office Supplies', items: 12, deadline: '2023-11-15', status: 'Open' },
          { id: 'RFQ-2023-002', title: 'New Laptops for Engineering', items: 50, deadline: '2023-11-20', status: 'Closed' },
          { id: 'RFQ-2023-003', title: 'Annual Cloud Hosting', items: 1, deadline: '2023-12-01', status: 'Reviewing' },
        ]);
      }, 800);
    });
  },

  createRFQ: async (rfqData) => {
    // MOCK IMPLEMENTATION
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ ...rfqData, id: `RFQ-2023-00${Math.floor(Math.random() * 10) + 4}`, status: 'Open' });
      }, 1000);
    });
  }
};
