import TodoForm from "./components/TodoForm";
import TodoSection from "./components/TodoSection";

function App() {
	return (
		<div className="todo-container">
			<h1 className="todo-container__header">YONG TODO</h1>
			<TodoForm />

			<div className="render-container">
				<TodoSection title="할 일" type="todo" />
				<TodoSection title="완료" type="done" />
			</div>
		</div>
	);
}

export default App;
