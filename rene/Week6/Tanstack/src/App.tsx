import { createBrowserRouter, RouterProvider } from "react-router-dom";

import RootLayout from "./layouts/root-layout";
import NotFoundPage from "./pages/NotFoundPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import MyPage from "./pages/MyPage";
import GoogleCallbackPage from "./pages/GoogleCallbackPage";
import { AuthProvider } from "./context/AuthContext";
import ProtectedLayout from "./layouts/ProtectedLayout";
import PublicOnlyLayout from "./layouts/PublicOnlyLayout";

const router = createBrowserRouter([
	{
		path: "/",
		element: <RootLayout />,
		errorElement: <NotFoundPage />,
		children: [
			{ index: true, element: <HomePage /> },
			{ path: "v1/auth/google/callback", element: <GoogleCallbackPage /> },
			{
				element: <PublicOnlyLayout />,
				children: [
					{ path: "login", element: <LoginPage /> },
					{ path: "signup", element: <SignupPage /> },
				],
			},
			{
				element: <ProtectedLayout />,
				children: [
					{ path: "mypage", element: <MyPage /> },
				],
			},
		],
	},
]);

function App() {
	return (
		<AuthProvider>
			<RouterProvider router={router} />
		</AuthProvider>
	);
}

export default App;