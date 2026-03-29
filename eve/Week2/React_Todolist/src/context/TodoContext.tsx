import type React from "react";
import { createContext, useContext, useState } from "react";

interface Task {
	id: number;
	text: string;
}

interface TodoContextType {
	todos: Task[];
	doneTasks: Task[];
	todoInput: string;
	setTodoInput: (value: string) => void;
	addTodo: (e: React.FormEvent) => void;
	completeTask: (task: Task) => void;
	deleteTask: (task: Task) => void;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const TodoProvider = ({ children }: { children: React.ReactNode }) => {
	const [todoInput, setTodoInput] = useState<string>("");
	const [todos, setTodos] = useState<Task[]>([]);
	const [doneTasks, setDoneTasks] = useState<Task[]>([]);

	const addTodo = (e: React.FormEvent) => {
		e.preventDefault();
		if (!todoInput.trim()) return;
		setTodos([...todos, { id: Date.now(), text: todoInput }]);
		setTodoInput("");
	};

	const completeTask = (task: Task) => {
		setTodos(todos.filter((t) => t.id !== task.id));
		setDoneTasks([...doneTasks, task]);
	};

	const deleteTask = (task: Task) => {
		setDoneTasks(doneTasks.filter((t) => t.id !== task.id));
	};

	return (
		<TodoContext.Provider
			value={{
				todos,
				doneTasks,
				todoInput,
				setTodoInput,
				addTodo,
				completeTask,
				deleteTask,
			}}
		>
			{children}
		</TodoContext.Provider>
	);
};

export const useTodo = () => {
	const context = useContext(TodoContext);
	if (!context) throw new Error("useTodo must be used within a TodoProvider");
	return context;
};
