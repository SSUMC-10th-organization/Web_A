import { useTheme } from "./ThemeContext";

function App() {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="max-w-md w-full p-8 rounded-3xl shadow-2xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 transition-all">
        <header className="text-center mb-8">
          <span className="text-6xl mb-4 block">{isDarkMode ? "🌙" : "☀️"}</span>
          <h1 className="text-3xl font-black tracking-tight">
            {isDarkMode ? "다크 모드" : "라이트 모드"}
          </h1>
        </header>

        <main className="text-center mb-10">
          <p className="text-gray-600 dark:text-gray-400 font-medium">
            useContext를 활용하여 다크모드 구현하기!
          </p>
        </main>

        <button
          type="button"
          onClick={toggleTheme}
          className="w-full py-4 rounded-2xl font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-500/30"
        >
          {isDarkMode ? "라이트 모드로 전환" : "다크 모드로 전환"}
        </button>
      </div>

      <footer className="mt-8 text-sm opacity-30 font-bold uppercase tracking-widest">
        UMC 10th Web Study
      </footer>
    </div>
  );
}

export default App;
