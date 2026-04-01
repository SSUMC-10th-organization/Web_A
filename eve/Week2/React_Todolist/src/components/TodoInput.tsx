import { useTodo } from "../context/TodoContext";

const TodoInput = () => {
	const { todoInput, setTodoInput, addTodo } = useTodo();

	return (
		<form className="todo-container__form" onSubmit={addTodo}>
			<input
				type="text"
				className="todo-container__input"
				placeholder="할 일 입력"
				value={todoInput}
				onChange={(e) => setTodoInput(e.target.value)}
				required
			/>
			<button type="submit" className="todo-container__button">
				할 일 추가
			</button>
		</form>
	);
};

export default TodoInput;
