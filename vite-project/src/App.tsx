import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Homepage from "./pages/HomePage";
import MovieDetailPage from "./pages/MovieDetailPage";
import MoviePage from "./pages/MoviePage";
import NotFoundPage from "./pages/NotFoundPage";

const router = createBrowserRouter([
	{
		path: "/",
		element: <Homepage />,
		errorElement: <NotFoundPage />,
		children: [
			{
				path: "movies/:category",
				element: <MoviePage />,
			},
			{
				path: "movies/movieID",
				element: <MovieDetailPage />,
			},
		],
	},
]);

function App() {
	return <RouterProvider router={router} />;
}

export default App;
