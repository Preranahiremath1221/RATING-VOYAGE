import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { UserDetail } from '../UserDetail';
import { renderWithProviders } from '@/test/utils';
import { mockUsers } from '@/test/mocks/data';

describe('UserDetail', () => {
  it('should render user details with correct name and email', () => {
    const adminUser = mockUsers[0]; // John Doe (admin)
    renderWithProviders(<UserDetail user={adminUser} onClose={vi.fn()} />);
    
    expect(screen.getByText('User Details')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('should render different user types correctly', () => {
    const regularUser = mockUsers[1]; // Jane Smith (user)
    renderWithProviders(<UserDetail user={regularUser} onClose={vi.fn()} />);
    
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
  });

  it('should render store owner with rating information', () => {
    const storeOwner = mockUsers[2]; // Bob Johnson (store-owner)
    
    renderWithProviders(<UserDetail user={storeOwner} onClose={vi.fn()} />);
    
    expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
    expect(screen.getByText('bob@example.com')).toBeInTheDocument();
    expect(screen.getByText('Store Owner Rating')).toBeInTheDocument();
  });

  it('should handle inactive user status', () => {
    const inactiveUser = {
      ...mockUsers[0],
      isActive: false,
    };

    renderWithProviders(<UserDetail user={inactiveUser} onClose={vi.fn()} />);
    
    expect(screen.getByText('Inactive')).toBeInTheDocument();
  });

  it('should handle close button click', async () => {
    const onCloseMock = vi.fn();
    const user = mockUsers[0];
    
    renderWithProviders(<UserDetail user={user} onClose={onCloseMock} />);
    
    // Use a more specific selector to target the actual close button (not the X icon)
    const closeButtons = screen.getAllByText('Close');
    const textCloseButton = closeButtons.find(button => button.textContent === 'Close');
    textCloseButton?.click();
    
    expect(onCloseMock).toHaveBeenCalled();
  });
});
