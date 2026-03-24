import type { FormEvent } from "react";
import { useTodo } from "../context/TodoProvider";

const TodoForm = () => {
	const { input, handleChangeInput, addTodo } = useTodo();

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		addTodo();
	};

	return (
		<form className="todo-container__form" onSubmit={handleSubmit}>
			<input
				type="text"
				className="todo-container__input"
				placeholder="할 일 입력"
				value={input}
				onChange={handleChangeInput}
				required
			/>
			<button type="submit" className="todo-container__button">
				할 일 추가
			</button>
		</form>
	);
};

export default TodoForm;
