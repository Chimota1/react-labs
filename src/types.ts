export type TaskPriority = 'low' | 'medium' | 'high'

export type Task = {
  id: number
  title: string
  description: string
  completed: boolean
  priority: TaskPriority
  category: string
  isPendingDelete?: boolean
}

export type TaskFilter = 'all' | 'active' | 'completed'

export type TaskAction =
  | {
      type: 'add'
      payload: {
        title: string
        description: string
        priority: TaskPriority
        category: string
      }
    }
  | { type: 'toggle'; payload: { id: number } }
  | {
      type: 'update'
      payload: {
        id: number
        data: {
          title: string
          description: string
          priority: TaskPriority
          category: string
        }
      }
    }
  | { type: 'requestDelete'; payload: { id: number } }
  | { type: 'undoDelete'; payload: { id: number } }
  | { type: 'confirmDelete'; payload: { id: number } }
  | { type: 'requestClearCompleted' }
  | { type: 'undoClearCompleted' }
  | { type: 'confirmClearCompleted' }
  | { type: 'reset'; payload?: Task[] }
  | { type: 'syncStorage'; payload: Task[] }

export type TaskState = {
  tasks: Task[]
  pendingDeleteId: number | null
  isPendingClearCompleted: boolean
}

export type ToastType = 'info' | 'success' | 'warning' | 'error'

export type ToastAction = {
  label: string
  onClick: () => void
}

export type ToastMessage = {
  id: string
  message: string
  type: ToastType
  duration?: number
  action?: ToastAction
  hasProgressBar?: boolean
}
