// 📁 tests/setup/jest.setup.js
import '@testing-library/jest-dom'
import { TextEncoder, TextDecoder } from 'util'

// Polyfills pour les tests
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

// Mock de Next.js router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '/',
      query: '',
      asPath: '/',
      push: jest.fn(),
      pop: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn(),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
    }
  },
}))

// Mock de fetch global
global.fetch = jest.fn()