export type TodoStatus = '미완료' | '완료'

export type TodoItem = {
  id: number
  text: string
  status: TodoStatus
}
