import type { MouseEvent, ReactNode } from 'react'

type LinkProps = {
  to: string
  children: ReactNode
}

function Link({ to, children }: LinkProps) {
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()

    if (window.location.pathname === to) return

    window.history.pushState({}, '', to)
    window.dispatchEvent(new PopStateEvent('popstate'))
  }

  return (
    <a href={to} onClick={handleClick}>
      {children}
    </a>
  )
}

export default Link