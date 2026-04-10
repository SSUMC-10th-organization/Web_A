export {}
type Path = '/' | '/about'

interface HistoryState {
  path: Path
}

declare global {
  interface Window {
    navigate: (path: Path) => void
  }
}

const routes: Record<Path, string> = {
  '/':      'page-home',
  '/about': 'page-about',
}

function render(path: string): void {
  const validPath = (path in routes ? path : '/') as Path
  const pageId = routes[validPath]

  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'))

  const target = document.getElementById(pageId)
  if (!target) return
  target.classList.remove('active')
  void target.offsetWidth
  target.classList.add('active')

  document.querySelectorAll<HTMLButtonElement>('.nav-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.path === validPath)
  })
}

function navigate(path: Path): void {
  history.pushState({ path } satisfies HistoryState, '', path)
  render(path)
}

window.addEventListener('popstate', (e: PopStateEvent) => {
  const state = e.state as HistoryState | null
  render(state?.path ?? '/')
})

function isPath(value: string): value is Path {
  return value in routes
}


const rawPath = window.location.pathname
const initialPath: Path = isPath(rawPath) ? rawPath : '/'
history.replaceState({ path: initialPath } satisfies HistoryState, '', initialPath)
render(initialPath)

window.navigate = navigate
