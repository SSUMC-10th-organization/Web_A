import { Routes, Route } from 'react-router-dom';
import RootLayout from './layout/RootLayout';
import HomePage from './pages/HomePage';
import PopularPage from './pages/PopularPage';
import NowPlayingPage from './pages/NowPlayingPage';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPages from './pages/LoginPages'; 

function App() {
  return (
    <Routes>
      <Route path="/" element={<RootLayout />}>
        
      
        <Route index element={<HomePage />} />
        
      
        <Route path="login" element={<LoginPages />} />

      
        <Route element={<ProtectedRoute />}>
          <Route path="popular" element={<PopularPage />} />
          <Route path="now-playing" element={<NowPlayingPage />} />
        </Route>

      </Route>
    </Routes>
  );
}

export default App;