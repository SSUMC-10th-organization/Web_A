import { ThemeProvider } from './context/ThemeProvider';
import ContentPage from './ContentPage';
import './App.css'

function App() {
  return (
    <ThemeProvider>
      <div>
        <main className='flex-1'>
          <ContentPage />
        </main>
      </div>
    </ThemeProvider>
  )
}

export default App
