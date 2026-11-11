import type { Task } from '../types'

export const initialTasks: Task[] = [
  {
    id: 1,
    title: 'React Components',
    description: 'Опрацювати базові принципи компонентів React',
    completed: false,
    priority: 'high',
    category: 'React',
  },
  {
    id: 2,
    title: 'TypeScript Exercises',
    description: 'Виконати практичні вправи',
    completed: true,
    priority: 'medium',
    category: 'TypeScript',
  },
  {
    id: 3,
    title: 'State & Effects',
    description: 'Опанувати useReducer, Context API та Custom Hooks',
    completed: false,
    priority: 'high',
    category: 'React',
  },
]
