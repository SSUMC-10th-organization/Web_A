import type { TodoStatus } from '../types'
import { useTodo } from '../context/TodoContext'
import TodoItem from './TodoItem'

type Props = {
  title: string
  status: TodoStatus
}

export default function TodoSection({ title, status }: Props) {
  const { todos } = useTodo()
  const filtered = todos.filter((t) => t.status === status)

  return (
    <div className="render-container__section">
      <h2 className="render-container__title">{title}</h2>
      <ul className="render-container__list">
        {filtered.map((todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </ul>
    </div>
  )
}
