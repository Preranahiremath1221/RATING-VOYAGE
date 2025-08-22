import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const API_BASE_URL = 'http://localhost:5000/api';

// Check if we're in development mode and should use mock data
const USE_MOCK_DATA = import.meta.env.DEV;

// Simple mock implementation for development
async function mockApiCall(endpoint: string, options: RequestInit = {}) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 100));

  // Mock users data
  const mockUsers = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      address: '123 Main St, City',
      role: 'admin',
      isActive: true,
      lastLogin: '2024-01-15T10:30:00Z',
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      address: '456 Oak Ave, Town',
      role: 'user',
      isActive: true,
      lastLogin: '2024-01-14T15:45:00Z',
      createdAt: '2023-02-15T00:00:00Z',
      updatedAt: '2024-01-14T15:45:00Z',
    },
    {
      id: '3',
      name: 'Bob Johnson',
      email: 'bob@example.com',
      address: '789 Pine Rd, Village',
      role: 'store-owner',
      storeId: 'store-1',
      isActive: true,
      lastLogin: '2024-01-13T09:15:00Z',
      createdAt: '2023-03-20T00:00:00Z',
      updatedAt: '2024-01-13T09:15:00Z',
    },
    {
      id: '4',
      name: 'Alice Brown',
      email: 'alice@example.com',
      address: '321 Elm St, Hamlet',
      role: 'store-owner',
      storeId: 'store-2',
      isActive: false,
      lastLogin: '2023-12-01T14:20:00Z',
      createdAt: '2023-04-10T00:00:00Z',
      updatedAt: '2023-12-01T14:20:00Z',
    },
  ];

  // Mock responses based on endpoint
  switch (endpoint) {
    case '/users':
      if (options.method === 'POST') {
        // Handle user creation
        const userData = JSON.parse(options.body as string);
        const newUser = {
          id: (mockUsers.length + 1).toString(),
          name: userData.name,
          email: userData.email,
          address: userData.address,
          role: userData.role,
          storeId: userData.storeId || undefined,
          isActive: true,
          lastLogin: undefined,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        mockUsers.push(newUser);
        return newUser;
      }
      return mockUsers;
    
    case '/users/1':
      return mockUsers.find(user => user.id === '1');
    
    case '/users/2':
      return mockUsers.find(user => user.id === '2');
    
    case '/users/3':
      return mockUsers.find(user => user.id === '3');
    
    case '/users/4':
      return mockUsers.find(user => user.id === '4');
    
    default:
      if (endpoint.startsWith('/users/') && options.method === 'DELETE') {
        const userId = endpoint.split('/')[2];
        const user = mockUsers.find(u => u.id === userId);
        if (user) {
          return { message: `User ${user.name} deleted successfully` };
        }
        throw new Error('User not found');
      }
      
      throw new Error(`Mock API endpoint not found: ${endpoint}`);
  }
}

// Generic API call function
async function apiCall(endpoint: string, options: RequestInit = {}) {
  // Use mock data in development
  if (USE_MOCK_DATA) {
    try {
      return await mockApiCall(endpoint, options);
    } catch (error) {
      console.warn('Mock API call failed, falling back to real API:', error);
    }
  }

  // Fall back to real API
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `API error: ${response.status}`);
  }

  return response.json();
}

// User types
export interface User {
  id: string;
  name: string;
  email: string;
  address: string;
  role: 'admin' | 'user' | 'store-owner';
  storeId?: string;
  isActive?: boolean;
  lastLogin?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Store types
export interface Store {
  id: string;
  name: string;
  email: string;
  address: string;
  averageRating: number;
  totalRatings: number;
  category?: string;
  phone?: string;
  website?: string;
  owner?: {
    id: string;
    name: string;
    email: string;
  };
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// User API functions
export const userApi = {
  // Get all users
  getUsers: async (): Promise<User[]> => {
    return apiCall('/users');
  },

  // Get user by ID
  getUserById: async (id: string): Promise<User> => {
    return apiCall(`/users/${id}`);
  },

  // Create user
  createUser: async (userData: Omit<User, 'id' | 'lastLogin' | 'createdAt' | 'updatedAt'> & { password: string }): Promise<User> => {
    return apiCall('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // Delete user
  deleteUser: async (id: string): Promise<{ message: string }> => {
    return apiCall(`/users/${id}`, { method: 'DELETE' });
  },
};

// Store API functions
export const storeApi = {
  // Get all stores
  getStores: async (): Promise<Store[]> => {
    const response = await apiCall('/stores');
    return response.stores || [];
  },

  // Get store by ID
  getStoreById: async (id: string): Promise<Store> => {
    return apiCall(`/stores/${id}`);
  },

  // Delete store
  deleteStore: async (id: string): Promise<{ message: string }> => {
    return apiCall(`/stores/${id}`, { method: 'DELETE' });
  },
};

// React Query hooks for users
export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: userApi.getUsers,
  });
};

export const useUser = (id: string) => {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => userApi.getUserById(id),
    enabled: !!id,
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userApi.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userApi.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

// React Query hooks for stores
export const useStores = () => {
  return useQuery({
    queryKey: ['stores'],
    queryFn: storeApi.getStores,
  });
};

export const useStore = (id: string) => {
  return useQuery({
    queryKey: ['store', id],
    queryFn: () => storeApi.getStoreById(id),
    enabled: !!id,
  });
};

export const useDeleteStore = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: storeApi.deleteStore,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stores'] });
    },
  });
};

// Rating types
export interface Rating {
  id: string;
  user: string;
  store: string;
  rating: number;
  review?: string;
  images?: string[];
  helpfulVotes?: number;
  createdAt?: string;
  updatedAt?: string;
}

// Rating API functions
export const ratingApi = {
  // Create new rating
  createRating: async (ratingData: Omit<Rating, 'id' | 'createdAt' | 'updatedAt'>): Promise<Rating> => {
    return apiCall('/ratings', {
      method: 'POST',
      body: JSON.stringify(ratingData),
    });
  },

  // Update rating
  updateRating: async (id: string, ratingData: Partial<Rating>): Promise<Rating> => {
    return apiCall(`/ratings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(ratingData),
    });
  },

  // Get user's ratings
  getUserRatings: async (): Promise<Rating[]> => {
    return apiCall('/ratings/my-ratings');
  },

  // Get store ratings
  getStoreRatings: async (storeId: string): Promise<Rating[]> => {
    return apiCall(`/ratings?store=${storeId}`);
  },
};

// React Query hooks for ratings
export const useCreateRating = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ratingApi.createRating,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stores'] });
      queryClient.invalidateQueries({ queryKey: ['user-ratings'] });
    },
  });
};

export const useUpdateRating = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & Partial<Rating>) => ratingApi.updateRating(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stores'] });
      queryClient.invalidateQueries({ queryKey: ['user-ratings'] });
    },
  });
};

export const useUserRatings = () => {
  return useQuery({
    queryKey: ['user-ratings'],
    queryFn: ratingApi.getUserRatings,
  });
};

export const useStoreRatings = (storeId: string) => {
  return useQuery({
    queryKey: ['store-ratings', storeId],
    queryFn: () => ratingApi.getStoreRatings(storeId),
    enabled: !!storeId,
  });
};
