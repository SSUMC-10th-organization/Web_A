import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./layout/root-layout";
import HomePage from "./pages/home"; 
import MoviesPage from "./pages/movies";
import MovieDetailPage from "./pages/movie-detail";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "movies/popular", element: <MoviesPage title="인기 영화" category="popular" /> },
      { path: "movies/now-playing", element: <MoviesPage title="현재 상영 중" category="now_playing" /> },
      { path: "movies/top-rated", element: <MoviesPage title="높은 평점" category="top_rated" /> },
      { path: "movies/upcoming", element: <MoviesPage title="개봉 예정" category="upcoming" /> },
      { path: "movies/:movieId", element: <MovieDetailPage /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}