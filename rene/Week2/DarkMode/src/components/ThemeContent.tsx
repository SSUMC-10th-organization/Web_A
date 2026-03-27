import clsx from 'clsx';
import { useTheme } from '../context/ThemeProvider';

export default function ThemeContent() {
  const { theme } = useTheme();

  const isLightMode = theme === 'LIGHT';

  return (
    <div
      className={clsx(
        'flex flex-col items-center justify-center h-dvh w-full px-6 gap-8 transition-colors duration-300',
        isLightMode ? 'bg-white text-gray-900' : 'bg-gray-800 text-white'
      )}
    >
      <h1 className='text-4xl font-bold'>
        {isLightMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
      </h1>
      <p className={clsx(
        'text-lg max-w-md text-center',
        isLightMode ? 'text-gray-500' : 'text-gray-400'
      )}>
        현재 테마는 <span className='font-semibold'>{theme}</span> 입니다.
        상단 버튼을 눌러 테마를 전환해보세요.
      </p>
    </div>
  );
}
