interface Todo {
	id: number;
	text: string;
	isCompleted: boolean;
}

let todos: Todo[] = [];

const todoInput = document.getElementById("todo-input") as HTMLInputElement;
const addBtn = document.getElementById("add-btn") as HTMLButtonElement;
const todoList = document.getElementById("todo-list") as HTMLUListElement;
const doneList = document.getElementById("done-list") as HTMLUListElement;

function renderTodos(): void {
	todoList.innerHTML = "";
	doneList.innerHTML = "";

	todos.forEach((todo) => {
		const li = document.createElement("li");
		li.className = "todo__item";

		const span = document.createElement("span");
		span.className = "todo__text";
		span.textContent = todo.text;

		const button = document.createElement("button");

		if (!todo.isCompleted) {
			button.className = "todo__button todo__button--complete";
			button.textContent = "완료";
			button.onclick = () => completeTodo(todo.id);
			li.append(span, button);
			todoList.appendChild(li);
		} else {
			button.className = "todo__button todo__button--delete";
			button.textContent = "삭제";
			button.onclick = () => deleteTodo(todo.id);
			li.append(span, button);
			doneList.appendChild(li);
		}
	});
}

function addTodo(): void {
	const text = todoInput.value.trim();
	if (text === "") return;

	const newTodo: Todo = {
		id: Date.now(),
		text: text,
		isCompleted: false,
	};

	todos.push(newTodo);
	todoInput.value = "";
	renderTodos();
}

function completeTodo(id: number): void {
	todos = todos.map((todo) =>
		todo.id === id ? { ...todo, isCompleted: true } : todo,
	);
	renderTodos();
}

function deleteTodo(id: number): void {
	todos = todos.filter((todo) => todo.id !== id);
	renderTodos();
}

addBtn.addEventListener("click", addTodo);
