import { useTodo } from "../context/TodoProvider";
import TodoItem from "./TodoItem";

interface TodoSectionProps {
	title: string;
	type: "todo" | "done";
}

const TodoSection = ({ title, type }: TodoSectionProps) => {
	const { todos, doneTodos, completeTodo, deleteDoneTodo } = useTodo();

	const list = type === "todo" ? todos : doneTodos;

	return (
		<div className="render-container__section">
			<h2 className="render-container__title">{title}</h2>
			<ul className="render-container__list">
				{list.map((todo) => (
					<TodoItem
						key={todo.id}
						todo={todo}
						buttonText={type === "todo" ? "완료" : "삭제"}
						buttonClassName={
							type === "todo"
								? "render-container__item-button render-container__item-button--complete"
								: "render-container__item-button render-container__item-button--delete"
						}
						onClick={() =>
							type === "todo" ? completeTodo(todo) : deleteDoneTodo(todo)
						}
					/>
				))}
			</ul>
		</div>
	);
};

export default TodoSection;
