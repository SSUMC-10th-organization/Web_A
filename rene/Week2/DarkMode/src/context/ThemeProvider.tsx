import {
	createContext,
	type PropsWithChildren,
	useContext,
	useState,
} from "react";

export type Theme = "LIGHT" | "DARK";

export interface IThemeContext {
	theme: Theme;
	toggleTheme: () => void;
}

export const ThemeContext = createContext<IThemeContext | undefined>(undefined);

export const ThemeProvider = ({ children }: PropsWithChildren) => {
	const [theme, setTheme] = useState<Theme>("LIGHT");

	const toggleTheme = (): void => {
		setTheme((prev): Theme => (prev === "LIGHT" ? "DARK" : "LIGHT"));
	};

	return (
		<ThemeContext.Provider value={{ theme, toggleTheme }}>
			{children}
		</ThemeContext.Provider>
	);
};

export const useTheme = (): IThemeContext => {
	const context = useContext(ThemeContext);

	if (!context) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}

	return context;
};
