import '@testing-library/jest-dom'

// Variables d'env factices : certains composants (Nav, etc.) instancient un
// client Supabase au rendu, qui exige une URL + clé. Sans ça, leurs tests
// plantent avec « Your project's URL and API key are required ».
process.env.NEXT_PUBLIC_SUPABASE_URL ||= 'https://test.supabase.co'
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||= 'test-anon-key'

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
