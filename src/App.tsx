import './App.scss'
import DeleteConfirmModal from './components/DeleteConfirmModal'
import Header from './components/Header'
import TaskDetailModal from './components/TaskDetailModal'
import TaskFilters from './components/TaskFilters'
import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList'
import TaskStats from './components/TaskStats'
import TaskToolbar from './components/TaskToolbar'
import Toast from './components/Toast'
import { TaskProvider } from './context/TaskProvider'
import { useTaskContext } from './hooks/useTaskContext'

function StudyPlannerContent() {
  const {
    selectedDetailTaskId,
    closeDetailModal,
    deletingTask,
    isDeleting,
    confirmDeleteTask,
    closeDeleteModal,
  } = useTaskContext()

  return (
    <main className="task-app">
      <Header
        title="Study Planner"
        subtitle="Інтеграція з REST API (DummyJSON), Repository Pattern та CRUD операції."
      />
      <TaskForm />
      <TaskStats />
      <TaskFilters />
      <TaskToolbar />
      <TaskList />
      <Toast />

      {/* Task detail modal (GET /todos/:id with AbortController) */}
      <TaskDetailModal
        taskId={selectedDetailTaskId}
        onClose={closeDetailModal}
      />

      {/* Delete confirmation modal */}
      <DeleteConfirmModal
        isOpen={Boolean(deletingTask)}
        taskTitle={deletingTask?.title ?? ''}
        isDeleting={isDeleting}
        onConfirm={confirmDeleteTask}
        onCancel={closeDeleteModal}
      />
    </main>
  )
}

function App() {
  return (
    <TaskProvider>
      <StudyPlannerContent />
    </TaskProvider>
  )
}

export default App
