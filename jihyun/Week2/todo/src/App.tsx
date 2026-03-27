import clsx from "clsx";
import ThemeToggleButton from "./components/ThemeToggleButton";
import TodoForm from "./components/TodoForm";
import TodoSection from "./components/TodoSection";
import { useTheme } from "./context/ThemeProvider";

function App() {
	const { isLightMode } = useTheme();

	return (
		<div
			className={clsx(
				"min-h-screen w-full px-4 py-10 transition-colors duration-300",
				isLightMode ? "bg-slate-100 text-black" : "bg-zinc-900 text-white",
			)}
		>
			<div
				className={clsx(
					"mx-auto w-full max-w-4xl rounded-2xl p-6 shadow-lg transition-colors duration-300",
					isLightMode ? "bg-white" : "bg-zinc-800",
				)}
			>
				<div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<h1 className="text-center text-4xl font-bold sm:text-left">
						YONG TODO
					</h1>
					<ThemeToggleButton />
				</div>

				<TodoForm />

				<div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
					<TodoSection title="할 일" type="todo" />
					<TodoSection title="완료" type="done" />
				</div>
			</div>
		</div>
	);
}

export default App;
