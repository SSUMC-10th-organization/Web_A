import { useTodo } from "../context/TodoContext";

interface Task {
	id: number;
	text: string;
}

interface TodoItemProps {
	task: Task;
	isDone: boolean;
}

const TodoItem = ({ task, isDone }: TodoItemProps) => {
	const { completeTask, deleteTask } = useTodo();

	return (
		<li className="render-container__item">
			<span className="render-container__item-text">{task.text}</span>
			{isDone ? (
				<button
					type="button"
					className="render-container__item-button"
					style={{ backgroundColor: "#dc3545" }}
					onClick={() => deleteTask(task)}
				>
					삭제
				</button>
			) : (
				<button
					type="button"
					className="render-container__item-button"
					onClick={() => completeTask(task)}
				>
					완료
				</button>
			)}
		</li>
	);
};

export default TodoItem;
