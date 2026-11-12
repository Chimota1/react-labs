import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { taskRepository } from '../repositories/taskRepository'
import type {
  Task,
  TaskFilter,
  TaskPriority,
  ToastMessage,
  ToastType,
} from '../types'
import { TaskContext } from './TaskContext'
import type { TaskContextType } from './TaskContext'

const PAGE_SIZE = 10

export function TaskProvider({ children }: { children: ReactNode }) {
  // Server state
  const [tasks, setTasks] = useState<Task[]>([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [refreshIndex, setRefreshIndex] = useState(0)

  // Client / UI state
  const [currentPage, setCurrentPage] = useState(1)
  const [filter, setFilter] = useState<TaskFilter>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [selectedDetailTaskId, setSelectedDetailTaskId] = useState<number | null>(null)
  const [deletingTask, setDeletingTask] = useState<Task | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [toast, setToast] = useState<ToastMessage | null>(null)

  // Toast helpers
  const showToast = useCallback(
    (message: string, type: ToastType = 'info', duration = 3000) => {
      setToast({
        id: `toast-${Date.now()}-${Math.random()}`,
        message,
        type,
        duration,
        hasProgressBar: false,
      })
    },
    [],
  )

  const hideToast = useCallback(() => {
    setToast(null)
  }, [])

  // Auto-dismiss toast
  useEffect(() => {
    if (!toast || !toast.duration) {
      return
    }

    const timer = window.setTimeout(() => {
      setToast(null)
    }, toast.duration)

    return () => {
      window.clearTimeout(timer)
    }
  }, [toast])

  // Debounce search query (300ms) - Bonus requirement
  useEffect(() => {
    const handler = window.setTimeout(() => {
      setDebouncedQuery(searchQuery.trim().toLocaleLowerCase())
    }, 300)

    return () => {
      window.clearTimeout(handler)
    }
  }, [searchQuery])

  // Fetch tasks with AbortController cancellation on page switch
  useEffect(() => {
    const controller = new AbortController()
    let isCancelled = false

    const loadTasks = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const skip = (currentPage - 1) * PAGE_SIZE
        const data = await taskRepository.getAll({
          limit: PAGE_SIZE,
          skip,
          signal: controller.signal,
        })

        if (!isCancelled) {
          setTasks(data.tasks)
          setTotal(data.total)
        }
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          // Request was cancelled due to page change or unmount, ignore
          return
        }

        if (!isCancelled) {
          setError(
            err instanceof Error
              ? err.message
              : 'Не вдалося завантажити список завдань із сервера',
          )
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false)
        }
      }
    }

    void loadTasks()

    return () => {
      isCancelled = true
      controller.abort()
    }
  }, [currentPage, refreshIndex])

  // Browser title synchronization with count of active tasks on current page
  useEffect(() => {
    const activeCount = tasks.filter((t) => !t.completed).length
    document.title = `Study Planner — ${activeCount} active tasks`
  }, [tasks])

  const fetchTasks = useCallback(() => {
    setRefreshIndex((prev) => prev + 1)
  }, [])

  const setPage = useCallback((page: number) => {
    setCurrentPage(page)
  }, [])

  const openDetailModal = useCallback((id: number) => {
    setSelectedDetailTaskId(id)
  }, [])

  const closeDetailModal = useCallback(() => {
    setSelectedDetailTaskId(null)
  }, [])

  const openDeleteModal = useCallback((task: Task) => {
    setDeletingTask(task)
  }, [])

  const closeDeleteModal = useCallback(() => {
    setDeletingTask(null)
  }, [])

  // CRUD Operations via taskRepository
  const createTask = useCallback(
    async (data: {
      title: string
      description?: string
      priority?: TaskPriority
      category?: string
    }) => {
      try {
        const newTask = await taskRepository.create(data)
        // DummyJSON returns mock ID (e.g. 255); update client list
        setTasks((prev) => [newTask, ...prev])
        setTotal((prev) => prev + 1)
        showToast('Завдання успішно створено через REST API', 'success', 3000)
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : 'Помилка при створенні завдання через API'
        showToast(message, 'error', 4000)
        throw err
      }
    },
    [showToast],
  )

  const updateTask = useCallback(
    async (
      id: number,
      data: {
        title?: string
        description?: string
        priority?: TaskPriority
        category?: string
      },
    ) => {
      try {
        const updated = await taskRepository.update(id, data)
        setTasks((prev) =>
          prev.map((task) =>
            task.id === id ? { ...task, ...updated, ...data } : task,
          ),
        )
        setEditingTask(null)
        showToast('Завдання успішно оновлено через REST API', 'success', 3000)
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : 'Помилка при оновленні завдання через API'
        showToast(message, 'error', 4000)
        throw err
      }
    },
    [showToast],
  )

  // Optimistic update for toggleTask
  const toggleTask = useCallback(
    async (id: number) => {
      const originalTask = tasks.find((t) => t.id === id)
      if (!originalTask) return

      const nextStatus = !originalTask.completed

      // 1. Optimistic update in UI
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed: nextStatus } : t)),
      )

      try {
        // 2. Call API
        await taskRepository.update(id, { completed: nextStatus })
        showToast(
          nextStatus ? 'Завдання виконано' : 'Завдання відновлено',
          'success',
          2000,
        )
      } catch (err) {
        // 3. Rollback on failure
        setTasks((prev) =>
          prev.map((t) =>
            t.id === id ? { ...t, completed: originalTask.completed } : t,
          ),
        )
        const message =
          err instanceof Error
            ? err.message
            : 'Не вдалося оновити статус на сервері. Зміни скасовано.'
        showToast(message, 'error', 3500)
      }
    },
    [tasks, showToast],
  )

  // Confirm delete via API
  const confirmDeleteTask = useCallback(async () => {
    if (!deletingTask) return

    setIsDeleting(true)
    const targetId = deletingTask.id

    try {
      await taskRepository.delete(targetId)
      setTasks((prev) => prev.filter((t) => t.id !== targetId))
      setTotal((prev) => Math.max(0, prev - 1))
      showToast('Завдання успішно видалено через REST API', 'info', 3000)
      setDeletingTask(null)
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Помилка під час видалення завдання'
      showToast(message, 'error', 4000)
    } finally {
      setIsDeleting(false)
    }
  }, [deletingTask, showToast])

  // Derived filtered tasks on current page
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesStatus =
        filter === 'all'
          ? true
          : filter === 'active'
            ? !task.completed
            : task.completed

      const matchesTitle = debouncedQuery
        ? task.title.toLocaleLowerCase().includes(debouncedQuery)
        : true

      return matchesStatus && matchesTitle
    })
  }, [tasks, filter, debouncedQuery])

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  const contextValue = useMemo<TaskContextType>(
    () => ({
      tasks,
      filteredTasks,
      total,
      currentPage,
      pageSize: PAGE_SIZE,
      totalPages,
      isLoading,
      error,
      filter,
      searchQuery,
      editingTask,
      selectedDetailTaskId,
      deletingTask,
      isDeleting,
      toast,

      setFilter,
      setSearchQuery,
      setPage,
      setEditingTask,
      openDetailModal,
      closeDetailModal,
      openDeleteModal,
      closeDeleteModal,
      fetchTasks,
      createTask,
      updateTask,
      toggleTask,
      confirmDeleteTask,
      showToast,
      hideToast,
    }),
    [
      tasks,
      filteredTasks,
      total,
      currentPage,
      totalPages,
      isLoading,
      error,
      filter,
      searchQuery,
      editingTask,
      selectedDetailTaskId,
      deletingTask,
      isDeleting,
      toast,
      setPage,
      openDetailModal,
      closeDetailModal,
      openDeleteModal,
      closeDeleteModal,
      fetchTasks,
      createTask,
      updateTask,
      toggleTask,
      confirmDeleteTask,
      showToast,
      hideToast,
    ],
  )

  return (
    <TaskContext.Provider value={contextValue}>
      {children}
    </TaskContext.Provider>
  )
}
