import { useContext } from 'react'
import { TaskContext } from '../context/TaskContext'
import type { TaskContextType } from '../context/TaskContext'

export function useTaskContext(): TaskContextType {
  const context = useContext(TaskContext)

  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider')
  }

  return context
}
