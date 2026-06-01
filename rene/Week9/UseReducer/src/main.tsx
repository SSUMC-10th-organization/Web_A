import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// import CounterPage from './pages/CounterPage.tsx'
import CompanyPage from './pages/CompanyPage.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CompanyPage />
  </StrictMode>,
)
