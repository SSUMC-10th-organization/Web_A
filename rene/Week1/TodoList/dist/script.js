const todoInput = document.getElementById("todo-input");
const todoForm = document.getElementById("todo-form");
const todoList = document.getElementById("todo-list");
const donelist = document.getElementById("done-list");
let todos = [];
let doneTodos = [];
const renderTodos = () => {
	todoList.innerHTML = "";
	donelist.innerHTML = "";
	todos.forEach((todo) => {
		const li = createTodoItem(todo, false);
		todoList.appendChild(li);
	});
	doneTodos.forEach((todo) => {
		const li = createTodoItem(todo, true);
		donelist.appendChild(li);
	});
};
const getTodoText = () => {
	return todoInput.value.trim();
};
const addTodo = (text) => {
	todos.push({ id: Date.now(), text, completed: false });
	todoInput.value = "";
	renderTodos();
};
const completeTodo = (todo) => {
	todos = todos.filter((t) => t.id !== todo.id);
	doneTodos.push(todo);
	renderTodos();
};
const deleteDoneTodo = (todo) => {
	doneTodos = doneTodos.filter((t) => t.id !== todo.id);
	renderTodos();
};
const createTodoItem = (todo, isDone) => {
	const li = document.createElement("li");
	li.classList.add("render-container__item");
	li.textContent = todo.text;
	const button = document.createElement("button");
	button.classList.add("render-container__item-button");
	if (isDone) {
		button.textContent = "삭제";
		button.style.backgroundColor = "#dc3545";
	} else {
		button.textContent = "완료";
		button.style.backgroundColor = "#28a745";
	}
	button.addEventListener("click", () => {
		if (isDone) {
			deleteDoneTodo(todo);
		} else {
			completeTodo(todo);
		}
	});
	li.appendChild(button);
	return li;
};
todoForm.addEventListener("submit", (e) => {
	e.preventDefault();
	const text = getTodoText();
	if (text) {
		addTodo(text);
	}
});
renderTodos();
