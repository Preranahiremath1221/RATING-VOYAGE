import { mockUsers, mockStores } from './data';

export const mockApiCall = async (endpoint: string, options: RequestInit = {}) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 100));

  // Mock responses based on endpoint
  switch (endpoint) {
    case '/users':
      return mockUsers;
    
    case '/stores':
      return { stores: mockStores };
    
    case '/users/1':
      return mockUsers.find(user => user.id === '1');
    
    case '/users/2':
      return mockUsers.find(user => user.id === '2');
    
    case '/users/3':
      return mockUsers.find(user => user.id === '3');
    
    case '/users/4':
      return mockUsers.find(user => user.id === '4');
    
    case '/stores/store-1':
      return mockStores.find(store => store.id === 'store-1');
    
    case '/stores/store-2':
      return mockStores.find(store => store.id === 'store-2');
    
    case '/stores/store-3':
      return mockStores.find(store => store.id === 'store-3');
    
    default:
      if (endpoint.startsWith('/users/') && options.method === 'DELETE') {
        const userId = endpoint.split('/')[2];
        const user = mockUsers.find(u => u.id === userId);
        if (user) {
          return { message: `User ${user.name} deleted successfully` };
        }
        throw new Error('User not found');
      }
      
      if (endpoint.startsWith('/stores/') && options.method === 'DELETE') {
        const storeId = endpoint.split('/')[2];
        const store = mockStores.find(s => s.id === storeId);
        if (store) {
          return { message: `Store ${store.name} deleted successfully` };
        }
        throw new Error('Store not found');
      }
      
      throw new Error(`Mock API endpoint not found: ${endpoint}`);
  }
};

export const mockApiCallWithError = async (endpoint: string) => {
  await new Promise(resolve => setTimeout(resolve, 100));
  throw new Error('Network error: Failed to fetch');
};
