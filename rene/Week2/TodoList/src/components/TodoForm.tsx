import { useState } from "react";
import { useTodo } from "../context/TodoContext";

export default function TodoForm() {
	const [inputValue, setInputValue] = useState("");
	const { addTodo } = useTodo();

	const handleSubmit = () => {
		const text = inputValue.trim();
		if (!text) return;
		addTodo(text);
		setInputValue("");
	};

	return (
		<form
			className="todo-container__form"
			onSubmit={(e) => {
				e.preventDefault();
				handleSubmit();
			}}
		>
			<input
				className="todo-container__input"
				type="text"
				placeholder="할 일 입력"
				value={inputValue}
				onChange={(e) => setInputValue(e.target.value)}
			/>
			<button className="todo-container__button" type="submit">
				할 일 추가
			</button>
		</form>
	);
}
