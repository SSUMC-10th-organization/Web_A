const HomePage = () => <h1>home 페이지</h1>;
const SettingPage = () => <h1>setting 페이지</h1>;
const DashboardPage = () => <h1>dashboard 페이지</h1>;
const NotFound = () => <h1>Not Found</h1>;

const Header = () => {
  return (
    <nav style={{ display: 'flex', gap: '10px' }}>
      <Link to='/matthew'>MATTHEW</Link>
      <Link to='/aeong'>AEONG</Link>
      <Link to='/joy'>JOY</Link>
      <Link to='/not-found'>NOT FOUND</Link>
    </nav>
  );
};

function App() {
  const { pathname } = window.location;

  switch (pathname) {
    case '/':
      return <HomePage />;
    case '/setting':
      return <SettingPage />;
    case '/dashboard':
      return <DashboardPage />;
    default:
      return <NotFound />;
  }
};

export default App;