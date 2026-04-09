import { createBrowserRouter, RouterProvider } from "react-router-dom";

import RootLayout from "./layout/root-layout";
import NotFoundPage from "./pages/NotFoundPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

// 1. 홈페이지
// 2. 로그인 페이지
// 3. 회원가입 페이지

const router = createBrowserRouter([
	{
		path: "/",
		element: <RootLayout />,
		errorElement: <NotFoundPage />,
		children: [
			{ index: true, element: <HomePage /> },
			{ path: "/login", element: <LoginPage /> },
			{ path: "/signup", element: <SignupPage /> },
		],
	},
]);

function App() {
	return <RouterProvider router={router} />;
}

export default App;