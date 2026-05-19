import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools/production'
import './index.css'
import App from './App.tsx'


const queryClient = new QueryClient() // React Query의 QueryClient 인스턴스 생성

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  </StrictMode>,
)

// import.meta.env.DEV : Vite에서 제공하는 환경 변수로, 현재 환경이 개발 모드인지 여부를 나타냄. 개발 모드에서는 React Query Devtools가 활성화되어 앱의 상태를 쉽게 디버깅할 수 있도록 도와줌.