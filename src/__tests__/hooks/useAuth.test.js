// ===============================================
// 📁 src/__tests__/hooks/useAuth.test.js
import { renderHook, act } from '@testing-library/react'
import { useAuth } from '@/context/AuthProvider'
import { AuthProvider } from '@/context/AuthProvider'

const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>

describe('useAuth', () => {
  beforeEach(() => {
    global.fetch.mockClear()
  })

  it('should initialize with loading state', () => {
    const { result } = renderHook(() => useAuth(), { wrapper })

    expect(result.current.loading).toBe(true)
    expect(result.current.user).toBe(null)
  })

  it('should handle successful login', async () => {
    const mockUser = { id: 1, name: 'John Doe', email: 'john@example.com' }

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, user: mockUser })
    })

    const { result } = renderHook(() => useAuth(), { wrapper })

    await act(async () => {
      const response = await result.current.login('john@example.com', 'password')
      expect(response.success).toBe(true)
    })

    expect(fetch).toHaveBeenCalledWith('/api/auth/login', expect.objectContaining({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email: 'john@example.com', password: 'password' })
    }))
  })

  it('should handle login failure', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: false, error: 'Invalid credentials' })
    })

    const { result } = renderHook(() => useAuth(), { wrapper })

    await act(async () => {
      const response = await result.current.login('wrong@email.com', 'wrongpass')
      expect(response.success).toBe(false)
      expect(response.error).toBe('Invalid credentials')
    })
  })
})