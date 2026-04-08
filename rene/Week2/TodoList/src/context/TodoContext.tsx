import { createContext, useContext, useState } from "react";
import type { TodoItem } from "../types";

type TodoContextType = {
	todos: TodoItem[];
	addTodo: (text: string) => void;
	completeTodo: (id: number) => void;
	deleteTodo: (id: number) => void;
};

const TodoContext = createContext<TodoContextType | null>(null);

export function TodoProvider({ children }: { children: React.ReactNode }) {
	const [todos, setTodos] = useState<TodoItem[]>([]);

	const addTodo = (text: string) => {
		setTodos((prev) => [...prev, { id: Date.now(), text, status: "TODO" }]);
	};

	const completeTodo = (id: number) => {
		setTodos((prev) =>
			prev.map((t) => (t.id === id ? { ...t, status: "DONE" } : t)),
		);
	};

	const deleteTodo = (id: number) => {
		setTodos((prev) => prev.filter((t) => t.id !== id));
	};

	return (
		<TodoContext.Provider value={{ todos, addTodo, completeTodo, deleteTodo }}>
			{children}
		</TodoContext.Provider>
	);
}

export function useTodo() {
	const context = useContext(TodoContext);
	if (!context) throw new Error("useTodo must be used within TodoProvider");
	return context;
}
