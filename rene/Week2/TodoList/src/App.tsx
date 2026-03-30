import TodoForm from './components/TodoForm' //할 일 입력하는 폼 컴포넌트
import TodoSection from './components/TodoSection' //할 일 컨테이너 섹션
import './App.css'

const title = 'rene todo'; 

export default function App() {
  return (
    <div className="todo-container">
      <h1 className="todo-container__header">{title}</h1>
      <TodoForm />
      <div className="render-container">
        <TodoSection title="미완료" status="TODO" />
        <TodoSection title="완료" status="DONE" />
      </div>
    </div>
  )
}
