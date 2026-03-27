import clsx from 'clsx';
import { useTheme } from '../context/ThemeProvider';
import ThemeToggleButton from "./ThemeToggleButton";

export default function Navbar() {
  const { theme } = useTheme();
  const isLightMode = theme === 'LIGHT';

  return (
    <nav className={clsx(
      'flex justify-end items-center self-stretch h-16 px-6 transition-colors duration-300',
      isLightMode ? 'bg-white' : 'bg-gray-800'
    )}>
      <ThemeToggleButton />
    </nav>
  );
}
