import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import { vi } from 'vitest';

// Create a custom render function that includes providers
export function renderWithProviders(ui: ReactNode) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      {ui}
    </QueryClientProvider>
  );
}

// Create a test query client
export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
}

// Mock toast function
export const mockToast = {
  toast: vi.fn(),
};

// Mock auth context
export const mockAuthContext = {
  user: {
    id: '1',
    name: 'Test Admin',
    email: 'admin@test.com',
    role: 'admin' as const,
  },
  login: vi.fn(),
  logout: vi.fn(),
  isLoading: false,
};
