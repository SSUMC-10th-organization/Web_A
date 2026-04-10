import type { ReactNode } from 'react'
import HomePage from '../pages/HomePage'
import AboutPage from '../pages/AboutPage'
import MoviesPage from '../pages/MoviesPage'
import MovieDetailPage from '../pages/MovieDetailPage'
import NotFoundPage from '../pages/NotFoundPage'

type Route =
  | {
      path: string
      element: ReactNode
    }
  | {
      path: string
      element: (params: Record<string, string>) => ReactNode
    }

export const routes: Route[] = [
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/about',
    element: <AboutPage />,
  },
  {
    path: '/movies',
    element: <MoviesPage />,
  },
  {
    path: '/movies/:id',
    element: (params) => <MovieDetailPage movieId={params.id} />,
  },
]

export const notFoundRoute = {
  element: <NotFoundPage />,
}