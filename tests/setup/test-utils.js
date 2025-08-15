// ===============================================
// 📁 tests/setup/test-utils.js
import { render } from '@testing-library/react'
import { AuthProvider } from '@/context/AuthProvider'
import { ToastProvider } from '@/context/ToastProvider'

// Wrapper personnalisé avec tous les providers
const AllTheProviders = ({ children }) => {
  return (
    <AuthProvider>
      <ToastProvider>
        {children}
      </ToastProvider>
    </AuthProvider>
  )
}

const customRender = (ui, options) =>
  render(ui, { wrapper: AllTheProviders, ...options })

// Re-export everything
export * from '@testing-library/react'

// Override render method
export { customRender as render }

// Utilitaires de test
export const createMockUser = (overrides = {}) => ({
  id: 1,
  name: 'Test User',
  email: 'test@example.com',
  username: 'testuser',
  role: 'reader',
  ...overrides
})

export const createMockArticle = (overrides = {}) => ({
  id: 1,
  title: 'Test Article',
  slug: 'test-article',
  content: 'Test content',
  description: 'Test description',
  published: true,
  author: createMockUser(),
  category: { id: 1, name: 'Test Category', slug: 'test' },
  ...overrides
})