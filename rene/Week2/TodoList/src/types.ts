export type TodoStatus = 'TODO' | 'DONE'

export type TodoItem = {
  id: number
  text: string
  status: TodoStatus
}
