import './App.css'

// 1. React Router에서 필요한 함수/컴포넌트를 import
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import HomePage from './pages/popular';
import RootLayout from './layout/root-layout';

// 2. 경로(path)와 보여줄 화면(element)를 정의
const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index:true,
        element: <HomePage />
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />
}

export default App;