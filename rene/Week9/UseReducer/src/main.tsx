import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import CounterPage from './CounterPage.tsx'
import CompanyPage from './CompanyPage.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CompanyPage />
  </StrictMode>,
)
