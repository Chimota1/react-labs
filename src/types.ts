export type TaskPriority = 'low' | 'medium' | 'high'

export type Task = {
  id: number
  title: string
  description: string
  completed: boolean
  priority: TaskPriority
  category: string
}

export type TaskFilter = 'all' | 'active' | 'completed'
