import '@testing-library/jest-dom'

class MockIntersectionObserver {
  observe() {}
  disconnect() {}
  unobserve() {}
}

class MockResizeObserver {
  observe() {}
  disconnect() {}
  unobserve() {}
}

global.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver
global.ResizeObserver = MockResizeObserver as unknown as typeof ResizeObserver

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
})
