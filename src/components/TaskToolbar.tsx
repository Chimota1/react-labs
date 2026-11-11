import { useTaskContext } from '../hooks/useTaskContext'
import './TaskToolbar.scss'

export function TaskToolbar() {
  const { tasks, clearCompleted, resetTasks } = useTaskContext()

  const completedCount = tasks.filter(
    (task) => task.completed && !task.isPendingDelete,
  ).length

  return (
    <div className="task-toolbar" aria-label="Панель керування списком">
      <button
        type="button"
        className="task-toolbar__button task-toolbar__button--clear"
        disabled={completedCount === 0}
        onClick={clearCompleted}
        title="Очистити всі виконані завдання (з можливістю скасування)"
      >
        Очистити виконані {completedCount > 0 && `(${completedCount})`}
      </button>

      <button
        type="button"
        className="task-toolbar__button task-toolbar__button--reset"
        onClick={resetTasks}
        title="Скинути список до початкових демонстраційних даних"
      >
        Скинути дані
      </button>
    </div>
  )
}

export default TaskToolbar
