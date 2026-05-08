import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/AuthContext";

import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import LPDetailPage from "./pages/LPDetailPage";
import LpListPage from "./pages/LpListPage";
import GoogleLoginRedirectPage from "./pages/GoogleLoginRedirectPage";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Navigate to="/lplist" replace /> },
      { path: "home", element: <Home /> },
      { path: "lplist", element: <LpListPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "signup", element: <SignupPage /> },
      { path: "auth/google/callback", element: <GoogleLoginRedirectPage /> },
      {
        element: <ProtectedRoute />,
        children: [{ path: "lp/:lpId", element: <LPDetailPage /> }],
      },
    ],
  },
]);

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  );
}