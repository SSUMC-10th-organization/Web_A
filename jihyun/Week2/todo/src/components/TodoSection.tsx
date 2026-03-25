import clsx from "clsx";
import { useTheme } from "../context/ThemeProvider";
import { useTodo } from "../context/TodoProvider";
import TodoItem from "./TodoItem";

interface TodoSectionProps {
	title: string;
	type: "todo" | "done";
}

const TodoSection = ({ title, type }: TodoSectionProps) => {
	const { todos, doneTodos, completeTodo, deleteDoneTodo } = useTodo();
	const { isLightMode } = useTheme();

	const list = type === "todo" ? todos : doneTodos;

	return (
		<section
			className={clsx(
				"rounded-xl p-4 transition-colors",
				isLightMode ? "bg-slate-50" : "bg-zinc-900",
			)}
		>
			<h2 className="mb-4 text-center text-2xl font-bold">{title}</h2>

			<ul className="space-y-3">
				{list.map((todo) => (
					<TodoItem
						key={todo.id}
						todo={todo}
						buttonText={type === "todo" ? "완료" : "삭제"}
						buttonClassName={
							type === "todo"
								? "bg-emerald-500 hover:bg-emerald-600"
								: "bg-rose-500 hover:bg-rose-600"
						}
						onClick={() =>
							type === "todo" ? completeTodo(todo) : deleteDoneTodo(todo)
						}
					/>
				))}
			</ul>
		</section>
	);
};

export default TodoSection;
