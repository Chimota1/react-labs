import { createContext } from 'react'
import type { Task, TaskFilter, TaskPriority, ToastMessage, ToastType } from '../types'

export type TaskContextType = {
  tasks: Task[]
  filteredTasks: Task[]
  total: number
  currentPage: number
  pageSize: number
  totalPages: number
  isLoading: boolean
  error: string | null
  filter: TaskFilter
  searchQuery: string
  editingTask: Task | null
  selectedDetailTaskId: number | null
  deletingTask: Task | null
  isDeleting: boolean
  toast: ToastMessage | null

  setFilter: (filter: TaskFilter) => void
  setSearchQuery: (query: string) => void
  setPage: (page: number) => void
  setEditingTask: (task: Task | null) => void
  openDetailModal: (id: number) => void
  closeDetailModal: () => void
  openDeleteModal: (task: Task) => void
  closeDeleteModal: () => void
  fetchTasks: () => void
  cancelGetRequest: () => void
  createTask: (data: {
    title: string
    description?: string
    priority?: TaskPriority
    category?: string
  }) => Promise<void>
  updateTask: (
    id: number,
    data: {
      title?: string
      description?: string
      priority?: TaskPriority
      category?: string
    },
  ) => Promise<void>
  toggleTask: (id: number) => Promise<void>
  confirmDeleteTask: () => Promise<void>
  showToast: (message: string, type?: ToastType, duration?: number) => void
  hideToast: () => void
}

export const TaskContext = createContext<TaskContextType | undefined>(undefined)
