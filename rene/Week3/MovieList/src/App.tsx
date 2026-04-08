import { createBrowserRouter, RouterProvider } from "react-router-dom";

import PopularPage from './pages/popular';
import NotFoundPage from './pages/NotFound';
import RootLayout from './layout/root-layout';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index:true,
        element: <PopularPage />
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />
}

export default App;