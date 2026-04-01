import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import Layout from '../components/Layout'
import { routes, notFoundRoute } from './routes'

type Params = Record<string, string>

function matchPath(routePath: string, currentPath: string): Params | null {
  const routeSegments = routePath.split('/').filter(Boolean)
  const currentSegments = currentPath.split('/').filter(Boolean)

  if (routeSegments.length !== currentSegments.length) {
    return null
  }

  const params: Params = {}

  for (let i = 0; i < routeSegments.length; i++) {
    const routeSegment = routeSegments[i]
    const currentSegment = currentSegments[i]

    if (routeSegment.startsWith(':')) {
      const key = routeSegment.slice(1)
      params[key] = currentSegment
      continue
    }

    if (routeSegment !== currentSegment) {
      return null
    }
  }

  return params
}

function getCurrentPage(pathname: string): ReactNode {
  for (const route of routes) {
    const params = matchPath(route.path, pathname)

    if (params !== null) {
      if (typeof route.element === 'function') {
        return route.element(params)
      }

      return route.element
    }
  }

  return notFoundRoute.element
}

function Router() {
  const [pathname, setPathname] = useState(window.location.pathname)

  useEffect(() => {
    const handleRouteChange = () => {
      setPathname(window.location.pathname)
    }

    window.addEventListener('popstate', handleRouteChange)

    return () => {
      window.removeEventListener('popstate', handleRouteChange)
    }
  }, [])

  const page = useMemo(() => getCurrentPage(pathname), [pathname])

  return <Layout>{page}</Layout>
}

export default Router