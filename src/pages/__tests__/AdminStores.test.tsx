import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AdminStores from '../AdminStores';
import { renderWithProviders } from '@/test/utils';
import { mockStores } from '@/test/mocks/data';

// Mock the API hooks with different return values
const mockUseStores = vi.fn();
const mockUseDeleteStore = vi.fn();

vi.mock('@/services/api', () => ({
  useStores: () => mockUseStores(),
  useDeleteStore: () => mockUseDeleteStore(),
}));

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: vi.fn() }),
}));

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: '2', name: 'Test Admin', role: 'admin' },
  }),
}));

describe('AdminStores', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Default mock implementations
    mockUseStores.mockReturnValue({
      data: mockStores,
      isLoading: false,
      error: null,
    });

    mockUseDeleteStore.mockReturnValue({
      mutateAsync: vi.fn().mockResolvedValue({}),
      isPending: false,
    });
  });

  it('should render store list with correct data', () => {
    renderWithProviders(<AdminStores />);
    
    expect(screen.getByText('Manage Stores')).toBeInTheDocument();
    expect(screen.getByText('Stores (3)')).toBeInTheDocument();
    expect(screen.getByText('Tech Gadgets')).toBeInTheDocument();
    expect(screen.getByText('Fashion Boutique')).toBeInTheDocument();
    expect(screen.getByText('Home Essentials')).toBeInTheDocument();
  });

  it('should show loading state', () => {
    mockUseStores.mockReturnValue({
      data: [],
      isLoading: true,
      error: null,
    });

    renderWithProviders(<AdminStores />);
    
    expect(screen.getByText('Loading stores...')).toBeInTheDocument();
  });

  it('should show error state', () => {
    mockUseStores.mockReturnValue({
      data: [],
      isLoading: false,
      error: new Error('Failed to fetch stores'),
    });

    renderWithProviders(<AdminStores />);
    
    expect(screen.getByText('Failed to load stores. Please try again later.')).toBeInTheDocument();
  });

  it('should filter stores by search term', async () => {
    renderWithProviders(<AdminStores />);
    
    const searchInput = screen.getByPlaceholderText('Search by name, email, or address...');
    
    // Search for "Tech"
    await userEvent.type(searchInput, 'Tech');
    
    // Check that Tech Gadgets is visible and others are not
    expect(screen.getByText('Tech Gadgets')).toBeInTheDocument();
    expect(screen.queryByText('Fashion Boutique')).not.toBeInTheDocument();
    expect(screen.queryByText('Home Essentials')).not.toBeInTheDocument();
    
    // Check that the count element exists
    const countElement = screen.getByText((content, element) => {
      return content.startsWith('Stores (') && content.endsWith(')');
    });
    expect(countElement).toBeInTheDocument();
  });

  it('should filter stores by category', async () => {
    renderWithProviders(<AdminStores />);
    
    const categoryFilter = screen.getByDisplayValue('All Categories');
    
    // Filter by electronics category
    await userEvent.selectOptions(categoryFilter, 'electronics');
    
    expect(screen.getByText('Stores (1)')).toBeInTheDocument();
    expect(screen.getByText('Tech Gadgets')).toBeInTheDocument();
    expect(screen.queryByText('Fashion Boutique')).not.toBeInTheDocument();
  });

  it('should show no results message when no stores match filters', async () => {
    renderWithProviders(<AdminStores />);
    
    const searchInput = screen.getByPlaceholderText('Search by name, email, or address...');
    
    // Search for non-existent store
    await userEvent.type(searchInput, 'NonExistentStore');
    
    expect(screen.getByText('No stores found matching your criteria.')).toBeInTheDocument();
  });

  it('should show store ratings correctly', () => {
    renderWithProviders(<AdminStores />);
    
    // Check ratings are displayed
    expect(screen.getByText('4.8')).toBeInTheDocument();
    expect(screen.getByText('4.2')).toBeInTheDocument();
    expect(screen.getByText('4.5')).toBeInTheDocument();
  });
});
