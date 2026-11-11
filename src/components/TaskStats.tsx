import { useTaskContext } from '../hooks/useTaskContext'
import './TaskStats.scss'

export function TaskStats() {
  const { tasks } = useTaskContext()

  // Derived state calculated during render - no useEffect used for derived stats!
  const activeExistingTasks = tasks.filter((task) => !task.isPendingDelete)
  const totalCount = activeExistingTasks.length
  const completedCount = activeExistingTasks.filter((task) => task.completed).length
  const pendingCount = totalCount - completedCount

  return (
    <section className="task-stats" aria-label="Статистика завдань">
      <div className="task-stats__item">
        <span className="task-stats__label">Усього</span>
        <strong className="task-stats__value">{totalCount}</strong>
      </div>
      <div className="task-stats__item">
        <span className="task-stats__label">Виконано</span>
        <strong className="task-stats__value task-stats__value--completed">
          {completedCount}
        </strong>
      </div>
      <div className="task-stats__item">
        <span className="task-stats__label">Не виконано</span>
        <strong className="task-stats__value task-stats__value--pending">
          {pendingCount}
        </strong>
      </div>
    </section>
  )
}

export default TaskStats
