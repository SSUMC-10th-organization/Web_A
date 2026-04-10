import type { ReactNode } from 'react'
import Link from '../router/Link'

type LayoutProps = {
  children: ReactNode
}

function Layout({ children }: LayoutProps) {
  return (
    <div className="layout">
      <header className="header">
        <h2>SPA Practice</h2>
        <nav className="nav">
          <Link to="/">홈</Link>
          <Link to="/about">소개</Link>
          <Link to="/movies">영화</Link>
        </nav>
      </header>

      <main className="main">{children}</main>
    </div>
  )
}

export default Layout