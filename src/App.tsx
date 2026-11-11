import './App.scss'
import Header from './components/Header'
import TaskFilters from './components/TaskFilters'
import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList'
import TaskStats from './components/TaskStats'
import TaskToolbar from './components/TaskToolbar'
import Toast from './components/Toast'
import { TaskProvider } from './context/TaskProvider'

function StudyPlanner() {
  return (
    <main className="task-app">
      <Header
        title="Study Planner"
        subtitle="Плануйте навчання, відстежуйте прогрес і досягайте цілей."
      />
      <TaskForm />
      <TaskStats />
      <TaskFilters />
      <TaskToolbar />
      <TaskList />
      <Toast />
    </main>
  )
}

function App() {
  return (
    <TaskProvider>
      <StudyPlanner />
    </TaskProvider>
  )
}

export default App
