import api from './api';

const authService = {
  login: async (email, password) => {
    // In a real scenario:
    // const response = await api.post('/auth/login', { email, password });
    // return response.data;

    // MOCK IMPLEMENTATION
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === 'admin@nexus.com' && password === 'admin123') {
          resolve({
            token: 'mock-jwt-token-admin',
            user: { id: 1, name: 'Admin User', email, role: 'Admin' }
          });
        } else if (email === 'procurement@nexus.com') {
          resolve({
             token: 'mock-jwt-token-po',
             user: { id: 2, name: 'PO User', email, role: 'Procurement Officer' }
          });
        } else if (email === 'manager@nexus.com') {
          resolve({
             token: 'mock-jwt-token-manager',
             user: { id: 3, name: 'Manager User', email, role: 'Manager' }
          });
        } else if (email === 'vendor@nexus.com') {
          resolve({
             token: 'mock-jwt-token-vendor',
             user: { id: 4, name: 'Vendor Company', email, role: 'Vendor' }
          });
        } else {
          // generic fallback mock login for testing
          resolve({
            token: 'mock-jwt-token-generic',
            user: { id: 5, name: 'Test User', email, role: 'Admin' }
          });
        }
      }, 1000);
    });
  },

  signup: async (email, password) => {
    // In a real scenario:
    // const response = await api.post('/auth/signup', { email, password });
    // return response.data;

    // MOCK IMPLEMENTATION
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          token: 'mock-jwt-token-new',
          user: { id: 99, name: 'New Workspace', email, role: 'Admin' }
        });
      }, 1500);
    });
  }
};

export default authService;
