import clsx from "clsx";
import { useTheme } from "../context/ThemeProvider";
import type { Todo } from "../types/todo";

interface TodoItemProps {
	todo: Todo;
	buttonText: string;
	buttonClassName: string;
	onClick: () => void;
}

const TodoItem = ({
	todo,
	buttonText,
	buttonClassName,
	onClick,
}: TodoItemProps) => {
	const { isLightMode } = useTheme();

	return (
		<li
			className={clsx(
				"flex items-center justify-between gap-3 rounded-lg p-3 transition-colors",
				isLightMode ? "bg-slate-100" : "bg-zinc-700",
			)}
		>
			<span className="flex-1 truncate">{todo.text}</span>
			<button
				type="button"
				className={clsx(
					"rounded-md px-3 py-2 text-sm font-semibold text-white transition-colors",
					buttonClassName,
				)}
				onClick={onClick}
			>
				{buttonText}
			</button>
		</li>
	);
};

export default TodoItem;
