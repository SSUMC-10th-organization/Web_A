import { useTheme } from "../context/ThemeProvider";
import clsx from 'clsx';

export default function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme();
  const isLightMode = theme === 'LIGHT';

  return (
    <button
      onClick={toggleTheme}
      className={clsx(
        'px-4 py-2 rounded-full font-semibold transition-colors duration-300',
        isLightMode
          ? 'bg-gray-800 text-white hover:bg-gray-600'
          : 'bg-yellow-300 text-gray-900 hover:bg-yellow-200'
      )}
    >
      {isLightMode ? '🌙 Dark' : '☀️ Light'}
    </button>
  );
}
