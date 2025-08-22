import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import AdminUsers from '../AdminUsers';
import { renderWithProviders } from '@/test/utils';

// Simple mock for the API hooks
vi.mock('@/services/api', () => ({
  useUsers: () => ({
    data: [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        address: '123 Main St',
        role: 'admin',
      }
    ],
    isLoading: false,
    error: null,
  }),
  useDeleteUser: () => ({
    mutateAsync: vi.fn(),
    isPending: false,
  }),
}));

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: vi.fn() }),
}));

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: '2', name: 'Test Admin', role: 'admin' },
  }),
}));

vi.mock('@/components/UserDetail', () => ({
  UserDetail: () => <div data-testid="user-detail-modal" />,
}));

describe('AdminUsers - Basic', () => {
  it('should render the component with basic data', () => {
    renderWithProviders(<AdminUsers />);
    
    expect(screen.getByText('Manage Users')).toBeInTheDocument();
    expect(screen.getByText('View and manage all system users')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
});
