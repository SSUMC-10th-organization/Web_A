import clsx from "clsx";
import { THEME, useTheme } from "./context/ThemeContext";

export default function ThemeToggleButton() {
	const { theme, toggleTheme } = useTheme();

	const isLightMode = theme === THEME.LIGHT;

	return (
		<button
			type="button"
			onClick={toggleTheme}
			className={clsx(
				"px-6 py-2 rounded-full font-semibold text-sm transition-all duration-300 shadow-md border-2",
				isLightMode
					? "bg-gray-900 text-white border-gray-700 hover:bg-gray-700"
					: "bg-white text-gray-900 border-gray-300 hover:bg-gray-100",
			)}
		>
			{isLightMode ? "🌙 다크 모드" : "☀️ 라이트 모드"}
		</button>
	);
}
