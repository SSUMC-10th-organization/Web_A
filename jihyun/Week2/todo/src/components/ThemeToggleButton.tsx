import clsx from "clsx";
import { THEME, useTheme } from "../context/ThemeProvider";

const ThemeToggleButton = () => {
	const { theme, toggleTheme } = useTheme();

	const isLightMode = theme === THEME.LIGHT;

	return (
		<button
			type="button"
			onClick={toggleTheme}
			className={clsx(
				"rounded-md px-4 py-2 text-sm font-semibold transition-colors",
				isLightMode
					? "bg-zinc-900 text-white hover:bg-zinc-700"
					: "bg-white text-zinc-900 hover:bg-zinc-200",
			)}
		>
			{isLightMode ? "다크 모드" : "라이트 모드"}
		</button>
	);
};

export default ThemeToggleButton;
