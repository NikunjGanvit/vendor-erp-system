import api from './api';

export const vendorService = {
  getVendors: async () => {
    // MOCK IMPLEMENTATION
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: 1, name: 'Tech Supplies Co.', category: 'Electronics', status: 'Active', gst: 'GST123456789', contact: 'john@techsupplies.com' },
          { id: 2, name: 'Global Logistics', category: 'Services', status: 'Pending', gst: 'GST987654321', contact: 'sarah@globallogistics.com' },
          { id: 3, name: 'Office Depot', category: 'Supplies', status: 'Active', gst: 'GST112233445', contact: 'contact@officedepot.com' },
        ]);
      }, 800);
    });
  },

  registerVendor: async (vendorData) => {
    // MOCK IMPLEMENTATION
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ ...vendorData, id: Math.floor(Math.random() * 1000), status: 'Pending' });
      }, 1000);
    });
  }
};
