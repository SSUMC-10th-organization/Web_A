import './App.css';
import { WelcomeData } from './components/UserDataDisplay';

export function App() : Element {
  return <WelcomeData userId={1} />;
}

export default App;