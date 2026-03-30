import type { TodoItem as TodoItemType } from '../types'
import { useTodo } from '../context/TodoContext'

type Props = {
  todo: TodoItemType
}

export default function TodoItem({ todo }: Props) {
  const { completeTodo, deleteTodo } = useTodo()

  const isDone = todo.status === 'DONE'
  const buttonLabel = isDone ? '삭제' : '완료'
  const buttonClassName = isDone ? 'delete' : 'complete'
  const handleAction = () => (isDone ? deleteTodo(todo.id) : completeTodo(todo.id))

  return (
    <li className="render-container__item">
      <span className="render-container__item-text">{todo.text}</span>
      <button
        className={`render-container__item-button ${buttonClassName}`}
        onClick={handleAction}
      >
        {buttonLabel}
      </button>
    </li>
  )
}
