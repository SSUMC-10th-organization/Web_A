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
	return (
		<li className="render-container__item">
			<span className="render-container__item-text">{todo.text}</span>
			<button type="button" className={buttonClassName} onClick={onClick}>
				{buttonText}
			</button>
		</li>
	);
};

export default TodoItem;
