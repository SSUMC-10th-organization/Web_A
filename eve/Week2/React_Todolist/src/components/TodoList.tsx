import { useTodo } from "../context/TodoContext";
import TodoItem from "./TodoItem";

interface TodoListProps {
	title: string;
	type: "todo" | "done";
}

const TodoList = ({ title, type }: TodoListProps) => {
	const { todos, doneTasks } = useTodo();

	const tasks = type === "todo" ? todos : doneTasks;

	return (
		<div className="render-container__section">
			<h2 className="render-container__title">{title}</h2>
			<ul className="render-container__list">
				{tasks.map((task) => (
					<TodoItem key={task.id} task={task} isDone={type === "done"} />
				))}
			</ul>
		</div>
	);
};

export default TodoList;
