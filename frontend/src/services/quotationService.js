import api from './api';

export const quotationService = {
  getQuotations: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: 'QT-101', rfqId: 'RFQ-2023-001', vendor: 'Tech Supplies Co.', amount: '$4,500', deliveryTime: '14 Days', rating: 4.8, status: 'Pending' },
          { id: 'QT-102', rfqId: 'RFQ-2023-001', vendor: 'Office Depot', amount: '$4,200', deliveryTime: '10 Days', rating: 4.5, status: 'Pending' },
          { id: 'QT-103', rfqId: 'RFQ-2023-002', vendor: 'Global Logistics', amount: '$12,000', deliveryTime: '30 Days', rating: 4.2, status: 'Approved' },
        ]);
      }, 800);
    });
  },

  submitQuotation: async (quotationData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ ...quotationData, id: `QT-${Math.floor(Math.random() * 1000)}`, status: 'Pending' });
      }, 1000);
    });
  }
};
