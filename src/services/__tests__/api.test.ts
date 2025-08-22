import { describe, it, expect, vi, beforeEach } from 'vitest';
import { userApi, storeApi } from '../api';
import { mockApiCall, mockApiCallWithError } from '@/test/mocks/api';

// Mock the global fetch
global.fetch = vi.fn();

describe('API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('userApi', () => {
    it('should fetch all users successfully', async () => {
      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiCall('/users'),
      });

      const users = await userApi.getUsers();
      
      expect(fetch).toHaveBeenCalledWith('http://localhost:3001/api/users', {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      expect(users).toHaveLength(4);
      expect(users[0].name).toBe('John Doe');
    });

    it('should fetch user by ID successfully', async () => {
      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiCall('/users/1'),
      });

      const user = await userApi.getUserById('1');
      
      expect(fetch).toHaveBeenCalledWith('http://localhost:3001/api/users/1', {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      expect(user.name).toBe('John Doe');
      expect(user.role).toBe('admin');
    });

    it('should delete user successfully', async () => {
      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: 'User John Doe deleted successfully' }),
      });

      const result = await userApi.deleteUser('1');
      
      expect(fetch).toHaveBeenCalledWith('http://localhost:3001/api/users/1', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      expect(result.message).toContain('deleted successfully');
    });

    it('should handle API errors', async () => {
      (fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ message: 'User not found' }),
      });

      await expect(userApi.getUserById('999')).rejects.toThrow('User not found');
    });

    it('should handle network errors', async () => {
      (fetch as any).mockRejectedValueOnce(new Error('Network error'));

      await expect(userApi.getUsers()).rejects.toThrow('Network error');
    });
  });

  describe('storeApi', () => {
    it('should fetch all stores successfully', async () => {
      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiCall('/stores'),
      });

      const stores = await storeApi.getStores();
      
      expect(fetch).toHaveBeenCalledWith('http://localhost:3001/api/stores', {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      expect(stores).toHaveLength(3);
      expect(stores[0].name).toBe('Tech Gadgets');
    });

    it('should fetch store by ID successfully', async () => {
      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiCall('/stores/store-1'),
      });

      const store = await storeApi.getStoreById('store-1');
      
      expect(fetch).toHaveBeenCalledWith('http://localhost:3001/api/stores/store-1', {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      expect(store.name).toBe('Tech Gadgets');
      expect(store.category).toBe('electronics');
    });

    it('should delete store successfully', async () => {
      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: 'Store Tech Gadgets deleted successfully' }),
      });

      const result = await storeApi.deleteStore('store-1');
      
      expect(fetch).toHaveBeenCalledWith('http://localhost:3001/api/stores/store-1', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      expect(result.message).toContain('deleted successfully');
    });

    it('should handle empty stores array', async () => {
      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ stores: [] }),
      });

      const stores = await storeApi.getStores();
      expect(stores).toEqual([]);
    });

    it('should handle store API errors', async () => {
      (fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ message: 'Store not found' }),
      });

      await expect(storeApi.getStoreById('invalid-id')).rejects.toThrow('Store not found');
    });
  });
});
