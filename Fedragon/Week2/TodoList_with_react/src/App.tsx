import type React from "react";
import { useState } from "react";
import "./App.css";

interface Todo {
	id: number;
	text: string;
	isCompleted: boolean;
}

function App() {
	const [todos, setTodos] = useState<Todo[]>([]);
	const [inputValue, setInputValue] = useState<string>("");

	const addTodo = (e?: React.KeyboardEvent) => {
		if (e?.nativeEvent.isComposing) return;
		if (inputValue.trim() === "") return;

		const newTodo: Todo = {
			id: Date.now(),
			text: inputValue,
			isCompleted: false,
		};

		setTodos((prev) => [...prev, newTodo]);
		setInputValue("");
	};

	const toggleTodo = (id: number) => {
		setTodos((prev) =>
			prev.map((todo) =>
				todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo,
			),
		);
	};

	const deleteTodo = (id: number) => {
		setTodos((prev) => prev.filter((todo) => todo.id !== id));
	};

	return (
		<div className="todo">
			<h1 className="todo__title">UMC Study Todo</h1>

			<div className="todo__input-group">
				<input
					className="todo__input"
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
					onKeyDown={(e) => e.key === "Enter" && addTodo(e)}
					placeholder="할 일을 입력하세요"
				/>
				<button
					type="button"
					className="todo__button todo__button--add"
					onClick={() => addTodo()}
				>
					추가
				</button>
			</div>

			<div className="todo__container">
				<div className="todo__section">
					<h2 className="todo__subtitle">해야 할 일</h2>
					<ul className="todo__list">
						{todos
							.filter((todo) => !todo.isCompleted)
							.map((todo) => (
								<li key={todo.id} className="todo__item">
									<span>{todo.text}</span>
									<button
										type="button"
										className="todo__button todo__button--complete"
										onClick={() => toggleTodo(todo.id)}
									>
										완료
									</button>
								</li>
							))}
					</ul>
				</div>

				<div className="todo__section">
					<h2 className="todo__subtitle">해낸 일</h2>
					<ul className="todo__list">
						{todos
							.filter((todo) => todo.isCompleted)
							.map((todo) => (
								<li key={todo.id} className="todo__item">
									<span>{todo.text}</span>
									<button
										type="button"
										className="todo__button todo__button--delete"
										onClick={() => deleteTodo(todo.id)}
									>
										삭제
									</button>
								</li>
							))}
					</ul>
				</div>
			</div>
		</div>
	);
}

export default App;
