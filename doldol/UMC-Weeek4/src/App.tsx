import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import HomeLayout from "./layouts/HomeLayout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import MyPage from "./pages/MyPage";
import MyProfilePage from "./pages/MyProfilePage";
import NotFoundPage from "./pages/NotFoundPage";
import SignupPage from "./pages/SignupPage";

const router = createBrowserRouter([
	{
		path: "/",
		element: <HomeLayout />,
		errorElement: <NotFoundPage />,
		children: [
			{ index: true, element: <HomePage /> },
			{ path: "login", element: <LoginPage /> },
			{ path: "signup", element: <SignupPage /> },
			{ path: "signup/profile", element: <MyProfilePage /> },
			{ path: "my", element: <MyPage /> },
		],
	},
]);

function App() {
	return <RouterProvider router={router} />;
}

export default App;
