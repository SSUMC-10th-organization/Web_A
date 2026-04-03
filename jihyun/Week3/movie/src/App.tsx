import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import MoviePage from './pages/MoviePage';
import MovieDetailPage from './pages/MovieDetailPage';
import NotFoundPage from './pages/NotFoundPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <Navigate to="/movies?category=popular&page=1" replace />,
      },
      {
        path: 'movies',
        element: <MoviePage />,
      },
      {
        path: 'movies/:movieId',
        element: <MovieDetailPage />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;