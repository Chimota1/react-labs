import { initialTasks } from '../data/initialTasks'
import type { TaskAction, TaskState } from '../types'

export const initialTaskState: TaskState = {
  tasks: initialTasks,
  pendingDeleteId: null,
  isPendingClearCompleted: false,
}

export function taskReducer(state: TaskState, action: TaskAction): TaskState {
  switch (action.type) {
    case 'add': {
      const newTask = {
        id: Date.now(),
        title: action.payload.title.trim(),
        description: action.payload.description.trim(),
        completed: false,
        priority: action.payload.priority,
        category: action.payload.category.trim(),
        isPendingDelete: false,
      }
      return {
        ...state,
        tasks: [newTask, ...state.tasks],
      }
    }

    case 'toggle': {
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id
            ? { ...task, completed: !task.completed }
            : task,
        ),
      }
    }

    case 'update': {
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id
            ? {
                ...task,
                title: action.payload.data.title.trim(),
                description: action.payload.data.description.trim(),
                priority: action.payload.data.priority,
                category: action.payload.data.category.trim(),
              }
            : task,
        ),
      }
    }

    case 'requestDelete': {
      const targetId = action.payload.id
      // If there was an existing pending delete on a different task, confirm it first
      const cleanedTasks = state.pendingDeleteId && state.pendingDeleteId !== targetId
        ? state.tasks.filter((t) => t.id !== state.pendingDeleteId)
        : state.tasks

      return {
        ...state,
        pendingDeleteId: targetId,
        tasks: cleanedTasks.map((task) =>
          task.id === targetId ? { ...task, isPendingDelete: true } : task,
        ),
      }
    }

    case 'undoDelete': {
      const targetId = action.payload.id
      return {
        ...state,
        pendingDeleteId: state.pendingDeleteId === targetId ? null : state.pendingDeleteId,
        tasks: state.tasks.map((task) =>
          task.id === targetId ? { ...task, isPendingDelete: false } : task,
        ),
      }
    }

    case 'confirmDelete': {
      const targetId = action.payload.id
      return {
        ...state,
        pendingDeleteId: state.pendingDeleteId === targetId ? null : state.pendingDeleteId,
        tasks: state.tasks.filter((task) => task.id !== targetId),
      }
    }

    case 'requestClearCompleted': {
      return {
        ...state,
        isPendingClearCompleted: true,
        tasks: state.tasks.map((task) =>
          task.completed ? { ...task, isPendingDelete: true } : task,
        ),
      }
    }

    case 'undoClearCompleted': {
      return {
        ...state,
        isPendingClearCompleted: false,
        tasks: state.tasks.map((task) =>
          task.isPendingDelete ? { ...task, isPendingDelete: false } : task,
        ),
      }
    }

    case 'confirmClearCompleted': {
      return {
        ...state,
        isPendingClearCompleted: false,
        tasks: state.tasks.filter((task) => !task.completed),
      }
    }

    case 'reset': {
      return {
        tasks: action.payload ? action.payload : initialTasks,
        pendingDeleteId: null,
        isPendingClearCompleted: false,
      }
    }

    case 'syncStorage': {
      return {
        ...state,
        tasks: action.payload.map((t) => ({ ...t, isPendingDelete: false })),
        pendingDeleteId: null,
        isPendingClearCompleted: false,
      }
    }

    default:
      return state
  }
}
