var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var todoForm = document.getElementById("todo-form");
var todoInput = document.getElementById("todo-input");
var todoList = document.getElementById("todo-list");
var doneList = document.getElementById("done-list");
var todos = [];
function createEmptyMessage(message) {
    var emptyItem = document.createElement("li");
    emptyItem.className = "todo-item__empty";
    emptyItem.textContent = message;
    return emptyItem;
}
function completeTodo(id) {
    todos = todos.map(function (todo) {
        if (todo.id === id) {
            return __assign(__assign({}, todo), { status: "done" });
        }
        return todo;
    });
    renderTodos();
}
function deleteTodo(id) {
    todos = todos.filter(function (todo) { return todo.id !== id; });
    renderTodos();
}
function createTodoItem(todo) {
    var item = document.createElement("li");
    item.className = todo.status === "done" ? "todo-item todo-item--done" : "todo-item";
    var text = document.createElement("span");
    text.className = "todo-item__text";
    text.textContent = todo.text;
    var button = document.createElement("button");
    button.className =
        todo.status === "done"
            ? "todo-item__button todo-item__button--delete"
            : "todo-item__button todo-item__button--complete";
    if (todo.status === "done") {
        button.textContent = "삭제";
        button.addEventListener("click", function () { return deleteTodo(todo.id); });
    }
    else {
        button.textContent = "완료";
        button.addEventListener("click", function () { return completeTodo(todo.id); });
    }
    item.appendChild(text);
    item.appendChild(button);
    return item;
}
function renderTodos() {
    if (!todoList || !doneList) {
        return;
    }
    todoList.innerHTML = "";
    doneList.innerHTML = "";
    var todoItems = todos.filter(function (todo) { return todo.status === "todo"; });
    var doneItems = todos.filter(function (todo) { return todo.status === "done"; });
    if (todoItems.length === 0) {
        todoList.appendChild(createEmptyMessage("아직 등록된 할 일이 없습니다."));
    }
    else {
        todoItems.forEach(function (todo) {
            todoList.appendChild(createTodoItem(todo));
        });
    }
    if (doneItems.length === 0) {
        doneList.appendChild(createEmptyMessage("아직 완료된 할 일이 없습니다."));
    }
    else {
        doneItems.forEach(function (todo) {
            doneList.appendChild(createTodoItem(todo));
        });
    }
}
function addTodo(text) {
    var newTodo = {
        id: Date.now(),
        text: text,
        status: "todo",
    };
    todos.push(newTodo);
    renderTodos();
}
if (todoForm && todoInput) {
    todoForm.addEventListener("submit", function (event) {
        event.preventDefault();
        var text = todoInput.value.trim();
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
