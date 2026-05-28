import {
	createBrowserRouter,
	RouterProvider,
	type RouteObject,
} from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "./App.css";
import { queryClient } from "./lib/queryClient";
import HomeLayout from "./layouts/HomeLayout";
import ProtectedLayout from "./layouts/ProtectedLayout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import MyPage from "./pages/MyPage";
import MyProfilePage from "./pages/MyProfilePage";
import NotFoundPage from "./pages/NotFoundPage";
import SignupPage from "./pages/SignupPage";
import LpDetailPage from "./pages/LpDetailPage";
import GoogleLoginRedirectPage from "./pages/GoogleLoginRedirectPage";
import { AuthProvider } from "./context/AuthProvider";

// 인증 없이 접근 가능한 라우트
const publicRoutes: RouteObject[] = [
	{
		path: "/",
		element: <HomeLayout />,
		errorElement: <NotFoundPage />,
		children: [
			{ index: true, element: <HomePage /> },
			{ path: "login", element: <LoginPage /> },
			{ path: "signup", element: <SignupPage /> },
			{ path: "signup/profile", element: <MyProfilePage /> },
			{ path: "lp/:lpId", element: <LpDetailPage /> },
			{
				path: "v1/auth/google/callback",
				element: <GoogleLoginRedirectPage />,
			},
		],
	},
];

// 인증이 필요한 라우트
const protectedRoutes: RouteObject[] = [
	{
		path: "/",
		element: <ProtectedLayout />,
		errorElement: <NotFoundPage />,
		children: [
			{
				element: <HomeLayout />,
				children: [{ path: "my", element: <MyPage /> }],
			},
		],
	},
];

const router = createBrowserRouter([...publicRoutes, ...protectedRoutes]);

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<AuthProvider>
				<RouterProvider router={router} />
			</AuthProvider>
			{import.meta.env.DEV && (
				<ReactQueryDevtools initialIsOpen={false} />
			)}
		</QueryClientProvider>
	);
}

export default App;
