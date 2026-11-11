import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react'
import type { ReactNode } from 'react'
import { initialTasks } from '../data/initialTasks'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { initialTaskState, taskReducer } from '../reducers/taskReducer'
import type {
  Task,
  TaskFilter,
  TaskPriority,
  TaskState,
  ToastMessage,
  ToastType,
} from '../types'
import { TaskContext } from './TaskContext'
import type { TaskContextType } from './TaskContext'

const TASKS_STORAGE_KEY = 'study_planner_tasks'
const FILTER_STORAGE_KEY = 'study_planner_filter'

function initTaskState(): TaskState {
  try {
    const raw = window.localStorage.getItem(TASKS_STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return {
          tasks: parsed.map((item: Task) => ({
            ...item,
            isPendingDelete: false,
          })),
          pendingDeleteId: null,
          isPendingClearCompleted: false,
        }
      }
    }
  } catch (error) {
    console.error('Failed to load tasks from localStorage:', error)
  }
  return initialTaskState
}

export function TaskProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(taskReducer, undefined, initTaskState)
  const [filter, setFilter] = useLocalStorage<TaskFilter>(FILTER_STORAGE_KEY, 'all')
  const [searchQuery, setSearchQuery] = useState('')
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [toast, setToast] = useState<ToastMessage | null>(null)

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

  // 1. Sync tasks with localStorage
  useEffect(() => {
    try {
      const persistableTasks = state.tasks
        .filter((task) => !task.isPendingDelete)
        .map(({ id, title, description, completed, priority, category }) => ({
          id,
          title,
          description,
          completed,
          priority,
          category,
        }))
      window.localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(persistableTasks))
    } catch (error) {
      console.error('Failed to sync tasks with localStorage:', error)
    }
  }, [state.tasks])

  // 2. Cross-tab synchronization via storage event
  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === TASKS_STORAGE_KEY && event.newValue) {
        try {
          const syncedTasks = JSON.parse(event.newValue)
          if (Array.isArray(syncedTasks)) {
            dispatch({ type: 'syncStorage', payload: syncedTasks })
          }
        } catch (error) {
          console.error('Error handling cross-tab storage event:', error)
        }
      }
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  // 3. Document title synchronization with active tasks count
  useEffect(() => {
    const activeTasksCount = state.tasks.filter(
      (task) => !task.completed && !task.isPendingDelete,
    ).length
    document.title = `Study Planner — ${activeTasksCount} active ${
      activeTasksCount === 1 ? 'task' : 'tasks'
    }`
  }, [state.tasks])

  // 4. Undoable Delete Timer Effect
  useEffect(() => {
    if (state.pendingDeleteId === null) {
      return
    }

    const targetId = state.pendingDeleteId
    const timer = window.setTimeout(() => {
      dispatch({ type: 'confirmDelete', payload: { id: targetId } })
      setToast({
        id: `confirmed-${Date.now()}`,
        message: 'Завдання остаточно видалено',
        type: 'info',
        duration: 3000,
        hasProgressBar: false,
      })
    }, 5000)

    return () => {
      window.clearTimeout(timer)
    }
  }, [state.pendingDeleteId])

  // 5. Undoable Clear Completed Effect
  useEffect(() => {
    if (!state.isPendingClearCompleted) {
      return
    }

    const timer = window.setTimeout(() => {
      dispatch({ type: 'confirmClearCompleted' })
      setToast({
        id: `confirmed-clear-${Date.now()}`,
        message: 'Виконані завдання видалено',
        type: 'info',
        duration: 3000,
        hasProgressBar: false,
      })
    }, 5000)

    return () => {
      window.clearTimeout(timer)
    }
  }, [state.isPendingClearCompleted])

  // 6. Normal Toast Auto-dismiss Effect (when no progress bar)
  useEffect(() => {
    if (!toast || toast.hasProgressBar || !toast.duration) {
      return
    }

    const timer = window.setTimeout(() => {
      setToast(null)
    }, toast.duration)

    return () => {
      window.clearTimeout(timer)
    }
  }, [toast])

  // 7. Operations exposed to components
  const addTask = useCallback(
    (data: {
      title: string
      description: string
      priority: TaskPriority
      category: string
    }) => {
      dispatch({ type: 'add', payload: data })
      showToast('Завдання успішно додано', 'success', 3000)
    },
    [showToast],
  )

  const updateTask = useCallback(
    (
      id: number,
      data: {
        title: string
        description: string
        priority: TaskPriority
        category: string
      },
    ) => {
      dispatch({ type: 'update', payload: { id, data } })
      setEditingTask(null)
      showToast('Завдання успішно оновлено', 'success', 3000)
    },
    [showToast],
  )

  const toggleTask = useCallback((id: number) => {
    dispatch({ type: 'toggle', payload: { id } })
  }, [])

  const undoDelete = useCallback((id: number) => {
    dispatch({ type: 'undoDelete', payload: { id } })
    setToast({
      id: `undo-${Date.now()}`,
      message: 'Видалення скасовано',
      type: 'info',
      duration: 2500,
      hasProgressBar: false,
    })
  }, [])

  const requestDelete = useCallback(
    (id: number) => {
      dispatch({ type: 'requestDelete', payload: { id } })
      const taskToDelete = state.tasks.find((task) => task.id === id)
      const taskTitle = taskToDelete ? `«${taskToDelete.title}»` : 'Завдання'
      setToast({
        id: `delete-${id}`,
        message: `${taskTitle} буде видалено`,
        type: 'warning',
        duration: 5000,
        hasProgressBar: true,
        action: {
          label: 'Скасувати',
          onClick: () => {
            undoDelete(id)
          },
        },
      })
    },
    [state.tasks, undoDelete],
  )

  const undoClearCompleted = useCallback(() => {
    dispatch({ type: 'undoClearCompleted' })
    setToast({
      id: `undo-clear-${Date.now()}`,
      message: 'Очищення виконаних скасовано',
      type: 'info',
      duration: 2500,
      hasProgressBar: false,
    })
  }, [])

  const clearCompleted = useCallback(() => {
    const hasCompleted = state.tasks.some(
      (task) => task.completed && !task.isPendingDelete,
    )
    if (!hasCompleted) {
      showToast('Немає виконаних завдань для очищення', 'info', 2500)
      return
    }
    dispatch({ type: 'requestClearCompleted' })
    setToast({
      id: 'clear-completed',
      message: 'Виконані завдання будуть видалені',
      type: 'warning',
      duration: 5000,
      hasProgressBar: true,
      action: {
        label: 'Скасувати',
        onClick: () => {
          undoClearCompleted()
        },
      },
    })
  }, [state.tasks, showToast, undoClearCompleted])

  const resetTasks = useCallback(() => {
    dispatch({ type: 'reset', payload: initialTasks })
    setEditingTask(null)
    showToast('Дані скинуто до початкових', 'info', 3000)
  }, [showToast])

  // 8. Derived state: Filtered tasks calculated during render
  const filteredTasks = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLocaleLowerCase()

    return state.tasks.filter((task) => {
      const matchesStatus =
        filter === 'all'
          ? true
          : filter === 'active'
            ? !task.completed
            : task.completed

      const matchesTitle = task.title
        .toLocaleLowerCase()
        .includes(normalizedQuery)

      return matchesStatus && matchesTitle
    })
  }, [state.tasks, filter, searchQuery])

  // 9. Context value memoization
  const contextValue = useMemo<TaskContextType>(
    () => ({
      tasks: state.tasks,
      filteredTasks,
      filter,
      searchQuery,
      editingTask,
      toast,
      setFilter,
      setSearchQuery,
      setEditingTask,
      addTask,
      updateTask,
      toggleTask,
      requestDelete,
      undoDelete,
      clearCompleted,
      undoClearCompleted,
      resetTasks,
      showToast,
      hideToast,
    }),
    [
      state.tasks,
      filteredTasks,
      filter,
      searchQuery,
      editingTask,
      toast,
      setFilter,
      setSearchQuery,
      setEditingTask,
      addTask,
      updateTask,
      toggleTask,
      requestDelete,
      undoDelete,
      clearCompleted,
      undoClearCompleted,
      resetTasks,
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
