import './App.css';
import { Link, Route, Routes } from './Router';

const HomePage = () => <h1>홈 페이지</h1>;
const SettingPage = () => <h1>세팅 페이지</h1>;
const DashboardPage = () => <h1>대시보드 페이지</h1>;
const NotFoundPage = () => <h1>404</h1>;

const Header = () => {
  return (
    <nav style={{ display: 'flex', gap: '10px' }}>
      <Link to='/'>HOME</Link>
      <Link to='/setting'>SETTING</Link>
      <Link to='/dashboard'>DASHBOARD</Link>
      <Link to='/not-found'>NOT FOUND</Link>
    </nav>
  );
};

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path='/' component={HomePage} />
        <Route path='/setting' component={SettingPage} />
        <Route path='/dashboard' component={DashboardPage} />
        <Route path='/not-found' component={NotFoundPage} />
      </Routes>
    </>
  );
}

export default App;