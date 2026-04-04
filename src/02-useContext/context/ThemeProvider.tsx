import { type PropsWithChildren, useState } from "react";
import { THEME, ThemeContext, type TTheme } from "./ThemeContext";

export function ThemeProvider({ children }: PropsWithChildren) {
	const [theme, setTheme] = useState<TTheme>(THEME.LIGHT);

	const toggleTheme = () => {
		setTheme((prev) => (prev === THEME.LIGHT ? THEME.DARK : THEME.LIGHT));
	};

	return (
		<ThemeContext.Provider value={{ theme, toggleTheme }}>
			{children}
		</ThemeContext.Provider>
	);
}
