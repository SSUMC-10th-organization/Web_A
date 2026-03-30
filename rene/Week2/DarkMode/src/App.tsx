import { ThemeProvider } from './context/ThemeProvider';
import ContentPage from './ContentPage';

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
