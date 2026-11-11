import { createContext } from 'react'
import type {
  Task,
  TaskFilter,
  TaskPriority,
  ToastMessage,
  ToastType,
} from '../types'

export type TaskContextType = {
  tasks: Task[]
  filteredTasks: Task[]
  filter: TaskFilter
  searchQuery: string
  editingTask: Task | null
  toast: ToastMessage | null
  setFilter: (filter: TaskFilter) => void
  setSearchQuery: (query: string) => void
  setEditingTask: (task: Task | null) => void
  addTask: (data: {
    title: string
    description: string
    priority: TaskPriority
    category: string
  }) => void
  updateTask: (
    id: number,
    data: {
      title: string
      description: string
      priority: TaskPriority
      category: string
    },
  ) => void
  toggleTask: (id: number) => void
  requestDelete: (id: number) => void
  undoDelete: (id: number) => void
  clearCompleted: () => void
  undoClearCompleted: () => void
  resetTasks: () => void
  showToast: (message: string, type?: ToastType, duration?: number) => void
  hideToast: () => void
}

export const TaskContext = createContext<TaskContextType | undefined>(undefined)
