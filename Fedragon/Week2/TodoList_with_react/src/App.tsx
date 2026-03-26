import React, { useState } from 'react';
import { useTheme } from './context/ThemeContext';
import './App.css';

interface Todo {
    id: number;
    text: string;
    isCompleted: boolean;
}

function App() {
    const { isDarkMode, toggleTheme } = useTheme();
    const [todos, setTodos] = useState<Todo[]>([]);
    const [inputValue, setInputValue] = useState<string>('');

    const addTodo = (e?: React.KeyboardEvent) => {
        if (e?.nativeEvent.isComposing) return;
        if (inputValue.trim() === '') return;
        const newTodo = { id: Date.now(), text: inputValue, isCompleted: false };
        setTodos((prev) => [...prev, newTodo]);
        setInputValue('');
    };

    return (
        /* 💡 1. 최상단 div: style 속성을 써서 상태에 따라 배경색/글자색 강제 변경 */
        <div 
            style={{ 
                backgroundColor: isDarkMode ? '#000000' : '#ffffff', 
                color: isDarkMode ? '#ffffff' : '#000000' 
            }}
            className="min-h-screen w-full flex flex-col items-center justify-center transition-colors duration-300 px-4"
        >
            <header className="w-full max-w-[450px] flex justify-between items-center mb-8">
                <h1 className="text-2xl font-extrabold tracking-tighter">UMC Todo</h1>
                <button
                    type="button"
                    onClick={toggleTheme}
                    /* 💡 2. 버튼 색상도 상태에 따라 강제 변경 */
                    style={{ 
                        backgroundColor: isDarkMode ? '#3f3f46' : '#f3f4f6',
                        color: isDarkMode ? '#ffffff' : '#000000'
                    }}
                    className="px-4 py-2 rounded-xl border border-gray-200 dark:border-zinc-700 shadow-sm font-bold text-sm"
                >
                    {isDarkMode ? '☀️ LIGHT MODE' : '🌙 DARK MODE'}
                </button>
            </header>

            {/* 💡 3. 메인 박스: bg-[#f0f4f9](라이트) / bg-[#18181b](다크) */}
            <main 
                style={{ backgroundColor: isDarkMode ? '#18181b' : '#f0f4f9' }}
                className="todo border border-gray-100 dark:border-zinc-800"
            >
                <div className="todo__input-group">
                    <input
                        /* 💡 4. 입력창 배경색 강제 변경 */
                        style={{ backgroundColor: isDarkMode ? '#27272a' : '#ffffff' }}
                        className="todo__input dark:text-white dark:border-zinc-700"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addTodo(e)}
                        placeholder="할 일을 입력하세요"
                    />
                    <button type="button" className="todo__button todo__button--add shadow-md" onClick={() => addTodo()}>추가</button>
                </div>

                <div className="todo__container">
                    <div className="todo__section">
                        <h2 className="todo__subtitle font-bold text-gray-500">해야 할 일</h2>
                        <ul className="todo__list">
                            {todos.filter(t => !t.isCompleted).map(todo => (
                                <li 
                                    key={todo.id} 
                                    style={{ backgroundColor: isDarkMode ? '#27272a' : '#ffffff' }}
                                    className="todo__item shadow-sm"
                                >
                                    <span className="text-sm font-medium">{todo.text}</span>
                                    <button type="button" className="todo__button todo__button--complete" onClick={() => setTodos(prev => prev.map(t => t.id === todo.id ? {...t, isCompleted: true} : t))}>완료</button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="todo__section">
                        <h2 className="todo__subtitle font-bold text-gray-500">해낸 일</h2>
                        <ul className="todo__list">
                            {todos.filter(t => t.isCompleted).map(todo => (
                                <li 
                                    key={todo.id} 
                                    style={{ backgroundColor: isDarkMode ? '#3f3f46' : '#f1f5f9' }}
                                    className="todo__item opacity-80"
                                >
                                    <span className="text-sm line-through text-gray-400">{todo.text}</span>
                                    <button type="button" className="todo__button todo__button--delete" onClick={() => setTodos(prev => prev.filter(t => t.id !== todo.id))}>삭제</button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default App;