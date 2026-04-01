import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./layout/root-layout";
import HomePage from "./pages/home";
import MoviesPage from "./pages/movies"; 

const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout />,
        children: [
            { index: true, element: <HomePage /> },
            { path: "movies/popular", element: <MoviesPage category="popular" title="인기 영화" /> },
            { path: "movies/now-playing", element: <MoviesPage category="now_playing" title="현재 상영 중" /> },
            { path: "movies/top-rated", element: <MoviesPage category="top_rated" title="평점 높은 영화" /> },
            { path: "movies/upcoming", element: <MoviesPage category="upcoming" title="개봉 예정 영화" /> },
        ]
    }
]);

export default function App() {
    return <RouterProvider router={router} />;
}