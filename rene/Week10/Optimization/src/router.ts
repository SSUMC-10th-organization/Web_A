import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router'
import App from './App'
import MovieSearchPage from './pages/MovieSearchPage'
import type { SearchParams } from './types/movie'

const VALID_LANGUAGES: SearchParams['language'][] = ['ko-KR', 'en-US', 'ja-JP']

const rootRoute = createRootRoute({
  component: App,
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: MovieSearchPage,
  validateSearch: (search: Record<string, unknown>): SearchParams => ({
    query: typeof search.query === 'string' ? search.query : '',
    includeAdult: search.includeAdult === true || search.includeAdult === 'true',
    language: VALID_LANGUAGES.includes(search.language as SearchParams['language'])
      ? (search.language as SearchParams['language'])
      : 'ko-KR',
  }),
})

const routeTree = rootRoute.addChildren([indexRoute])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
