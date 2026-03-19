const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const doneList = document.getElementById('doneList');
let todos = JSON.parse(localStorage.getItem('todos') || '[]');
const render = () => {
    todoList.innerHTML = '';
    doneList.innerHTML = '';
    todos.forEach((todo) => {
        const li = document.createElement('li');
        li.className = 'todo-item';
        const btnText = todo.completed ? '삭제' : '완료';
        const btnClass = todo.completed ? 'todo-item__btn--delete' : 'todo-item__btn--complete';
        li.innerHTML = `
            <span class="todo-item__text">${todo.text}</span>
            <button class="todo-item__btn ${btnClass}">${btnText}</button>
        `;
        const btn = li.querySelector('button');
        btn.onclick = () => {
            if (!todo.completed) {
                todo.completed = true;
            }
            else {
                todos = todos.filter(t => t.id !== todo.id);
            }
            saveAndRender();
        };
        if (todo.completed) {
            doneList.appendChild(li);
        }
        else {
            todoList.appendChild(li);
        }
    });
};
const saveAndRender = () => {
    localStorage.setItem('todos', JSON.stringify(todos));
    render();
};
const addTodo = () => {
    const text = todoInput.value.trim();
    if (!text)
        return;
    const newTodo = {
        id: Date.now(),
        text,
        completed: false
    };
    todos.push(newTodo);
    todoInput.value = '';
    saveAndRender();
};
addBtn.onclick = addTodo;
todoInput.onkeydown = (e) => { if (e.key === 'Enter')
    addTodo(); };
render();
export {};
