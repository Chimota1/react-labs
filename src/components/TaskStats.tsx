import type { Task } from '../types'

type TaskStatsProps = {
  tasks: Task[]
}

function TaskStats({ tasks }: TaskStatsProps) {
  const completedCount = tasks.filter((task) => task.completed).length
  const pendingCount = tasks.length - completedCount

  return (
    <section className="task-stats" aria-label="Статистика завдань">
      <p className="task-stats__item">
        <span className="task-stats__label">Усього</span>
        <strong>{tasks.length}</strong>
      </p>
      <p className="task-stats__item">
        <span className="task-stats__label">Виконано</span>
        <strong>{completedCount}</strong>
      </p>
      <p className="task-stats__item">
        <span className="task-stats__label">Не виконано</span>
        <strong>{pendingCount}</strong>
      </p>
    </section>
  )
}

export default TaskStats
