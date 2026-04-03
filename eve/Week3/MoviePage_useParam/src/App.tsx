import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MovieList from './pages/MovieList';
import MovieDetail from './pages/MovieDetail';

function App() {
  return (
    <Router>
      <Routes>
        {/* 1. 처음 접속하면 목록 페이지가 뜸 */}
        <Route path="/" element={<MovieList />} />
        
        {/* 2. 목록에서 영화 클릭하면 해당 ID를 들고 상세 페이지로 이동 */}
        <Route path="/movies/:movieId" element={<MovieDetail />} />
      </Routes>
    </Router>
  );
}

export default App;