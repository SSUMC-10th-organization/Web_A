import { createBrowserRouter, RouterProvider } from "react-router-dom";

import PopularPage from './pages/Popular';
import NowPlayingPage from './pages/NowPlaying';
import TopRatedPage from './pages/TopRated';
import UpcomingPage from './pages/Upcoming';
import MovieDetailPage from './pages/MovieDetail';
import NotFoundPage from './pages/NotFound';

import RootLayout from './layout/root-layout';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true,                element: <PopularPage /> },
      { path: '/movies/popular',            element: <PopularPage /> },
      { path: '/movies/now-playing',        element: <NowPlayingPage /> },
      { path: '/movies/top-rated',          element: <TopRatedPage /> },
      { path: '/movies/upcoming',           element: <UpcomingPage /> },
      { path: '/movies/:id',                element: <MovieDetailPage /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />
}

export default App;