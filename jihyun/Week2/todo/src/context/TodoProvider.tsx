import {
	type ChangeEvent,
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useMemo,
	useState,
} from "react";
import type { Todo } from "../types/todo";

interface TodoContextType {
	input: string;
	todos: Todo[];
	doneTodos: Todo[];
	handleChangeInput: (e: ChangeEvent<HTMLInputElement>) => void;
	addTodo: () => void;
	completeTodo: (todo: Todo) => void;
	deleteDoneTodo: (todo: Todo) => void;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const TodoProvider = ({ children }: { children: ReactNode }) => {
	const [input, setInput] = useState<string>("");
	const [todos, setTodos] = useState<Todo[]>([]);
	const [doneTodos, setDoneTodos] = useState<Todo[]>([]);

	// ✅ useCallback 추가
	const handleChangeInput = useCallback((e: ChangeEvent<HTMLInputElement>) => {
		setInput(e.target.value);
	}, []);

	const addTodo = useCallback(() => {
		const trimmed = input.trim();
		if (!trimmed) return;

		const newTodo: Todo = {
			id: Date.now(),
			text: trimmed,
		};

		setTodos((prev) => [...prev, newTodo]);
		setInput("");
	}, [input]);

	const completeTodo = useCallback((todo: Todo) => {
		setTodos((prev) => prev.filter((item) => item.id !== todo.id));
		setDoneTodos((prev) => [...prev, todo]);
	}, []);

	const deleteDoneTodo = useCallback((todo: Todo) => {
		setDoneTodos((prev) => prev.filter((item) => item.id !== todo.id));
	}, []);

	const value = useMemo(
		() => ({
			input,
			todos,
			doneTodos,
			handleChangeInput,
			addTodo,
			completeTodo,
			deleteDoneTodo,
		}),
		[
			input,
			todos,
			doneTodos,
			handleChangeInput,
			addTodo,
			completeTodo,
			deleteDoneTodo,
		],
	);

	return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
};

export const useTodo = () => {
	const context = useContext(TodoContext);

	if (!context) {
		throw new Error(
			"useTodo는 반드시 TodoProvider 내부에서 사용되어야 합니다.",
		);
	}

	return context;
};
