// src/test/setup.js
import '@testing-library/jest-dom'

// =============================================
// Global Mocks & Polyfills for Vitest
// =============================================

// Mock React Router v6 (if you're using react-router-dom)
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useLocation: () => ({ pathname: '/', search: '', hash: '', state: null }),
    useParams: () => ({}),
  }
})

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock IntersectionObserver
global.IntersectionObserver = class {
  constructor() {}
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
}

// Mock ResizeObserver
global.ResizeObserver = class {
  constructor() {}
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
}

// Mock localStorage
const localStorageMock = (() => {
  let store = {}
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = value.toString() },
    removeItem: (key) => { delete store[key] },
    clear: () => { store = {} },
  }
})()

Object.defineProperty(window, 'localStorage', { value: localStorageMock })
Object.defineProperty(window, 'sessionStorage', { value: localStorageMock })

// Silence console warnings/errors during tests (optional but useful)
const originalConsoleError = console.error
const originalConsoleWarn = console.warn

beforeAll(() => {
  console.error = vi.fn()
  console.warn = vi.fn()
})

afterAll(() => {
  console.error = originalConsoleError
  console.warn = originalConsoleWarn
})

// Auto cleanup after each test
import { cleanup } from '@testing-library/react'
afterEach(() => {
  cleanup()
})