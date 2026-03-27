// src/context/ThemeContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

// 1. Context 생성
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// 2. Provider 컴포넌트 (이 이름이 main.tsx에서 쓰이는 이름이야!)
export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  useEffect(() => {
    const root = window.document.documentElement; // <html> 태그

    if (isDarkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    // 디버깅: 클래스가 실제로 어떻게 바뀌는지 콘솔에 찍어보자
    console.log("현재 HTML 클래스:", root.className);
  }, [isDarkMode]);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// 3. 커스텀 훅 (App.tsx에서 사용)
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme은 ThemeProvider 내부에서 사용해야 합니다.");
  }
  return context;
};