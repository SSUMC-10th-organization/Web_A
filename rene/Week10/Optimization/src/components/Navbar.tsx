import { Link } from '@tanstack/react-router'
import { useTheme } from '../context/ThemeContext'
import darkModeIcon from '../assets/dark-mode-icon.svg'
import lightModeIcon from '../assets/light-mode-icon.svg'

export default function Navbar() {
  const { isDark, toggleTheme } = useTheme()

  return (
    <nav className="bg-surface shadow-sm px-6 py-4 flex items-center justify-between">
      <Link to="/" search={{ query: '', includeAdult: false, language: 'ko-KR' }}>
        <span className="text-xl font-bold text-blue-500">RENE</span>
        <span className="text-xl font-semibold text-gray-700 dark:text-gray-200"> movie</span>
      </Link>
      <button
        onClick={toggleTheme}
        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        aria-label="다크모드 토글"
      >
        <img src={isDark ? darkModeIcon : lightModeIcon} alt="" width={24} height={24} />
      </button>
    </nav>
  )
}
