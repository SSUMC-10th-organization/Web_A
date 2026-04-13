import Todo from "./components/Todo";
import { TodoProvider } from "./context/TodoProvider";

function App() {
	return (
		<TodoProvider>
			<Todo />
		</TodoProvider>
	);
}

export default App;
