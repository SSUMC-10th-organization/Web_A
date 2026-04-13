import { createContext, useContext } from "react";

export enum THEME {
	LIGHT = "LIGHT",
	DARK = "DARK",
}

export type TTheme = THEME.LIGHT | THEME.DARK;

export interface IThemeContext {
	theme: TTheme;
	toggleTheme: () => void;
}

export const ThemeContext = createContext<IThemeContext | null>(null);

export const useTheme = () => {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}
	return context;
};
