import { useTheme } from "./context/ThemeContext";

function App() {
	const { isDarkMode, toggleTheme } = useTheme();

	return (
		<div className="min-h-screen w-full flex flex-col items-center justify-center transition-colors duration-300 bg-white dark:bg-zinc-900">
			<h1 className="text-4xl font-bold mb-8 text-black dark:text-white">
				{isDarkMode ? "🌙 다크 모드" : "☀️ 라이트 모드"}
			</h1>
			<button
				type="button"
				onClick={toggleTheme}
				className="px-6 py-3 rounded-full font-semibold bg-zinc-800 text-white dark:bg-white dark:text-black hover:opacity-80 transition-opacity"
			>
				테마 변경하기
			</button>
		</div>
	);
}

export default App;
