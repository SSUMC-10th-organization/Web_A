type TodoStatus = "todo" | "done";

interface Todo {
	id: number;
	text: string;
	status: TodoStatus;
}

const todoForm = document.getElementById("todo-form") as HTMLFormElement | null;
const todoInput = document.getElementById(
	"todo-input",
) as HTMLInputElement | null;
const todoList = document.getElementById(
	"todo-list",
) as HTMLUListElement | null;
const doneList = document.getElementById(
	"done-list",
) as HTMLUListElement | null;

let todos: Todo[] = [];

function createEmptyMessage(message: string): HTMLLIElement {
	const emptyItem = document.createElement("li");
	emptyItem.className = "todo-item__empty";
	emptyItem.textContent = message;
	return emptyItem;
}

function completeTodo(id: number): void {
	todos = todos.map((todo: Todo) => {
		if (todo.id === id) {
			return { ...todo, status: "done" };
		}
		return todo;
	});

	renderTodos();
}

function deleteTodo(id: number): void {
	todos = todos.filter((todo: Todo) => todo.id !== id);
	renderTodos();
}

function createTodoItem(todo: Todo): HTMLLIElement {
	const item = document.createElement("li");
	item.className =
		todo.status === "done" ? "todo-item todo-item--done" : "todo-item";

	const text = document.createElement("span");
	text.className = "todo-item__text";
	text.textContent = todo.text;

	const button = document.createElement("button");
	button.className =
		todo.status === "done"
			? "todo-item__button todo-item__button--delete"
			: "todo-item__button todo-item__button--complete";

	if (todo.status === "done") {
		button.textContent = "삭제";
		button.addEventListener("click", () => deleteTodo(todo.id));
	} else {
		button.textContent = "완료";
		button.addEventListener("click", () => completeTodo(todo.id));
	}

	item.appendChild(text);
	item.appendChild(button);

	return item;
}

function renderTodos(): void {
	if (!todoList || !doneList) {
		return;
	}

	todoList.innerHTML = "";
	doneList.innerHTML = "";

	const todoItems = todos.filter((todo: Todo) => todo.status === "todo");
	const doneItems = todos.filter((todo: Todo) => todo.status === "done");

	if (todoItems.length === 0) {
		todoList.appendChild(createEmptyMessage("아직 등록된 할 일이 없습니다."));
	} else {
		todoItems.forEach((todo: Todo) => {
			todoList.appendChild(createTodoItem(todo));
		});
	}

	if (doneItems.length === 0) {
		doneList.appendChild(createEmptyMessage("아직 완료된 할 일이 없습니다."));
	} else {
		doneItems.forEach((todo: Todo) => {
			doneList.appendChild(createTodoItem(todo));
		});
	}
}

function addTodo(text: string): void {
	const newTodo: Todo = {
		id: Date.now(),
		text,
		status: "todo",
	};

	todos.push(newTodo);
	renderTodos();
}

if (todoForm && todoInput) {
	todoForm.addEventListener("submit", (event: SubmitEvent) => {
		event.preventDefault();

		const text = todoInput.value.trim();

		if (text === "") {
			alert("할 일을 입력해 주세요.");
			todoInput.focus();
			return;
		}

		addTodo(text);
		todoInput.value = "";
		todoInput.focus();
	});
}

renderTodos();
