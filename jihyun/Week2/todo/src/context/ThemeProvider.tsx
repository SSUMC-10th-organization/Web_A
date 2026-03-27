import { createContext, type ReactNode, useContext, useState } from "react";

export const THEME = {
	LIGHT: "light",
	DARK: "dark",
} as const;

export type Theme = (typeof THEME)[keyof typeof THEME];

interface ThemeContextType {
	theme: Theme;
	isLightMode: boolean;
	toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
	const [theme, setTheme] = useState<Theme>(THEME.LIGHT);

	const toggleTheme = () => {
		setTheme((prev) => (prev === THEME.LIGHT ? THEME.DARK : THEME.LIGHT));
	};

	const isLightMode = theme === THEME.LIGHT;

	return (
		<ThemeContext.Provider value={{ theme, isLightMode, toggleTheme }}>
			{children}
		</ThemeContext.Provider>
	);
};

export const useTheme = () => {
	const context = useContext(ThemeContext);

	if (!context) {
		throw new Error(
			"useTheme는 반드시 ThemeProvider 내부에서 사용되어야 합니다.",
		);
	}

	return context;
};
