import { useMemo, useState } from 'react'
import './App.scss'
import Header from './components/Header'
import TaskFilters from './components/TaskFilters'
import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList'
import TaskStats from './components/TaskStats'
import type { Task, TaskFilter } from './types'

const initialTasks: Task[] = [
  { id: 1, title: 'React Components', description: 'Опрацювати базові принципи компонентів React', completed: false, priority: 'high', category: 'React' },
  { id: 2, title: 'TypeScript Exercises', description: 'Виконати практичні вправи', completed: true, priority: 'medium', category: 'TypeScript' },
]

function App() {
  const [tasks, setTasks] = useState(initialTasks)
  const [filter, setFilter] = useState<TaskFilter>('all')
  const filteredTasks = useMemo(() => tasks.filter((task) => filter === 'all' || (filter === 'active' ? !task.completed : task.completed)), [tasks, filter])
  const emptyMessage = tasks.length === 0
    ? 'Завдань поки немає. Додайте перше навчальне завдання.'
    : 'За цим фільтром завдань немає.'

  const addTask = (task: Task) => setTasks((currentTasks) => [...currentTasks, task])
  const toggleTask = (id: number) => setTasks((currentTasks) => currentTasks.map((task) => task.id === id ? { ...task, completed: !task.completed } : task))
  const deleteTask = (id: number) => setTasks((currentTasks) => currentTasks.filter((task) => task.id !== id))

  return (
    <main className="task-app">
      <Header title="Список завдань" />
      <TaskForm onAddTask={addTask} />
      <TaskStats tasks={tasks} />
      <TaskFilters filter={filter} onFilterChange={setFilter} />
      <TaskList
        tasks={filteredTasks}
        emptyMessage={emptyMessage}
        onToggleTask={toggleTask}
        onDeleteTask={deleteTask}
      />
    </main>
  )
}

export default App
