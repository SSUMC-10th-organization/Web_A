import clsx from "clsx";
import type { FormEvent } from "react";
import { useTheme } from "../context/ThemeProvider";
import { useTodo } from "../context/TodoProvider";

const TodoForm = () => {
	const { input, handleChangeInput, addTodo } = useTodo();
	const { isLightMode } = useTheme();

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		addTodo();
	};

	return (
		<form className="flex flex-col gap-3 sm:flex-row" onSubmit={handleSubmit}>
			<input
				type="text"
				value={input}
				onChange={handleChangeInput}
				placeholder="할 일 입력"
				required
				className={clsx(
					"flex-1 rounded-lg border px-4 py-3 outline-none transition-colors",
					isLightMode
						? "border-slate-300 bg-white text-black placeholder:text-slate-400"
						: "border-zinc-600 bg-zinc-700 text-white placeholder:text-zinc-400",
				)}
			/>
			<button
				type="submit"
				className="rounded-lg bg-emerald-500 px-4 py-3 font-semibold text-white transition-colors hover:bg-emerald-600"
			>
				할 일 추가
			</button>
		</form>
	);
};

export default TodoForm;
